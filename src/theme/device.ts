import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Design baseline: 390 × 844 (iPhone 14 / most common Android flagship)
// All scale functions are pure math — no device-type branching needed.
// A small phone gets smaller values, a tablet gets larger values automatically.
const BASE_WIDTH  = 390;
const BASE_HEIGHT = 844;

export { SCREEN_WIDTH, SCREEN_HEIGHT };
export const isIOS     = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Horizontal scale — width, paddingHorizontal, marginHorizontal, borderRadius
export const rs = (size: number): number =>
  Math.round((SCREEN_WIDTH / BASE_WIDTH) * size);

// Vertical scale — height, paddingVertical, marginVertical, lineHeight
export const rvs = (size: number): number =>
  Math.round((SCREEN_HEIGHT / BASE_HEIGHT) * size);

// Moderate scale — less aggressive (good for borders, icon sizes, borderRadius)
// factor 0 = no scaling | 1 = full rs() scaling | default 0.5
export const rms = (size: number, factor = 0.5): number =>
  Math.round(size + (rs(size) - size) * factor);

// Font scale — gentle + pixel-ratio alignment
// Keeps fonts readable without ballooning on large screens
export const rfs = (size: number): number =>
  PixelRatio.roundToNearestPixel(rms(size, 0.45));

// Dynamic column count — divides available width by a minimum card width.
// A 390px phone with minCardWidth=300 → 1 column.
// A 768px tablet  with minCardWidth=300 → 2 columns.
// A 1024px tablet with minCardWidth=300 → 3 columns.
// No if/else needed — the screen decides.
export const columnCount = (minCardWidth = 300): number =>
  Math.max(1, Math.floor(SCREEN_WIDTH / minCardWidth));

// Pre-built responsive spacing — drop-in for the flat `spacing` object
export const rSpacing = {
  xs:  rs(4),
  sm:  rs(8),
  md:  rs(16),
  lg:  rs(24),
  xl:  rs(32),
  xxl: rs(48),
} as const;
