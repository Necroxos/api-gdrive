import { capitalize, capitalizeAll } from '../../../src/server/utils/helpers';

describe('Helpers', () => {

    describe('Capitalize', () => {
        let originalText: string;

        beforeEach(() => {
            originalText = 'CAPITAN AMERICA';
        });

        it('should return text with first word capitalized', () => {
            const expectedResult = 'Capitan america';
            const result = capitalize(originalText);

            expect(result).toEqual(expectedResult);
        });

        it('should return text with every word capitalized', () => {
            const expectedResult = 'Capitan America';
            const result = capitalizeAll(originalText);

            expect(result).toEqual(expectedResult);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});