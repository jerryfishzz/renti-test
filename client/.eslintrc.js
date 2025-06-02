module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:@typescript-eslint/recommended', // typescript-eslint
    'plugin:react/recommended', // eslint-plugin-react
    'plugin:react/jsx-runtime', // avoid react scope errors
    'plugin:prettier/recommended', // eslint-plugin-prettier
    'prettier', // prettier
  ],
  plugins: ['react', 'prettier'],
  settings: {
    react: {
      version: 'detect',
    },
  },
}
