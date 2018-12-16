import validateInputs from './inputsValidation';

export default (req, res, next) => {
    const { errors, isValid } = validateInputs(req.body);
    if(isValid) {
        const reqObject = Object.keys(req.body).reduce((initObj, item) => {
            initObj[item] = req.body[item].field;
            return initObj;
        }, {});
        req.body = reqObject;
        next();
    } else {
        res.status(400).json({ errors })
    };
};

// Validate require for validation fields type of { [fieldName]: { field: 'Some fieldName', require: true/false } }
// and return it with req.body type of { [fieldName]: 'Some fieldName' }