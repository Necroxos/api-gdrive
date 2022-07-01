module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    moduleFileExtensions: ['ts', 'js', 'json'],
    roots: ['test'],
    bail: 1,
    verbose: true,
    coverageDirectory: './coverage',
    collectCoverageFrom: [
        "./src/**/*.{ts,tsx}",
        '!**/node_modules/**',
        "!src/server/enums/*.ts",
        "!src/server/constants/*.ts",
        "!src/server/interfaces/*.ts"
    ]
};
