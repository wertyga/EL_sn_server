import isEmpty from 'lodash/isEmpty';

export default (req, res, next) => {
    const { userId, price, pair } = req.body;
    let errors = {};
    if(!userId || !price || !pair) errors = { errors: 'Some data missed' };

    if(!isEmpty(errors)) {
        res.status(400).json(errors);
    } else {
        next();
    }
};