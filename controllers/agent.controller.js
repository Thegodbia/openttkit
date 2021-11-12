'use strict'
const ejs = require('ejs');
const fs = require('fs');
const transporter = require('../services/email.service')
const apiService = require("../services/api.service");
const sql = require("../services/query.service");
const moment = require('moment');
const utility = require('../services/util.service');
const { opendttLogger } = require('../services/logger.service');
const functions = require('../services/functions.service');
let response;
let agent;
let valid;
let exist;
let sendsubscribe;
let services;
let details;
let request;
let start;
let end;
let message;
let sendOtp;
let code;
let userExist;
let match;
let encodedMsisdn;
let encryptedPassword;
let decodedMsisdn;
let last4;
let user;

module.exports = {
    async home(ctx){
        try {
            if(ctx.state.role == 'Agent'){
                agent = await sql.agentProfile(ctx.state.user);
                const profile = {
                    'name': `${agent.user[0].firstname} ${agent.user[0].lastname}`,
                    'role': agent.user[0].role,
                    'id': ctx.state.user,
                    'request': (!agent.agentsubdetails[0].request) ? 0 : agent.agentsubdetails[0].request,
                    'conversion_count': (!agent.agentsubdetails[0].conversion) ? 0 : agent.agentsubdetails[0].conversion,
                    'conversion': (!agent.agentsubdetails[0].revenue || agent.agentsubdetails[0].revenue == null ) ? 0 : agent.agentsubdetails[0].revenue,
                    'commission': (!agent.agentsubdetails[0].commission || agent.agentsubdetails[0].commission == null) ? 0 : agent.agentsubdetails[0].commission,
                    'activities': agent.agentactivities
                    
                }
                await ctx.render('dtt/agent/home/index', {
                    layout: 'layouts/layout_dtt_agent_home',
                    profile: profile,
                    moment: moment
                });
            }else{
                return ctx.redirect('/admin/home')
            }
            
        } catch (error) {
            opendttLogger.info(`description: agent home error, payload: ${JSON.stringify(error.message)}`);
            ctx.throw(500, error);
        }
    },
    /**
     * send subscription
     */
     async subscription(ctx){
            if (ctx.method == 'GET') {
                try {
                    services = await sql.dttservices();
                    details = {
                        services: services,
                        user: ctx.state.user
                    }
                    await ctx.render('dtt/agent/subscribe/index', {
                        layout: 'layouts/layout_dtt_agent_home',
                        details: details
                    });
                } catch (error) {
                    ctx.throw(500, error)
                }
            }
            //POST
            if (ctx.method == 'POST') {
                try {
                    valid = await utility.subinput(ctx.request.body)
                    if (valid.error) {/**const { details } = valid.error; //const message = details.map(i => i.message).join(',');**/ ctx.throw(400, 'Invalid credentials')}
                    let { id, service, msisdn } = valid.value
                    msisdn = `234${msisdn.substring(1)}`;
                    services = await sql.dttservicesby(service);
                    //check if User exists in database
                    exist = await sql.existinrequestdb(msisdn);
                    if (exist.length > 0) {
                        ctx.throw(400, 'User exist, request previously sent')
                    }
                    //send request
                    sendsubscribe = await apiService.agg_Sub(msisdn, service, 'WEB');
                    if(sendsubscribe.status == true && sendsubscribe.message === '22007233:Temporary Order saved successfully! DataSendStep finish end.'){
                        
                        request = await sql.insertrequest(msisdn,ctx.state.user,services[0].svcid,services[0].cost);
                        if (!request) {
                            ctx.throw(400, 'Request sent but en error occured');
                        }
                        response = {success: true, message: 'subscription request successfully sent'}
                    }else if(sendsubscribe.status == true && sendsubscribe.message === '22007201:The product is not allowed to subscribe because of conflict'){
                        ctx.throw(400, 'User is already subscribed to the service');
                    }else if(sendsubscribe.status == true && sendsubscribe.message === `22007330:User's balance is not enough(mdcc error).`){
                        ctx.throw(400, 'User has insufficient balance');
                    }else if(sendsubscribe.status == false && sendsubscribe.message == "Request failed: Too Frequent Requests"){
                        ctx.throw(400, 'Too many requests sent to user');
                    }else{
                        ctx.throw(400, 'subscription request failed');
                    }
                    ctx.status = 200;
                    ctx.type = 'json';
                    ctx.body = response;
                } catch (error) {
                    ctx.status = error.statusCode || 500;
                    ctx.type = 'json';
                    ctx.body= error.message
                }
        }
    },
    async getdonut(ctx){
        try {
            const donut = await sql.donut(ctx.state.user);
            ctx.status = 200
            ctx.type = 'json'
            ctx.body = [donut[0].request, donut[0].conversion_count]
        } catch (err) {
            ctx.status = err.statusCode || 500;
            ctx.type = 'json';
            ctx.body= err.message
        }
    },
    /**
     * 
     * getChart LINE graph
     */
    async getlineChart(ctx){
        try {
            let conversion = []
            let date = []
            const lineChart = await ctx.trade.query("SELECT DATE_FORMAT(`subscription_requests`.`updatedAt`, '%Y-%m-%d'), COUNT( CASE WHEN `state` = 'active' THEN 1 END ) AS conversion_count FROM `subscription_requests` WHERE `subscription_requests`.`user`="+ctx.state.user+" AND `subscription_requests`.`updatedAt` BETWEEN DATE_SUB(NOW(), INTERVAL 11 DAY) AND NOW() GROUP BY DATE_FORMAT(`subscription_requests`.`updatedAt`,'%Y-%m-%d')", {type: ctx.trade.QueryTypes.SELECT});
            lineChart.forEach(element => {
                
                conversion.push(element.conversion_count);
                date.push(element["DATE_FORMAT(`subscription_requests`.`updatedAt`, '%Y-%m-%d')"])
            });
            ctx.status = 200
            ctx.type = 'json'
            ctx.body = {
                data: conversion,
                date: date
            }
        } catch (err) {
            ctx.status = err.statusCode || 500;
            ctx.type = 'json';
            ctx.body= err.message
        }
    },
    /**
     * FAQ
     */
    async faq(ctx){
        try {
            await ctx.render('dtt/agent/faq/index', {
                layout: 'layout_dtt_faq-agent'
            });
        } catch (error) {
            ctx.throw(500, error.message)
        }
    },
    /**
     * SUPPORT
     */
    async support(ctx){
        try {
            let html;
            let mail;
            if (ctx.method == 'GET') {
                try {
                    await ctx.render('dtt/agent/support/index', {
                        layout: 'layout_dtt_faq-agent'
                    });
                } catch (error) {
                    ctx.throw(500, error);
                }
            }
            if (ctx.method == 'POST') {
                try {

                    const {message} = ctx.request.body;
                    if(!message || message == '' || message.length <= 0){
                        ctx.throw(400, 'Kindly provide appropriate input')
                    }
                    const userDetails = await ctx.trade.query("SELECT `users`.`first`, `users`.`last`, `users`.`msisdn`, `users`.`role` FROM `users` WHERE `users`.`id`="+ctx.state.user+" LIMIT 1", {type: ctx.trade.QueryTypes.SELECT});
                    html = ejs.render(fs.readFileSync(__dirname+'/email-template/contact.html', 'utf-8'), {
                        name: `${userDetails[0].first} ${userDetails[0].last}`,
                        msisdn: userDetails[0].msisdn,
                        message: message,
                        role: userDetails[0].role
                    })
                    const mailList = [
                        '"Abraham Bello" <abraham@yellowdotafrica.com>',
                        '"Usman Akinbiyi" <usman@yellowdotafrica.com>'
                    ]

                    mail = {
                        from: '"DTT Support" <ydafrica.services@gmail.com>',
                        subject:"Support from Digital Trading Toolkit",
                        html: html
                    }

                    if(html){
                        mailList.forEach( async (e, i, array) =>{
                            mail.to = e;
                        const send = await transporter.email(mail)
                        if(send){
                                //console.log(send) //In production kindly log this to file instead of console logging
                            }
                        });
                    }
                    ctx.status = 200;
                    ctx.type = 'json'
                    ctx.body = {
                        'success': true
                    }
                } catch (error) {
                    ctx.status = error.statusCode || 500;
                    ctx.type = 'json';
                    ctx.body= error.message
                }
            }

        } catch (error) {
            ctx.throw(500, error)
        }
    },
    /**
     * REPORT
     */
    async report(ctx){
        try {
            let perpage = 10;
            let page = ctx.params.id || 1
            let offset =  ((perpage * page) - perpage);
            let pages = 0
            
            
            if(Object.keys(ctx.request.query).length != 0){
                const query = (!ctx.query) ? '' : ctx.query;
                console.log(query);
                const state = (query.status == 'active') ? `'active'`: (query.status == `'pending'`) ? 'pending' : `'pending','active'` 
                console.log(state);
                const querystring = `?period=${query.period}&status=${query.status}&start=${query.start}&end=${query.end}`
                
                if (query.start.length > 0 && query.end.length > 0) {
                    console.log(state);
                    start = moment(query.start).format("YYYY-MM-DD HH:mm:ss");
                    end = moment(query.end).format("YYYY-MM-DD HH:mm:ss");
                    request = await sql.reportrange(ctx.state.user,state,start,end,perpage,offset);
                    pages = (request.total.length != 0) ? Math.ceil(request.total[0].total / perpage) : 0;
                }

                if (query.start.length <= 0 && query.end.length <= 0) {
                    console.log(state);
                    start = (query.period == 'today') ? moment().startOf("day").format("YYYY-MM-DD HH:mm:ss") : (query.period == 'week') ? moment().startOf("week").format("YYYY-MM-DD HH:mm:ss") :  moment().startOf("month").format("YYYY-MM-DD HH:mm:ss");
                    end = (query.period == 'today') ? moment().endOf("day").format("YYYY-MM-DD HH:mm:ss") : (query.period == 'week') ? moment().endOf("week").format("YYYY-MM-DD HH:mm:ss") :  moment().endOf("month").format("YYYY-MM-DD HH:mm:ss");
                    request = await sql.reportrange(ctx.state.user,state,start,end,perpage,offset);
                    pages = (request.total.length != 0) ? Math.ceil(request.total[0].total / perpage) : 0;
                }
                
                await ctx.render('dtt/agent/report/index', {
                    layout: 'layouts/layout_dtt_report-agent',
                    requests: request.request,
                    moment: moment,
                    pages: pages,
                    current:page,
                    query: querystring
                });
                
            }else{
                await ctx.render('dtt/agent/report/index', {
                    layout: 'layouts/layout_dtt_report-agent',
                    requests: [],
                    moment: moment,
                    pages: pages
                });
            }
        } catch (error) {
            throw(500, error.message);
        }
    },
    /**
     * AGENT RESET PIN
     */
    async resetpin(ctx){
        if (ctx.method == 'GET') {
            try {
            
                await ctx.render('dtt/agent/reset/index', {
                    layout: 'layouts/layout_dtt_agent_home'
                });
            } catch (error) {
                throw(500, error.message);
            }
        }
        if (ctx.method == 'POST') {
            try {
                valid = await utility.authresetpininput(ctx.request.body);
                if (valid.error) {ctx.throw(400, 'Invalid credentials')}
                let {opassword,password} = valid.value
                //get old password of user along with msisdn
                userExist = await sql.checkUserbyid(ctx.state.user);
                match = await utility.comparePassword(opassword, userExist[0].password);
                if(match === false) {
                    ctx.throw(401, 'Invalid old PIN')
                }

                //send OTP
                encodedMsisdn = await functions.base64(userExist[0].msisdn);
                encryptedPassword = await utility.hashPassword(password);
                code = await functions.otp(6);
                //update secret n temp_password
                user = await sql.updateUserSecretTempPassword(ctx.state.user,code.secret.base32,encryptedPassword);
                if (user.length <= 0) {
                    ctx.throw(401, 'an error occured, kindly try again');
                }
                message = `${code.token} is your open trading verification code`
                sendOtp = await apiService.bulksms(parseInt(userExist[0].msisdn), message);
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
        }
        
    },
    /**
     * AGENT VERIFY PIN
     */
    async verifypin(ctx){
        if (ctx.method == 'GET') {
            try {
                decodedMsisdn = await functions.decodeBase64(ctx.query.clp);
                last4 = String(decodedMsisdn).substring(7);
                await ctx.render('dtt/agent/otp/index', {
                    layout: 'layouts/layout_dtt_agent_home',
                    clp: ctx.query.clp,
                    last4: last4
                });
            } catch (error) {
                throw(500, error.message);
            }
        }
        if (ctx.method == 'POST') {
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
                ctx.type   = 'json'
                ctx.body   = {
                    success:false,
                    message: error.message
                }
            }
        }
        
    }
};