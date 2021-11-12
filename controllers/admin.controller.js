'use strict'
//const ejs = require('ejs');
//const fs = require('fs');
//const transporter = require('../services/email.service')
const apiService = require("../services/api.service");
const moment = require('moment');;
const UtilService   = require('../services/util.service')
const JwtService    = require('../services/jwt.service')
let response;
module.exports = {
    async home(ctx){
        try {
            //const services = await ctx.trade.query("SELECT `first`,`last`,`role` FROM `users` WHERE `id`="+ctx.state.user,{type: ctx.trade.QueryTypes.SELECT});
            const details = await ctx.trade.query("SELECT COUNT(`subscription_requests`.`msisdn`) AS request, COUNT( CASE WHEN `state` = 'active' THEN 1 END ) AS conversion_count, SUM(CASE WHEN `state` = 'active' THEN `amount` ELSE 0 END) AS conversion, SUM(CASE WHEN `state` = 'active' THEN `commission` ELSE 0 END) AS commission FROM `subscription_requests` WHERE 1",{type: ctx.trade.QueryTypes.SELECT});
            const top5 = await ctx.trade.query("SELECT `users`.`msisdn`, SUM(CASE WHEN `state` = 'active' THEN `commission` ELSE 0 END) AS commission FROM `subscription_requests`, `users` WHERE `subscription_requests`.`updatedAt` BETWEEN DATE_SUB(NOW(), INTERVAL 6 DAY) AND NOW() AND  `users`.`id`=`subscription_requests`.`user` AND `users`.`role` != 'Administrator' GROUP BY `users`.`msisdn` ORDER BY commission DESC LIMIT 5",{type: ctx.trade.QueryTypes.SELECT});
            //const activities = await ctx.trade.query("SELECT `subscription_requests`.`createdAt` AS date, `subscription_requests`.`msisdn`, `subscription_requests`.`type`, `subscription_requests`.`amount`, `subscription_requests`.`commission`, `service_configuration`.`name` FROM `subscription_requests`, `service_configuration` WHERE `subscription_requests`.`user` ="+ctx.state.user+" AND `subscription_requests`.`state` = 'active' AND `service_configuration`.`agg_sid` = `subscription_requests`.`service`  ORDER BY `subscription_requests`.`createdAt` DESC LIMIT 10",{type: ctx.trade.QueryTypes.SELECT});
            //console.log(activities);
            //const 
            

            const dash = {
                //'name': services[0].last +" "+ services[0].first,
                //'role': services[0].role,
                'id': ctx.state.user,
                'request': details[0].request,
                'conversion_count': details[0].conversion_count,
                'conversion': details[0].conversion,
                'commission': details[0].commission,
                'top5': top5
                //'activities': activities
                
            }
            await ctx.render('dtt/admin/home/index', {
                layout: 'layout_dtt_admin',
                dash: dash,
                //moment: moment
            });
        } catch (error) {
            ctx.throw(500, error);
        }
    },
    /**
     * send subscription
     */
     async subscription(ctx){
        try {
            //GET
            if (ctx.method == 'GET') {
                try {
                    const services = await ctx.trade.query("SELECT `service_configuration`.`name`, `service_configuration`.`agg_sid` FROM `service_configuration`",{type: ctx.trade.QueryTypes.SELECT});
                    const details = {
                        services: services,
                        user: ctx.state.user
                    }
                    await ctx.render('dtt/agent/subscribe/index', {
                        layout: 'layout_dtt_agent',
                        details: details
                    });
                } catch (error) {
                    ctx.throw(500, error)
                }
            }
            //POST
            if (ctx.method == 'POST') {
                try {
                    console.log(ctx.request.body);
                    const { id, service, msisdn } = ctx.request.body;

                    if(!service || service.length <= 0 || service === '' || service === 'select service'){
                        ctx.throw(400, 'select a service')
                    }
                    if (!msisdn || msisdn.length <= 10 || msisdn.length >= 12) {
                        ctx.throw(400, 'provide 11 digit phone number in format 0703XXXXXXX')
                    }

                    //check if msisdn exist in the table
                    const exist = await ctx.trade.query("SELECT `msisdn` FROM `subscription_requests` WHERE `msisdn`='"+msisdn+"'",{type: ctx.trade.QueryTypes.SELECT});
                    console.log(exist);
                    if (exist && exist.length > 0) {
                        ctx.throw(400, 'User exist')
                        //console.log('User exist');
                    }
                    if (!exist || exist.length == 0) {
                        //console.log('send subscription request');
                        //create the request
                        const sendsubscribe = await apiService.agg_Sub(msisdn, service, 'WEB');
                        console.log(sendsubscribe);
                        if(sendsubscribe == 22007233 || (sendsubscribe.status == true && sendsubscribe.message === '22007233:Temporary Order saved successfully! DataSendStep finish end.')){
                            response = 'subscription request successfully sent'
                        }
                        const amount = (service == 526) ? '10' : (service == 525) ? '20' : (service == 322) ?  '50' : (service == 527) ? '200' : ''
                        //console.log(ctx.state.user);
                        //console.log(amount);
                        const newreq = await ctx.trade.query("INSERT INTO `subscription_requests`(`msisdn`, `service`, `user`, `description`, `amount`) VALUES ('"+msisdn+"','"+service+"','"+id+"','"+response+"','"+amount+"')",{type: ctx.trade.QueryTypes.INSERT});
                    }

                    ctx.status = 200;
                    ctx.type = 'json';
                    ctx.body = response;
                } catch (err) {
                    ctx.status = err.statusCode || 500;
                    ctx.type = 'json';
                    ctx.body= err.message
                }
            }

        } catch (error) {
            ctx.throw(500, error);
        }
    },
    async getChart(ctx){
        try {
            let conversion = []
            let date = []
            let request = []
            const lineChart = await ctx.trade.query("SELECT DATE_FORMAT(`subscription_requests`.`updatedAt`, '%Y-%m-%d'), COUNT( CASE WHEN `state` = 'active' THEN 1 END ) AS conversion_count, COUNT(`subscription_requests`.`msisdn`) AS request FROM `subscription_requests` WHERE `subscription_requests`.`updatedAt` BETWEEN DATE_SUB(NOW(), INTERVAL 10 DAY) AND NOW() GROUP BY DATE_FORMAT(`subscription_requests`.`updatedAt`,'%Y-%m-%d')", {type: ctx.trade.QueryTypes.SELECT});
            lineChart.forEach(element => {
                console.log(element);
                conversion.push(element.conversion_count);
                date.push(element["DATE_FORMAT(`subscription_requests`.`updatedAt`, '%Y-%m-%d')"])
                request.push(element.request);
            });
            console.log(conversion);
            console.log(date);
            ctx.status = 200
            ctx.type = 'json'
            ctx.body = {
                data: conversion,
                date: date,
                request: request
            }
        } catch (err) {
            ctx.status = err.statusCode || 500;
            ctx.type = 'json';
            ctx.body= err.message
        }
    },
    /**
     * REGIONS
     */
    async get_regions(ctx){
        try {
            const regions = await ctx.trade.query("SELECT * FROM `region`",{type: ctx.trade.QueryTypes.SELECT});
            await ctx.render('dtt/admin/regions/index', {
                layout: 'layout_dtt_configuration',
                regions: regions,
                //moment: moment
            });
        } catch (err) {
            ctx.status = err.statusCode || 500;
            ctx.type = 'json';
            ctx.body= err.message
        }
    },
    /**
     * REGION BY ID
     */
     async get_regionbyId(ctx){
        try {
            //console.log(ctx.params);
            let {id} = ctx.params
            //console.log(`await ctx.trade.query("SELECT * FROM region WHERE id="+${id},{type: ctx.trade.QueryTypes.SELECT})`)
            const region = await ctx.trade.query("SELECT * FROM `region` WHERE `id`="+id,{type: ctx.trade.QueryTypes.SELECT});
            /**await ctx.render('dtt/admin/regions/index', {
                layout: 'layout_dtt_configuration',
                regions: regions,
                //moment: moment
            });**/
            ctx.status = 200
            ctx.type = 'json'
            ctx.body={
                'success' : true,
                'region' : region
            }
        } catch (err) {
            ctx.status = err.statusCode || 500;
            ctx.type = 'json';
            ctx.body= err.message
        }
    },
    /**
     * EDIT REGION
     */
     async edit_region(ctx){
        try {
            let {id, region} = ctx.request.body
            //console.log(`await ctx.trade.query("SELECT * FROM region WHERE id="+${id},{type: ctx.trade.QueryTypes.SELECT})`)
            const regionEdit = await ctx.trade.query("UPDATE `region` SET `name`='"+region+"' WHERE `id`="+id,{type: ctx.trade.QueryTypes.UPDATE});
            if (!regionEdit || regionEdit.length <= 0 || regionEdit[0] == 0) {
                ctx.throw(400, 'update not successful')
            }
            ctx.status = 200
            ctx.type = 'json'
            ctx.body={
                'success' : true
            }
        } catch (err) {
            ctx.status = err.statusCode || 500;
            ctx.type = 'json';
            ctx.body= err.message
        }
    },
    /**
     * 
     * ADD REGION FORM 
     */
     async add_region_form(ctx){
        try {
            //const regions = await ctx.trade.query("SELECT * FROM `region`",{type: ctx.trade.QueryTypes.SELECT});
            await ctx.render('dtt/admin/regions/add', {
                layout: 'layout_dtt_add-edit',
                //regions: regions,
                //moment: moment
            });
        } catch (err) {
            ctx.status = err.statusCode || 500;
            ctx.type = 'json';
            ctx.body= err.message
        }
    },
    /**
     * ADD REGION
     */
    async add_region(ctx){
        try {
            let {region} = ctx.request.body;
            if (!region || region.length <= 3) {
                ctx.throw(400, 'provide correct input')
            }
            //console.log(region);
            const regions = await ctx.trade.query("INSERT INTO `region` (`name`) SELECT * FROM(SELECT '"+region+"') AS tmp WHERE NOT EXISTS (SELECT `name` FROM `region` WHERE `name`='"+region+"') LIMIT 1",{type: ctx.trade.QueryTypes.INSERT});
            
            if (!regions || regions.length <= 0 || regions[0] == 0) {
                ctx.throw(400, 'region already exist')
            }
            ctx.status = 200;
            ctx.type = 'json';
            ctx.body= {
                'success': true
            }
        } catch (err) {
            console.log(err);
            ctx.status = err.statusCode || 500;
            ctx.type = 'json';
            ctx.body= err.message
        }
    },
    /**
     * DELETE REGIONS
     */
    async delete_region(ctx){
        try {
            let {id} = ctx.params.id
            //let {id} = ctx.request.body
            console.log(ctx.params.id);
            /*if (!region || region.length <= 3) {
                ctx.throw(400, 'provide correct input')
            }
            //console.log(region);
            //const regions = await ctx.trade.query("INSERT INTO `region` (`name`) SELECT * FROM(SELECT '"+region+"') AS tmp WHERE NOT EXISTS (SELECT `name` FROM `region` WHERE `name`='"+region+"') LIMIT 1",{type: ctx.trade.QueryTypes.INSERT});
            console.log(regions);
            if (!regions || regions.length <= 0 || regions[0] == 0) {
                ctx.throw(400, 'region already exist')
            }*/
            ctx.status = 200;
            ctx.type = 'json';
            ctx.body= {
                'success': true
            }
        } catch (err) {
            console.log(err);
            ctx.status = err.statusCode || 500;
            ctx.type = 'json';
            ctx.body= err.message
        }
    },
    /**
     * GET SUB REGIONS
     */
    async get_subregions(ctx){
        try {
            const subregions = await ctx.trade.query("SELECT `sub_region`.`id` AS sub_region_id, `sub_region`.`name` AS sub_region_name, `region`.`id` AS region_id, `region`.`name` AS region_name FROM `sub_region`, `region` WHERE `region`.`id` = `sub_region`.`region_id`",{type: ctx.trade.QueryTypes.SELECT});
            const region = await ctx.trade.query("SELECT * FROM `region`",{type: ctx.trade.QueryTypes.SELECT});
            await ctx.render('dtt/admin/subregions/index', {
                layout: 'layout_dtt_configuration',
                subregions: subregions,
                region: region
                //moment: moment
            });
        } catch (err) {
            ctx.status = err.statusCode || 500;
            ctx.type = 'json';
            ctx.body= err.message
        }
    },
    /**
     * ADD SUB REGION
     */
     async add_subregion(ctx){
        try {
            console.log(ctx.request.body);
            let {subregion, region} = ctx.request.body;
            if (!subregion || subregion == '' || region == '' || !region) {
                ctx.throw(400, 'provide correct input')
            }
            //console.log(region);
            const addsubregion = await ctx.trade.query("INSERT INTO `sub_region` (`name`, `region_id`) SELECT * FROM(SELECT '"+subregion+"', '"+region+"') AS tmp WHERE NOT EXISTS (SELECT `name`, `region_id` FROM `sub_region` WHERE `name`='"+subregion+"' AND `region_id`='"+region+"') LIMIT 1",{type: ctx.trade.QueryTypes.INSERT});
            
            if (!addsubregion || addsubregion.length <= 0 || addsubregion[0] == 0) {
                ctx.throw(400, 'region already exist')
            }
            ctx.status = 200;
            ctx.type = 'json';
            ctx.body= {
                'success': true
            }
        } catch (err) {
            ctx.status = err.statusCode || 500;
            ctx.type = 'json';
            ctx.body= err.message
        }
    },
    /**
     * GET SERVICES
     */
    async get_services(ctx){
        try {
            const services = await ctx.trade.query("SELECT `id`, `name`, `product_id`, `agg_sid`, `cost` FROM `service_configuration` WHERE 1",{type: ctx.trade.QueryTypes.SELECT});
            await ctx.render('dtt/admin/services/index', {
                layout: 'layout_dtt_configuration',
                services: services,
                //moment: moment
            });
        } catch (err) {
            ctx.status = err.statusCode || 500;
            ctx.type = 'json';
            ctx.body= err.message
        }
    },
    /**
    * ADD SERVICE
    */
    async add_service(ctx){
       try {
           console.log(ctx.request.body);
           let {name, pid, agid, cost} = ctx.request.body;
           if (!name || name == '' || !pid || pid == '' || !agid || agid == '' || !cost || cost == '') {
               ctx.throw(400, 'provide correct input')
           }
           //console.log(region);
           const addservice = await ctx.trade.query("INSERT INTO `service_configuration` (`name`, `product_id`, `agg_sid`, `cost`) SELECT * FROM(SELECT '"+name+"', '"+pid+"','"+agid+"','"+cost+"') AS tmp WHERE NOT EXISTS (SELECT `name`, `product_id`, `agg_sid`, `cost` FROM `service_configuration` WHERE `name`='"+name+"' AND `product_id`='"+pid+"' AND `agg_sid` = '"+agid+"' AND `cost`="+cost+") LIMIT 1",{type: ctx.trade.QueryTypes.INSERT});
           console.log(addservice);
           if (!addservice || addservice.length <= 0 || addservice[0] == 0) {
               ctx.throw(400, 'service already exist')
           }
           ctx.status = 200;
           ctx.type = 'json';
           ctx.body= {
               'success': true
           }
       } catch (err) {
           ctx.status = err.statusCode || 500;
           ctx.type = 'json';
           ctx.body= err.message
       }
   },
    /**
     * SERVICE BY ID
     */
     async get_servicebyId(ctx){
        try {
            //console.log(ctx.params);
            let {id} = ctx.params
            //console.log(`await ctx.trade.query("SELECT * FROM region WHERE id="+${id},{type: ctx.trade.QueryTypes.SELECT})`)
            const service = await ctx.trade.query("SELECT * FROM `service_configuration` WHERE `service_configuration`.`id` ="+id+" LIMIT 1",{type: ctx.trade.QueryTypes.SELECT});
            //const subregion = await ctx.trade.query("SELECT * FROM `sub_region`",{type: ctx.trade.QueryTypes.SELECT});
            /**await ctx.render('dtt/admin/regions/index', {
                layout: 'layout_dtt_configuration',
                regions: regions,
                //moment: moment
            });**/
            console.log(service);
            ctx.status = 200
            ctx.type = 'json'
            ctx.body={
                'success' : true,
                'service' : service,
                //'subregion': subregion
            }
        } catch (err) {
            ctx.status = err.statusCode || 500;
            ctx.type = 'json';
            ctx.body= err.message
        }
    },
    /**
     * GET COMMISSION
     */
    async get_commission(ctx){
        try {
            const commission = await ctx.trade.query("SELECT `commission`.`id`, `commission`.`type`, `commission`.`amount`, `commission`.`service_id`, `service_configuration`.`name` FROM `commission`, `service_configuration` WHERE `service_configuration`.`id` = `commission`.`service_id`",{type: ctx.trade.QueryTypes.SELECT});
            await ctx.render('dtt/admin/commission/index', {
                layout: 'layout_dtt_configuration',
                commission: commission,
                //moment: moment
            });
        } catch (err) {
            ctx.status = err.statusCode || 500;
            ctx.type = 'json';
            ctx.body= err.message
        }
    },
    /**
     * GET AGENTS
     */
    async get_agents(ctx){
        try {
            const whitelisted = await ctx.trade.query("SELECT `whitelist`.`id`, `whitelist`.`msisdn` FROM `whitelist`",{type: ctx.trade.QueryTypes.SELECT});
            const agents = await ctx.trade.query("SELECT `users`.`id`, `users`.`first`, `users`.`last`, `users`.`msisdn`, `region`.`name` AS region, `sub_region`.`name` AS sub_region FROM `users`, `region`, `sub_region`, `whitelist` WHERE `users`.`role` = 'Agent' AND `whitelist`.`id` = `users`.`whitelist_id` AND `sub_region`.`id` = `whitelist`.`sub_region_id` AND `region`.`id` = `sub_region`.`id`",{type: ctx.trade.QueryTypes.SELECT});
            const region = await ctx.trade.query("SELECT * FROM `region`",{type: ctx.trade.QueryTypes.SELECT});
            const subregion = await ctx.trade.query("SELECT * FROM `sub_region`",{type: ctx.trade.QueryTypes.SELECT});
            await ctx.render('dtt/admin/agent/index', {
                layout: 'layout_dtt_configuration',
                agents: agents,
                region: region,
                subregion:subregion,
                whitelisted: whitelisted
                //moment: moment
            });
        } catch (err) {
            ctx.status = err.statusCode || 500;
            ctx.type = 'json';
            ctx.body= err.message
        }
    },
    /**
    * ADD AGENT
    */
    async add_agent(ctx){
       try {
           //console.log(ctx.request.body);
           let {first, last, msisdn, role, password} = ctx.request.body;
           if (!first || first == '' || !last || last == '' || !msisdn || msisdn == '' || !role || role == '' || !password || password == '') {
               ctx.throw(400, 'provide correct input')
           }
           //check whitelist id
           const whitelist_id = await ctx.trade.query("SELECT `id` FROM `whitelist` WHERE `msisdn`='"+msisdn+"' LIMIT 1",{type: ctx.trade.QueryTypes.SELECT});
           //console.log(whitelist_id[0].id);
           //console.log(region);
           //encrypt the password
           const encryptedPassword = await UtilService.hashPassword(password)
           //console.log(encryptedPassword);
           const addagent = await ctx.trade.query("INSERT INTO `users` (`first`, `last`, `msisdn`, `password`, `role`, `whitelist_id`) SELECT * FROM(SELECT '"+first+"', '"+last+"','"+msisdn+"','"+encryptedPassword+"','"+role+"','"+whitelist_id[0].id+"') AS tmp WHERE NOT EXISTS (SELECT `first`, `last`, `msisdn`, `role`, `whitelist_id` FROM `users` WHERE `first`='"+first+"' AND `last`='"+last+"' AND `msisdn`='"+msisdn+"' AND `role`='"+role+"' AND `password`='"+encryptedPassword+"' AND `whitelist_id`="+whitelist_id[0].id+") LIMIT 1",{type: ctx.trade.QueryTypes.INSERT});
           //console.log(addservice);
           if (!addagent || addagent.length <= 0 || addagent[0] == 0) {
               ctx.throw(400, 'service already exist')
           }
           ctx.status = 200;
           ctx.type = 'json';
           ctx.body= {
               'success': true
           }
       } catch (err) {
           ctx.status = err.statusCode || 500;
           ctx.type = 'json';
           ctx.body= err.message
       }
   },
    /**
     * GET WHITELISTED AGENTS
     */
    async get_whitelist(ctx){
        try {
            const whitelisted = await ctx.trade.query("SELECT `whitelist`.`id`, `whitelist`.`msisdn`, `sub_region_id`, `sub_region`.`name` AS sub_region_name FROM `whitelist`, `sub_region` WHERE `sub_region`.`id` = `whitelist`.`sub_region_id`",{type: ctx.trade.QueryTypes.SELECT});
            const subregion = await ctx.trade.query("SELECT * FROM `sub_region`",{type: ctx.trade.QueryTypes.SELECT});
            await ctx.render('dtt/admin/whitelist/index', {
                layout: 'layout_dtt_configuration',
                whitelisted: whitelisted,
                subregion: subregion
                //moment: moment
            });
        } catch (err) {
            ctx.status = err.statusCode || 500;
            ctx.type = 'json';
            ctx.body= err.message
        }
    },
    /**
     * ADD WHITELIST
     */
     async add_whitelist(ctx){
        try {
            let {msisdn, subregion} = ctx.request.body;
            console.log(ctx.request.body);
            if (!msisdn || msisdn.length <= 10 || msisdn.length >= 12 || !subregion || subregion == '') {
                ctx.throw(400, 'provide correct input')
            }
            //console.log(region);
            const whitelist = await ctx.trade.query("INSERT INTO `whitelist` (`msisdn`,  `sub_region_id`) SELECT * FROM(SELECT '"+msisdn+"','"+subregion+"') AS tmp WHERE NOT EXISTS (SELECT `msisdn`,`sub_region_id` FROM `whitelist` WHERE `msisdn`='"+msisdn+"' AND `sub_region_id`='"+subregion+"') LIMIT 1",{type: ctx.trade.QueryTypes.INSERT});
            
            
            if (!whitelist || whitelist.length <= 0 || whitelist[0] == 0) {
                ctx.throw(400, 'region already exist')
            }
            ctx.status = 200;
            ctx.type = 'json';
            ctx.body= {
                'success': true
            }
        } catch (err) {
            console.log(err);
            ctx.status = err.statusCode || 500;
            ctx.type = 'json';
            ctx.body= err.message
        }
    },
    /**
     * WHITELIST BY ID
     */
     async get_whitelistbyId(ctx){
        try {
            //console.log(ctx.params);
            let {id} = ctx.params
            //console.log(`await ctx.trade.query("SELECT * FROM region WHERE id="+${id},{type: ctx.trade.QueryTypes.SELECT})`)
            const whitelist = await ctx.trade.query("SELECT `whitelist`.`id`, `whitelist`.`msisdn`, `sub_region`.`name` FROM `whitelist`, `sub_region` WHERE `whitelist`.`id` = "+id+" AND `sub_region`.`id`=`whitelist`.`sub_region_id`",{type: ctx.trade.QueryTypes.SELECT});
            const subregion = await ctx.trade.query("SELECT * FROM `sub_region`",{type: ctx.trade.QueryTypes.SELECT});
            /**await ctx.render('dtt/admin/regions/index', {
                layout: 'layout_dtt_configuration',
                regions: regions,
                //moment: moment
            });**/
            console.log(whitelist);
            ctx.status = 200
            ctx.type = 'json'
            ctx.body={
                'success' : true,
                'whitelist' : whitelist,
                'subregion': subregion
            }
        } catch (err) {
            ctx.status = err.statusCode || 500;
            ctx.type = 'json';
            ctx.body= err.message
        }
    },
    /**
     * SUPPORT
     */
     async get_support(ctx){
        try {
            //const whitelisted = await ctx.trade.query("SELECT `whitelist`.`id`, `whitelist`.`msisdn`, `sub_region_id`, `sub_region`.`name` AS sub_region_name FROM `whitelist`, `sub_region` WHERE `sub_region`.`id` = `whitelist`.`sub_region_id`",{type: ctx.trade.QueryTypes.SELECT});
            //const subregion = await ctx.trade.query("SELECT * FROM `sub_region`",{type: ctx.trade.QueryTypes.SELECT});
            await ctx.render('dtt/admin/support/index', {
                layout: 'layout_dtt_add-edit',
                //whitelisted: whitelisted,
                //subregion: subregion
                //moment: moment
            });
        } catch (err) {
            ctx.status = err.statusCode || 500;
            ctx.type = 'json';
            ctx.body= err.message
        }
    },
    /**
     * FAQ
     */
     async get_faq(ctx){
        try {
            //const whitelisted = await ctx.trade.query("SELECT `whitelist`.`id`, `whitelist`.`msisdn`, `sub_region_id`, `sub_region`.`name` AS sub_region_name FROM `whitelist`, `sub_region` WHERE `sub_region`.`id` = `whitelist`.`sub_region_id`",{type: ctx.trade.QueryTypes.SELECT});
            //const subregion = await ctx.trade.query("SELECT * FROM `sub_region`",{type: ctx.trade.QueryTypes.SELECT});
            await ctx.render('dtt/admin/faq/index', {
                layout: 'layout_dtt_faq-admin',
                //whitelisted: whitelisted,
                //subregion: subregion
                //moment: moment
            });
        } catch (err) {
            ctx.status = err.statusCode || 500;
            ctx.type = 'json';
            ctx.body= err.message
        }
    }
};