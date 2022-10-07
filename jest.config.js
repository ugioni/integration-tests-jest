module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.[jt]s?(x)'],
  verbose: true,
  testTimeout: 30000,
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './output',
        filename: 'report.html',
        pageTitle: 'JestJS + PactumJS',
        logoImgPath: './assets/jest-logo.png',
        expand: true,
        openReport: false
      }
    ]
  ]
};
