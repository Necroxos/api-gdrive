import { check } from 'express-validator';

class QueryValidator {

    public imageUrlValidationRule = () => (
        check('imgUrl').isString().isLength({ min: 15 })
    );

    public folderValidationRules = () => (
        [
            check('mangaName')
                .isString()
                .isLength({ min: 2 }),
            check('chapter')
                .isInt({ min: 0 })
        ]
    );
}

const paramsValidator = new QueryValidator();
export default paramsValidator;
