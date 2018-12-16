import isEmpty from 'lodash/isEmpty';

export default function(data, blankField = 'Field can not be blank') {
    let errors = {};
    if(typeof data !== 'object' || data instanceof Array || Object.keys(data) < 1) {
        errors.globalError = 'Lets get out of here!';
        return {
            isValid: false,
            errors
        }
    };

    Object.keys(data).forEach(item => {
        if(item.replace(/' '|-/g, '').toLowerCase() === 'email' && data[item].field && !validateEmail(data[item].field)) {
            errors[item] = "Seems like it is not an E-mail address";
        }
        if(!data[item].field) {
            errors[item] = blankField;
        }
    });

    return {
        isValid: isEmpty(errors),
        errors
    }
};

export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Validate user's inputs, fields that require.
// Data for validation must be an object type of:
// { [fieldName]: { field: 'Some fieldName', require: true/false } }

// BlankField is an argument for error notification