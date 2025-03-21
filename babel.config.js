module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env', // Alias to import variables
        path: '.env',       // Path to .env file
        safe: false,
        allowUndefined: false,
      },
    ],
    'react-native-reanimated/plugin', // Keep this at the end
  ],
};