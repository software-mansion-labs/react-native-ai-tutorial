module.exports = {
  root: true,
  extends: ['universe/native', 'prettier'],
  rules: {
    // Ensures props and state inside functions are always up-to-date
    'react-hooks/exhaustive-deps': 'warn',
    'prettier/prettier': 'error',
  },
  plugins: ['prettier'],
};
