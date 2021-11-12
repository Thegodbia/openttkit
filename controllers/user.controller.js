'use strict'
const JwtService    = require('../services/jwt.service')
const utility    = require('../services/util.service')
const functions    = require('../services/functions.service');
const sql = require('../services/query.service');
const apiService   = require('../services/api.service');
let valid;
let userExist;
let user;
let encryptedPassword;
let encodedMsisdn;
let code;
let message;
let sendOtp;
let decodedMsisdn;
let verifycode;
let updateUser;
let match;
let token;
let signedIn;
module.exports = {
    /**
     * SIGNUP
     * @param {*} ctx 
     */
    async signup(ctx){
        try {
            valid = await utility.registerinput(ctx.request.body);
            if (valid.error) {/**const { details } = valid.error; //const message = details.map(i => i.message).join(',');**/ ctx.throw(400, 'Invalid input, kindly retry')}
            let {first,last,msisdn,password,state} = valid.value
            encryptedPassword = await utility.hashPassword(password);
            encodedMsisdn = await functions.base64(msisdn);
            code = await functions.otp(6);
            //check if User exists
            userExist = await sql.checkUser(msisdn);
            if (userExist.length > 0 ){
                if (userExist[0].isActive === 1) {
                    ctx.throw(401, 'User already exist, kindly login');
                }
                if (userExist[0].isActive === 0) {
                    user = await sql.updateUserSecret(userExist[0].id,code.secret.base32);
                }
            }
            
            //new user
            if (userExist.length <= 0) {
                user = await sql.insertUser(first,last,msisdn,state,encryptedPassword,code.secret.base32);
            }
            
            if (user.length <= 0) {
                ctx.throw(401, 'an error occured, kindly try again');
            }
            //insert
            message = `${code.token} is your open trading verification code`
            sendOtp = await apiService.bulksms(parseInt(msisdn), message);
            if(sendOtp !== "SUCCESSFUL"){
                ctx.throw(401, 'an error occured, kindly try again');
            }
            ctx.status=200
            ctx.type='json'
            ctx.body={
                success:true,
                clp: encodedMsisdn
            }
        }catch(error) {
            //userLogger.error( `error: ${err}`)
            //ctx.throw(500, err)
            ctx.status=error.statusCode || 500;
            ctx.type='json'
            ctx.body={
                success:false,
                message: error.message
            }
        }
    },
    /**
     * VERIFY OTP
     * @param {*} ctx 
     */
    async verify_otp(ctx){
        try {
            let response;
            //clp is msisdn
            decodedMsisdn = await functions.decodeBase64(ctx.request.body.clp);
            //validate input
            valid = await utility.verifyinput({code: ctx.request.body.code, msisdn: decodedMsisdn});
            if (valid.error) {ctx.throw(400, 'Invalid input, kindly retry')}
            let {code,msisdn} = valid.value
            userExist = await sql.checkUser(msisdn);
            if (!userExist || userExist.length <= 0) {
                ctx.throw(401, `User doesn't exist`);
            }
            if (userExist.length <= 0) {
                ctx.throw(401, `User doesn't exist`);
            }
            //verify token
            verifycode = await functions.otpvalid(userExist[0].secret,code);
            if(verifycode == false){
                ctx.throw(400, 'Invalid or Expired OTP code')
            }
            //update User status
            if (userExist[0].temp_password != 0) {
                updateUser = await sql.updateUserTempPasswordToPassword(userExist[0].id,userExist[0].temp_password);
            }
            if (userExist[0].temp_password == 0) {
                updateUser = await sql.updateUserActive(userExist[0].id,1);
            }
            
            if (updateUser.length <= 0) {
                ctx.throw(401,'an error occured, kindly try again');
            }
            response = {
                'success': true
            }
            ctx.status = 200
            ctx.type = 'json'
            ctx.body = response;
        } catch (error) {
            ctx.status = error.statusCode || 500
            ctx.type = 'json'
            ctx.body={
                success:false,
                message: error.message
            }
        }
    },
    /**
     * SIGNIN
     * @param {*} ctx 
     */
    async signin(ctx){
        try {
            valid = await utility.logininput(ctx.request.body);
            if (valid.error) {/**const { details } = valid.error; //const message = details.map(i => i.message).join(',');**/ ctx.throw(400, 'Invalid credentials')}
            let {msisdn,password} = valid.value
            //check if User exists
            userExist = await sql.checkUser(msisdn);
            if ( !userExist || userExist.length <=0 ||  (userExist.length > 0 && userExist[0].isActive === 0)) {
                ctx.throw(401,'User does not exist, kindly signup');
            }
            match = await utility.comparePassword(password, userExist[0].password);
            if(match === false) {
                ctx.throw(401, 'Invalid credentials')
            }

            token = JwtService.issue({
                payload:{
                    user: userExist[0].id
                }
            }, '1 day');

            signedIn = {
                'success': true,
                'user': {
                    id: userExist[0].id,
                    first: userExist[0].firstname,
                    last: userExist[0].lastname,
                    msisdn: userExist[0].msisdn,
                    role: userExist[0].role
                },
                'x-authorization-token': token
            };
            ctx.session.user = signedIn
            //update last login
            ctx.status = 200;
            ctx.type = 'json';
            ctx.body = signedIn;
        } catch (error) {
            ctx.status = error.statusCode || 500
            ctx.type = 'json'
            ctx.body={
                success:false,
                message: error.message
            }
        }
    },
    /**
     * RESET PIN FOR UNAUTHENTICATED USERS
     * @param {*} ctx 
     */
    async guestresetpassword(ctx){
        try {
            valid = await utility.logininput(ctx.request.body);
            if (valid.error) {/**const { details } = valid.error; //const message = details.map(i => i.message).join(',');**/ ctx.throw(400, 'Invalid credentials')}
            let {msisdn,password} = valid.value
            //check if User exists
            userExist = await sql.checkUser(msisdn);
            if ( !userExist || userExist.length <=0 ||  (userExist.length > 0 && userExist[0].isActive === 0)) {
                ctx.throw(401,'User does not exist, kindly signup');
            }
            //send OTP
            encodedMsisdn = await functions.base64(msisdn);
            encryptedPassword = await utility.hashPassword(password);
            code = await functions.otp(6);
            //update secret n temp_password
            user = await sql.updateUserSecretTempPassword(userExist[0].id,code.secret.base32,encryptedPassword);
            if (user.length <= 0) {
                ctx.throw(401, 'an error occured, kindly try again');
            }
            message = `${code.token} is your open trading verification code`
            sendOtp = await apiService.bulksms(parseInt(msisdn), message);
            if(sendOtp !== "SUCCESSFUL"){
                ctx.throw(401, 'an error occured, kindly try again');
            }
            ctx.status=200
            ctx.type='json'
            ctx.body = {
                success:true,
                clp: encodedMsisdn
            }
        } catch (error) {
            ctx.status = error.statusCode || 500
            ctx.type   = 'json'
            ctx.body   = {
                success:false,
                message: error.message
            }
        }
    },
    async resendOtp(ctx){
        try {
            decodedMsisdn = await functions.decodeBase64(ctx.request.body.clp);
            userExist = await sql.checkUser(decodedMsisdn);
            if ( !userExist || userExist.length <=0) {
                ctx.throw(401,'User does not exist, kindly signup');
            }
            code = await functions.otp(6);
            user = await sql.updateUserSecret(userExist[0].id,code.secret.base32);
            message = `${code.token} is your open trading verification code`
            sendOtp = await apiService.bulksms(parseInt(decodedMsisdn), message);
            if(sendOtp !== "SUCCESSFUL"){
                ctx.throw(401, 'an error occured, kindly try again');
            }
            ctx.body={
                success:true
            }
        } catch (error) {
            ctx.status = error.statusCode || 500
            ctx.type   = 'json'
            ctx.body   = {
                success:false,
                message: error.message
            }
        }
    },  
    /**
     * LOGOUT
     * @param {*} ctx 
     * @returns 
     */
    async logout(ctx) {
        delete ctx.session.user;
        return ctx.redirect('/');
    }
}