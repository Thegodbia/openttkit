const db = require('../models');
const {opendttLogger} = require('../services/logger.service');
let user;
let agentsubdetails;
let agentactivities;
let services;
let exist;
module.exports = {
    async checkUser(msisdn){
        try {
            await db.trade.transaction(async transaction => {
                try {
                    user = await db.trade.query("SELECT id,msisdn,firstname,lastname,password,role,isActive,secret,temp_password FROM users WHERE msisdn='"+msisdn+"' ORDER BY id DESC LIMIT 1",{type: db.trade.QueryTypes.SELECT, transaction});                    
                } catch (error) {
                    transaction.rollback();
                    opendttLogger.info(`description: check user query transaction error, payload: ${JSON.stringify(error.message)}`)
                }
            })
            return user;
        } catch (error) {
            return error.message;
        }
    },
    async checkUserbyid(id){
        try {
            await db.trade.transaction(async transaction => {
                try {
                    user = await db.trade.query("SELECT id,msisdn,password,role,isActive,secret,temp_password FROM users WHERE id="+parseInt(id)+" ORDER BY id DESC LIMIT 1",{type: db.trade.QueryTypes.SELECT, transaction});                    
                } catch (error) {
                    transaction.rollback();
                    opendttLogger.info(`description: check user by id query transaction error, payload: ${JSON.stringify(error.message)}`)
                }
            })
            return user;
        } catch (error) {
            return error.message;
        }
    },
    async insertUser(firstname,lastname,msisdn,state,password,secret){
        try {
            await db.trade.transaction(async transaction => {
                try {
                    user = await db.trade.query("INSERT INTO users (`firstname`,`lastname`,`msisdn`,`state`,`password`,`secret`)VALUES('"+firstname+"','"+lastname+"','"+msisdn+"','"+state+"','"+password+"','"+secret+"')",{type: db.trade.QueryTypes.INSERT, transaction, raw:true});                    
                } catch (error) {
                    transaction.rollback();
                }
            })
            return user;
        } catch (error) {
            return error.message;
        }
    },
    async updateUserSecret(id,secret){
        try {
            await db.trade.transaction(async transaction => {
                try {
                    user = await db.trade.query("UPDATE `users` SET `secret` = '"+secret+"' WHERE `id` = "+parseInt(id)+"",{type: db.trade.QueryTypes.UPDATE, transaction, raw:true});                    
                } catch (error) {
                    transaction.rollback();
                }
            })
            return user;
        } catch (error) {
            return error.message;
        }
    },
    async updateUserSecretTempPassword(id,secret,password){
        try {
            await db.trade.transaction(async transaction => {
                try {
                    user = await db.trade.query("UPDATE `users` SET `secret` = '"+secret+"', `temp_password`='"+password+"' WHERE `id` = "+parseInt(id)+"",{type: db.trade.QueryTypes.UPDATE, transaction, raw:true});                    
                } catch (error) {
                    transaction.rollback();
                }
            })
            return user;
        } catch (error) {
            return error.message;
        }
    },
    async updateUserTempPasswordToPassword(id,password){
        try {
            await db.trade.transaction(async transaction => {
                try {
                    user = await db.trade.query("UPDATE `users` SET `password` = '"+password+"', `temp_password`='0' WHERE `id` = "+parseInt(id)+"",{type: db.trade.QueryTypes.UPDATE, transaction, raw:true});                    
                } catch (error) {
                    transaction.rollback();
                }
            })
            return user;
        } catch (error) {
            return error.message;
        }
    },
    async updateUserActive(id,isActive){
        try {
            await db.trade.transaction(async transaction => {
                try {
                    user = await db.trade.query("UPDATE `users` SET `isActive` = "+parseInt(isActive)+" WHERE `id` = "+parseInt(id)+"",{type: db.trade.QueryTypes.UPDATE, transaction, raw:true});                    
                } catch (error) {
                    transaction.rollback();
                }
            })
            return user;
        } catch (error) {
            return error.message;
        }
    },
    async lastLogin(id,lastlogin,device){
        try {
            await db.trade.transaction(async transaction => {
                try {
                    user = await db.trade.query("UPDATE `users` SET `lastlogin` = '"+lastlogin+"', `device` = '"+device+"' WHERE `id` = "+parseInt(id)+"",{type: db.trade.QueryTypes.UPDATE, transaction, raw:true});                    
                } catch (error) {
                    transaction.rollback();
                }
            })
            return user;
        } catch (error) {
            return error.message;
        }
    },
    async agentProfile(id){
        try {
            await db.trade.transaction(async transaction => {
                try {
                    user = await db.trade.query("SELECT firstname,lastname,msisdn,role FROM users WHERE id="+parseInt(id)+" ORDER BY id DESC LIMIT 1",{type: db.trade.QueryTypes.SELECT, transaction});
                    agentsubdetails = await db.trade.query("SELECT COUNT(r.id) AS request,COUNT(CASE WHEN r.state = 'active' THEN 0 END) AS conversion,SUM(CASE WHEN r.state = 'active' THEN r.commission ELSE 0 END) AS commission, SUM(CASE WHEN r.state = 'active' THEN r.amount ELSE 0 END) AS revenue  FROM requests r WHERE r.user="+parseInt(id)+"",{type: db.trade.QueryTypes.SELECT, transaction});
                    agentactivities = await db.trade.query("SELECT DATE(r.createdAt) AS dated,r.msisdn,r.type,r.amount,r.commission,s.name FROM requests r,service_configuration s WHERE r.user="+parseInt(id)+" AND s.svcid=r.svcid  ORDER BY DATE(r.createdAt) DESC LIMIT 10",{type: db.trade.QueryTypes.SELECT, transaction});                    
                } catch (error) {
                    transaction.rollback();
                    opendttLogger.info(`description: agent profile query transaction error, payload: ${JSON.stringify(error.message)}`)
                }
            })
            return {user,agentsubdetails,agentactivities};
        } catch (error) {
            return error.message;
        }
    },
    async donut(id){
        try {
            await db.trade.transaction(async transaction => {
                try {
                    donut = await db.trade.query("SELECT COUNT(r.id) AS request, COUNT(CASE WHEN r.state='active' THEN 0 END) AS conversion_count FROM requests r WHERE r.user="+parseInt(id)+"",{type: db.trade.QueryTypes.SELECT, transaction}); 
                } catch (error) {
                    transaction.rollback();
                    opendttLogger.info(`description: donut query transaction error, payload: ${JSON.stringify(error.message)}`)
                }
            })
            return donut
        } catch (error) {
            return error.message;
        }
    },
    async dttservices(){
        try {
            await db.trade.transaction(async transaction => {
                try {
                    services = await db.trade.query("SELECT s.name,s.svcid,s.aggid FROM service_configuration s",{type: db.trade.QueryTypes.SELECT, transaction}); 
                } catch (error) {
                    transaction.rollback();
                    opendttLogger.info(`description: service details query transaction error, payload: ${JSON.stringify(error.message)}`)
                }
            })
            return services
        } catch (error) {
            return error.message;
        }
    },
    async subscription(){
        try {
            await db.trade.transaction(async transaction => {
                try {
                    services = await db.trade.query("SELECT s.name, s.aggid FROM service_configuration s",{type: db.trade.QueryTypes.SELECT, transaction}); 
                } catch (error) {
                    transaction.rollback();
                    opendttLogger.info(`description: service details query transaction error, payload: ${JSON.stringify(error.message)}`)
                }
            })
            return services
        } catch (error) {
            return error.message;
        }
    },
    async existinrequestdb(msisdn){
        try {
            await db.trade.transaction(async transaction => {
                try {
                    exist = await db.trade.query("SELECT msisdn FROM requests WHERE msisdn='"+msisdn+"'",{type: db.trade.QueryTypes.SELECT, transaction}); 
                } catch (error) {
                    transaction.rollback();
                    opendttLogger.info(`description: check request exists query transaction error, payload: ${JSON.stringify(error.message)}`)
                }
            })
            return exist;
        } catch (error) {
            return error.message;
        }
    },
    async dttservicesby(aggid){
        try {
            await db.trade.transaction(async transaction => {
                try {
                    services = await db.trade.query("SELECT s.svcid,s.cost FROM service_configuration s WHERE s.aggid="+parseInt(aggid)+" LIMIT 1",{type: db.trade.QueryTypes.SELECT, transaction}); 
                } catch (error) {
                    transaction.rollback();
                    opendttLogger.info(`description: service details by aggid query transaction error, payload: ${JSON.stringify(error.message)}`)
                }
            })
            return services
        } catch (error) {
            return error.message;
        }
    },
    async insertrequest(msisdn,id,svcid,amount){
        try {
            await db.trade.transaction(async transaction => {
                try {
                    request = await db.trade.query("INSERT INTO `requests` (`msisdn`, `user`, `svcid`, `amount`)VALUES('"+msisdn+"', "+parseInt(id)+", "+parseInt(svcid)+", '"+amount+"')",{type: db.trade.QueryTypes.INSERT, transaction}); 
                } catch (error) {
                    transaction.rollback();
                    opendttLogger.info(`description: insert request query transaction error, payload: ${JSON.stringify(error)}`)
                }
            })
            return request;
        } catch (error) {
            return error.message;
        }
    },
    async requesttocheck(start,end){
        try {
            await db.trade.transaction(async transaction => {
                try {
                    request = await db.trade.query("SELECT DISTINCTROW id,msisdn,svcid FROM requests WHERE state='pending' AND createdAt BETWEEN '"+start+"' AND '"+end+"'",{type: db.trade.QueryTypes.SELECT, transaction}); 
                } catch (error) {
                    transaction.rollback();
                    opendttLogger.info(`description: requests to check error transaction error, payload: ${JSON.stringify(error)}`)
                }
            })
            return request;
        } catch (error) {
            return error.message;
        }
    },
    async checkrequest(svcid,msisdn,start,end){
        try {
            await db.ydDb.transaction(async transaction => {
                try {
                    request = await db.ydDb.query("SELECT msisdn,isAutoExtend FROM lngmtn_subscription_history WHERE updateType=1 AND svcId="+parseInt(svcid)+" and msisdn='"+msisdn+"' AND subscription_date BETWEEN '"+start+"' AND '"+end+"' ORDER BY id DESC LIMIT 1",{type: db.ydDb.QueryTypes.SELECT, transaction}); 
                } catch (error) {
                    transaction.rollback();
                    opendttLogger.info(`description: checked request error transaction error, payload: ${JSON.stringify(error)}`)
                }
            })
            return request;
        } catch (error) {
            return error.message;
        }
    },
    async updaterequest(svcid,id,type){
        try {
            await db.trade.transaction(async transaction => {
                try {
                    commision = await db.trade.query("SELECT amount FROM commission WHERE svcId="+svcid+" AND type='"+type+"' LIMIT 1",{type: db.trade.QueryTypes.SELECT, transaction});
                    request = await db.trade.query("UPDATE requests SET state='active',commission='"+commision[0].amount+"',TYPE='"+type+"' WHERE id="+parseInt(id)+" ",{type: db.trade.QueryTypes.UPDATE, transaction}); 
                } catch (error) {
                    transaction.rollback();
                    opendttLogger.info(`description: update request error transaction error, payload: ${JSON.stringify(error)}`)
                }
            })
            return request;
        } catch (error) {
            return error.message;
        }
    },
    async reportrange(id,status,start,end,limit,offset){
        try {
            await db.trade.transaction(async transaction => {
                try {
                    total = await db.trade.query("SELECT COUNT(*) total FROM requests r,service_configuration s WHERE r.user="+parseInt(id)+" AND r.state IN("+status+") AND r.updatedAt BETWEEN '"+start+"' AND '"+end+"' AND s.svcid=r.svcid GROUP BY r.updatedAt ASC",{type: db.trade.QueryTypes.SELECT, transaction}); 
                    request = await db.trade.query("SELECT r.msisdn,r.state,r.commission,r.type,r.updatedAt,s.name FROM requests r,service_configuration s WHERE r.user="+parseInt(id)+" AND r.state IN("+status+") AND r.updatedAt BETWEEN '"+start+"' AND '"+end+"' AND s.svcid=r.svcid GROUP BY r.updatedAt ASC LIMIT "+parseInt(limit)+" OFFSET "+parseInt(offset)+"",{type: db.trade.QueryTypes.SELECT, transaction}); 
                } catch (error) {
                    transaction.rollback();
                    opendttLogger.info(`description: report range request error transaction error, payload: ${JSON.stringify(error)}`)
                }
            })
            opendttLogger.info(`description: report range request transaction, payload: total ${JSON.stringify(total)} request - ${JSON.stringify(request)}`)
            return {total,request};
        } catch (error) {
            opendttLogger.info(`description: report range request transaction error, payload: ${JSON.stringify(error)}`)
            return error.message;
        }
    }

}