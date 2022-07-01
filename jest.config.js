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
        "!src/*.ts",
        "!./*",
        "!src/enums/*.ts",
        "!src/server/api/*.ts",
        "!src/interfaces/*.ts",
        "!src/server/routes/*.ts",
        "!src/server/models/*.ts",
        "!src/server/middlewares/*.ts"
    ]
};
