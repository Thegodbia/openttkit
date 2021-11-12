'use strict'
const emailService = require('../services/email.service');
const moment = require('moment');
module.exports = {
    async email(ctx){
        try {
            let to;
            let campaign_name;
            let total_request;
            let conversion;
            let service_name;
            let start_range;
            let end_range;
            let html;

            //get campaign details from db
            start_range = moment().subtract(1, "days").format('YYYY-MM-DD HHMMSS')

            /**html = await ejs.render(fs.readFileSync(__dirname+'/email-template/daily_campaign_report.html', 'utf-8'), {
                campaign_name: campaign_name,
                total_request: total_request,
                conversion: conversion,
                service_name: service_name
            }) 

            const mail = {
                from: mailOptions.auth.user,
                to: to,
                subject:"YellowDot Africa || Campaign Performance || Daily Summary",
                html: html
              }

            const send_report = emailService.email(mail)**/
        } catch (error) {
            ctx.throw(500, error)
        }
    }
}