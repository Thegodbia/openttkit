'use strict'
const ejs = require('ejs');
const fs = require('fs');
const transporter = require('../services/email.service')
const moment = require('moment');
const sql = require('../services/query.service');

module.exports = {
    async home(ctx){
        try {
            await ctx.render('dtt/intro/index', {
                layout: 'layouts/layout_dtt_intro'
            });
        } catch (error) {
            ctx.throw(500, error);
        }
    },
    async check(ctx){
        try {
            const endtime = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
            const starttime = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
            const toCheck = await sql.requesttocheck(starttime,endtime);
            for (let i = 0; i < toCheck.length; i++) {
                const e = toCheck[i];
                const check = await sql.checkrequest(e.svcid,e.msisdn,starttime,endtime);
                if (check.length > 0) {
                    const type = (check[0].isAutoExtend == 1) ? 'autorenew' : 'oneoff'
                    const com = await sql.updaterequest(e.svcid,e.id,type);
                }
            }
            ctx.status = 200
        } catch (error) {
            ctx.throw(500, error);
        }
    }
};