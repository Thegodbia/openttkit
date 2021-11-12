'use strict'
const otp = require('speakeasy');
const { opendttLogger } = require('./logger.service');

module.exports = {
    /**
     * ENCODE
     * @param {*} toEnconde 
     * @returns 
     */
    async base64(toEnconde){
            //create buffer
            const doBuffer = Buffer.from(toEnconde);
            //base64 encode
            const base64encoded = doBuffer.toString("hex");
            return base64encoded;
    },
    /**
     * DECODE
     * @param {*} toDecode 
     * @returns 
     */
    async decodeBase64(toDecode){
        //create buffer
        const doBuffer = Buffer.from(toDecode, "hex");
        //base64 encode
        const base64decoded = doBuffer.toString("utf8");
        return base64decoded;
    },
    /**
     * OTP GENERATOR USING SPEAKEASY
     * @param {*} secret 
     * @param {*} digits 
     * @param {*} time 
     * @returns 
     */
    async otp(digits){
        const secret = otp.generateSecret({length: 20}); 
        const token = otp.totp({
            secret: secret.base32,
            encoding: 'base32',
            digits: digits,
        });
        opendttLogger.info(`description: otp details, payload: secret - ${JSON.stringify(secret)} token - ${JSON.stringify(token)}`);
        return {secret, token};
    },
    async otpvalid(secret,token){
        const tokenValid = otp.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: token,
            window:2
        });
        opendttLogger.info(`description: otp validate, payload: secret - ${JSON.stringify(secret)} token - ${JSON.stringify(token)} tokenValid - ${JSON.stringify(tokenValid)}`);
        return tokenValid;
    }
}