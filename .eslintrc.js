module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
    "no-console": "off",
    'nuxt/no-cjs-in-config': 'off',
    "vue/multi-word-component-names": ["error", {
      "ignores": ["Logo","default","index","geo","nav","searchbar","user","topbar","menu","slider","life","artistic","register","blank"]
    }]
  }
}
