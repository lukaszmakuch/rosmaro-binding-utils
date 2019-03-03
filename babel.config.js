module.exports = {
  presets: [
    [
      "@babel/env",
      {
        targets: {
          firefox: "60",
          chrome: "67",
          safari: "11.1",
          node: "current",
        },
        useBuiltIns: false,
      },
    ],
  ],
  env: {
    test: {
    },
    production: {
      ignore: [
        "**/testUtils.js",
        "**/test.js",
      ]
    }
  },
  plugins: ["@babel/plugin-transform-spread"]
};