import Session from '../models/session';

export default function(req, res, next) {
    const token = req.body.token;
    return Session.findOne({ token })
        .then(ses => {
            if(ses) {
                return next();
            } else {
                res.status(401).json({ redirect: '/' })
            }
        })
};

// Validate user session, when name of session storage in config.session.fieldToSaveSession;