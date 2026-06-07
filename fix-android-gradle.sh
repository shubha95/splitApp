#!/usr/bin/env bash
# =============================================================================
# fix-android-gradle.sh
#
# Problem
# -------
# When Android Studio (or any IDE) launches the Gradle daemon it does NOT
# inherit your shell PATH.  Node.js is installed via nvm, so its binary is at
#   ~/.nvm/versions/node/<version>/bin/node
# which is only on the PATH of interactive terminal sessions.
#
# Several React Native libraries call  commandLine("node", ...)  inside their
# build.gradle files.  Because the Gradle daemon cannot find "node" the build
# fails with:
#   Cannot run program "node": error=2, No such file or directory
#
# Affected libraries (and the Gradle property each one checks)
# ------------------------------------------------------------
#   react-native-gesture-handler  →  safeExtGet("REACT_NATIVE_NODE_MODULES_DIR")
#                                    reads from  rootProject.ext
#   react-native-reanimated       →  safeAppExtGet("REACT_NATIVE_NODE_MODULES_DIR")
#                                    reads from  the app module's ext
#
# Fix strategy
# ------------
#   1. android/gradle.properties
#      Add NODE_BINARY pointing to the full nvm node path.
#      Used by React Native's own bundler Gradle scripts.
#
#   2. android/build.gradle  (root)
#      Add REACT_NATIVE_NODE_MODULES_DIR to  buildscript { ext {} }
#      so gesture-handler (safeExtGet → rootProject.ext) finds react-native
#      directly and skips its node fallback.
#
#   3. android/app/build.gradle  (app module)
#      Add  ext.REACT_NATIVE_NODE_MODULES_DIR
#      so reanimated (safeAppExtGet → app project ext) finds react-native
#      directly and skips its node fallback.
#
# Usage
# -----
#   chmod +x fix-android-gradle.sh
#   ./fix-android-gradle.sh
# =============================================================================

set -euo pipefail

