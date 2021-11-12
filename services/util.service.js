const   bcrypt      = require('bcrypt');
const   saltRounds  = 10;
const Joi = require('joi');

module.exports = {
    async hashPassword(password) {
        try {
            return await bcrypt.hash(password, saltRounds);
        } catch (error) {
            return error.message
        }
    },
    async comparePassword(password, hash){
        try {
            return await bcrypt.compare(password, hash)
        } catch (error) {
            return error.message
        }
    },
    /**
   * REGISTER VALIDATION
   */
   async registerinput(data){
        try {
            const schema = Joi.object({
                first: Joi.string().required().min(3).max(15).trim().messages({'string.max':`Invalid input`,'string.min':`Invalid input`}),
                last: Joi.string().required().min(3).max(15).trim().messages({'string.max':`Invalid input`}),
                msisdn: Joi.string().length(11).pattern(/((7025\d{6})|(7026\d{6})|(703\d{7})|(704\d{7})|(706\d{7})|(803\d{7})|(806\d{7})|(810\d{7})|(813\d{7})|(814\d{7})|(816\d{7})|(903\d{7})|(906\d{7}))/).required().trim().messages({'string.pattern.base':`Invalid MTN number`,'string.length':`Invalid phone number`}),
                password: Joi.string().required().min(4).max(4).messages({'string.length':`Invalid input`,'string.max':`Invalid input`,'string.min':`Invalid input`}),
                state: Joi.string().required().min(3).trim().messages({'string.length':`Invalid input`,'string.min':`Invalid input`})
            });
            return schema.validate(data, {abortEarly:false});
        } catch (error) {
            return error.message;
        }
    },
    async verifyinput(data){
        try {
            const schema = Joi.object({
                code: Joi.string().length(6).pattern(/^[0-9]+$/).required().trim().messages({'string.pattern.base':`invalid token`,'string.length':`Invalid token`}),
                msisdn: Joi.string().length(11).pattern(/((7025\d{6})|(7026\d{6})|(703\d{7})|(704\d{7})|(706\d{7})|(803\d{7})|(806\d{7})|(810\d{7})|(813\d{7})|(814\d{7})|(816\d{7})|(903\d{7})|(906\d{7}))/).required().trim().messages({'string.pattern.base':`Invalid MTN number`,'string.length':`Invalid phone number`}),
            });
            return schema.validate(data, {abortEarly:false});
        } catch (error) {
            return error.message;
        }
    },
    async logininput(data){
        try {
            const schema = Joi.object({
                msisdn: Joi.string().length(11).pattern(/((7025\d{6})|(7026\d{6})|(703\d{7})|(704\d{7})|(706\d{7})|(803\d{7})|(806\d{7})|(810\d{7})|(813\d{7})|(814\d{7})|(816\d{7})|(903\d{7})|(906\d{7}))/).required().trim().messages({'string.pattern.base':`Invalid MTN number`,'string.length':`Invalid phone number`}),
                password: Joi.string().required().min(4).max(4).messages({'string.length':`Invalid input`,'string.max':`Invalid input`,'string.min':`Invalid input`})
            });
            return schema.validate(data, {abortEarly:false});
        } catch (error) {
            return error.message;
        }
    },
    async subinput(data){
        try {
            const schema = Joi.object({
                id: Joi.string().pattern(/^[0-9]+$/).required().trim(),
                service: Joi.string().pattern(/^[0-9]+$/).required().trim(),
                msisdn: Joi.string().length(11).pattern(/((7025\d{6})|(7026\d{6})|(703\d{7})|(704\d{7})|(706\d{7})|(803\d{7})|(806\d{7})|(810\d{7})|(813\d{7})|(814\d{7})|(816\d{7})|(903\d{7})|(906\d{7}))/).required().trim().messages({'string.pattern.base':`Invalid MTN number`,'string.length':`Invalid phone number`}),
            });
            return schema.validate(data, {abortEarly:false});
        } catch (error) {
            return error.message;
        }
    },
    async authresetpininput(data){
        try {
            const schema = Joi.object({
                opassword: Joi.string().required().min(4).max(4).messages({'string.length':`Invalid input`,'string.max':`Invalid input`,'string.min':`Invalid input`}),
                password: Joi.string().required().min(4).max(4).messages({'string.length':`Invalid input`,'string.max':`Invalid input`,'string.min':`Invalid input`})
            });
            return schema.validate(data, {abortEarly:false});
        } catch (error) {
            return error.message;
        }
    }
  
}