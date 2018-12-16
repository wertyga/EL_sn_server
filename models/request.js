import mongoose from 'mongoose';
import emailConfig from '../common/emailConfig';

import { sendMailEE } from '../common/functions/commonFunctions';

const RequestSchema = mongoose.Schema({
    email: {
        type: String
    },
    message: {
        type: String
    }
}, { timestamps: true});

RequestSchema.post('save', function(doc) {
    const mailMessage = {
        from: 'Crypto_signer',
        to: emailConfig.auth.user,
        subject: 'Request from "Crypto_Signer"',
        html: `<div>E-mail: ${doc.email}</div><div>Message: ${doc.message}</div>`
    };
    sendMailEE.emit('send_mail', mailMessage);
});

export default mongoose.model('request', RequestSchema);