# ── helpers ──────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()    { echo -e "${GREEN}[fix]${NC} $*"; }
warn()    { echo -e "${YELLOW}[warn]${NC} $*"; }
error()   { echo -e "${RED}[error]${NC} $*"; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ANDROID_DIR="$SCRIPT_DIR/android"

# ── 1. Locate node ───────────────────────────────────────────────────────────
NODE_BINARY="$(command -v node 2>/dev/null || true)"

if [[ -z "$NODE_BINARY" ]]; then
  error "node not found in PATH. Make sure nvm is loaded (source ~/.nvm/nvm.sh) and run again."
fi

info "Found node at: $NODE_BINARY"

# Absolute, symlink-resolved path
NODE_BINARY_REAL="$(readlink -f "$NODE_BINARY" 2>/dev/null || realpath "$NODE_BINARY" 2>/dev/null || echo "$NODE_BINARY")"
info "Resolved node binary: $NODE_BINARY_REAL"

# ── 2. Compute the react-native path ─────────────────────────────────────────
RN_DIR="$SCRIPT_DIR/node_modules/react-native"

if [[ ! -d "$RN_DIR" ]]; then
  error "react-native not found at $RN_DIR — run 'npm install' first."
fi

info "React Native directory: $RN_DIR"

# ── 3. Fix: android/gradle.properties ────────────────────────────────────────
GRADLE_PROPS="$ANDROID_DIR/gradle.properties"

if grep -q "^NODE_BINARY=" "$GRADLE_PROPS" 2>/dev/null; then
  # Update existing entry
  sed -i.bak "s|^NODE_BINARY=.*|NODE_BINARY=$NODE_BINARY_REAL|" "$GRADLE_PROPS"
  info "Updated NODE_BINARY in gradle.properties"
else
  echo "" >> "$GRADLE_PROPS"
  echo "NODE_BINARY=$NODE_BINARY_REAL" >> "$GRADLE_PROPS"
  info "Added NODE_BINARY to gradle.properties"
fi

# Remove any stale REACT_NATIVE_NODE_MODULES_DIR from gradle.properties
# (it doesn't work there — safeExtGet reads rootProject.ext, not project properties)
if grep -q "^REACT_NATIVE_NODE_MODULES_DIR=" "$GRADLE_PROPS" 2>/dev/null; then
  sed -i.bak "/^REACT_NATIVE_NODE_MODULES_DIR=/d" "$GRADLE_PROPS"
  warn "Removed REACT_NATIVE_NODE_MODULES_DIR from gradle.properties (wrong location — moved to build.gradle ext)"
fi

# ── 4. Fix: android/build.gradle (root) ──────────────────────────────────────
ROOT_BUILD="$ANDROID_DIR/build.gradle"
MARKER="REACT_NATIVE_NODE_MODULES_DIR"

if grep -q "$MARKER" "$ROOT_BUILD" 2>/dev/null; then
  # Update in case the path changed (e.g. node version bump)
  sed -i.bak "s|REACT_NATIVE_NODE_MODULES_DIR = .*|REACT_NATIVE_NODE_MODULES_DIR = new File(rootDir, \"../node_modules/react-native\").absolutePath|" "$ROOT_BUILD"
  info "Updated REACT_NATIVE_NODE_MODULES_DIR in android/build.gradle (already present)"
else
  # Inject before the closing brace of  ext { }  inside  buildscript { }
  # Strategy: insert after the last line that looks like  SomeKey = SomeValue  inside ext
  python3 - "$ROOT_BUILD" "$MARKER" <<'PYEOF'
import sys, re

path = sys.argv[1]
marker = sys.argv[2]
inject = '        REACT_NATIVE_NODE_MODULES_DIR = new File(rootDir, "../node_modules/react-native").absolutePath\n'

with open(path) as f:
    content = f.read()

# Insert just before the closing brace of the first ext { } block
pattern = r'(buildscript\s*\{[^}]*ext\s*\{)(.*?)(\})'
def replacer(m):
    return m.group(1) + m.group(2) + inject + m.group(3)

new_content = re.sub(pattern, replacer, content, count=1, flags=re.DOTALL)

with open(path, 'w') as f:
    f.write(new_content)
PYEOF
  info "Added REACT_NATIVE_NODE_MODULES_DIR to android/build.gradle (rootProject.ext)"
fi

# ── 5. Fix: android/app/build.gradle ─────────────────────────────────────────
APP_BUILD="$ANDROID_DIR/app/build.gradle"

if grep -q "ext\.REACT_NATIVE_NODE_MODULES_DIR" "$APP_BUILD" 2>/dev/null; then
  sed -i.bak "s|ext\.REACT_NATIVE_NODE_MODULES_DIR = .*|ext.REACT_NATIVE_NODE_MODULES_DIR = new File(rootDir, \"../node_modules/react-native\").absolutePath|" "$APP_BUILD"
  info "Updated ext.REACT_NATIVE_NODE_MODULES_DIR in android/app/build.gradle (already present)"
else
  # Insert after the last  apply plugin:  line
  python3 - "$APP_BUILD" <<'PYEOF'
import sys, re

path = sys.argv[1]
inject = (
    '\n'
    '// Tell react-native-reanimated (and other libs using safeAppExtGet) where react-native lives,\n'
    '// so they skip the `commandLine("node", ...)` fallback that fails in IDE Gradle daemons.\n'
    'ext.REACT_NATIVE_NODE_MODULES_DIR = new File(rootDir, "../node_modules/react-native").absolutePath\n'
)

with open(path) as f:
    lines = f.readlines()

# Find the last "apply plugin:" line
last_plugin_idx = -1
for i, line in enumerate(lines):
    if re.match(r'\s*apply plugin:', line):
        last_plugin_idx = i

if last_plugin_idx == -1:
    print("WARNING: could not find 'apply plugin:' in app/build.gradle — appending at end")
    lines.append(inject)
else:
    lines.insert(last_plugin_idx + 1, inject)

with open(path, 'w') as f:
    f.writelines(lines)
PYEOF
  info "Added ext.REACT_NATIVE_NODE_MODULES_DIR to android/app/build.gradle (app project ext)"
fi

# ── 6. Clean up .bak files created by sed ────────────────────────────────────
rm -f "$GRADLE_PROPS.bak" "$ROOT_BUILD.bak" "$APP_BUILD.bak"

# ── 7. Optional: create /usr/local/bin/node symlink ──────────────────────────
SYMLINK="/usr/local/bin/node"
if [[ ! -e "$SYMLINK" ]]; then
  warn "No symlink found at $SYMLINK."
  warn "IDE Gradle daemons may still fail for node calls that run at TASK EXECUTION time."
  warn "To fix permanently, run:"
  warn "    sudo ln -sf $NODE_BINARY_REAL $SYMLINK"
else
  info "Symlink $SYMLINK already exists → $(readlink "$SYMLINK")"
fi

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}=======================================================${NC}"
echo -e "${GREEN}  All fixes applied.  Sync Gradle in Android Studio.  ${NC}"
echo -e "${GREEN}=======================================================${NC}"
echo ""
echo "  Files changed:"
echo "    android/gradle.properties     → NODE_BINARY"
echo "    android/build.gradle          → rootProject.ext.REACT_NATIVE_NODE_MODULES_DIR"
echo "    android/app/build.gradle      → ext.REACT_NATIVE_NODE_MODULES_DIR"
echo ""
