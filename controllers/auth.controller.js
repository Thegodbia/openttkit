'use strict'
//const ejs = require('ejs');
//const fs = require('fs');
//const transporter = require('../services/email.service')
const functions = require('../services/functions.service');

module.exports = {
    /**
     * 
     * login page 
     */
    async get_login(ctx){
        try {
            await ctx.render('dtt/login/index', {
                layout: false
            });
        } catch (error) {
            ctx.throw(500, error);
        }
    },
    /**
     * 
     * reset page 
     */
     async get_reset(ctx){
        try {
            await ctx.render('dtt/reset/index', {
                layout: false
            });
        } catch (error) {
            ctx.throw(500, error);
        }
    },
    /**
     * registration page
     */
     async get_register(ctx){
        try {
            console.log(ctx.flash());
            await ctx.render('dtt/register/index', {
                layout: false,
                message: ctx.flash()
            });
        } catch (error) {
            ctx.throw(500, error);
        }
    },
    //OTP Page
    async otp_page(ctx){
        try {
            console.log(ctx.query.clp);
            const msisdn = await functions.decodeBase64(ctx.query.clp);
            const last4 = String(msisdn).substring(7);
            await ctx.render('dtt/otp/index', {
                layout: false,
                clp: ctx.query.clp,
                last4: last4
            });
        } catch (err) {
            ctx.throw(500, err)
        }
    },
    //log out
    async logout(ctx) {
        delete ctx.session.user;
        const response = 'success'
        ctx.status = 200
        ctx.type = 'json'
        ctx.body = response
    }
};