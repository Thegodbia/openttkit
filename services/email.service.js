'use strict'
const nodemailer = require('nodemailer');

const mailOptions = {
    "host": process.env.EMAIL_HOST,
    "port": process.env.EMAIL_PORT,
    "auth": {
        "user": process.env.EMAIL_USER, 
        "pass": process.env.EMAIL_PASS
  }
}

module.exports = {
    async email(mail){
        try {
            const sendmail = nodemailer.createTransport(mailOptions).sendMail(mail)
            return sendmail
        } catch (err) {
            throw(err)
        }
    }
}