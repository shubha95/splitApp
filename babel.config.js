module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      envName:        'APP_ENV',
      moduleName:     '@env',
      path:           './src/.env',
      safe:           false,
      allowUndefined: false,
      verbose:        false,
    }],
    ['module-resolver', {
      root: ['./src'],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      alias: {
        '@features':   './src/features',
        '@components': './src/components',
        '@store':      './src/store',
        '@services':   './src/services',
        '@navigation': './src/navigation',
        '@hooks':      './src/hooks',
        '@theme':      './src/theme',
        '@utils':      './src/utils',
        '@config':     './src/config',
        '@types':      './src/types',
      },
    }],
    // Reanimated must be last
    'react-native-reanimated/plugin',
  ],
};
