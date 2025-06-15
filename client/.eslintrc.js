module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'react-app', // React hooks and other React-specific rules
    'react-app/jest',
    'plugin:@typescript-eslint/recommended', // typescript-eslint
    'plugin:react/recommended', // eslint-plugin-react
    'plugin:react/jsx-runtime', // avoid react scope errors
    'plugin:prettier/recommended', // eslint-plugin-prettier
    'prettier', // eslint-config-prettier
  ],
  plugins: ['react', '@typescript-eslint', 'prettier'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'prettier/prettier': 1, // Default value is 2 (error)
  },
}
