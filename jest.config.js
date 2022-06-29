module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    moduleFileExtensions: ['ts', 'js', 'json'],
    roots: ['test'],
    bail: 1,
    verbose: true,
    collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**'],
    coverageDirectory: './coverage',
    collectCoverageFrom: [
        "./src/**/*.ts",
        "!src/config/*.ts",
        "!src/server/enums/*.ts",
        "!src/server/constants/*.ts",
        "!src/server/interfaces/*.ts"
    ],
    transformIgnorePatterns: [
        "src/config/*.ts"
    ]
};
