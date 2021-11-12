const axios = require('axios')
//const { sendsmsLogger, subscribeLogger } = require('../services/logger.service')

module.exports = {
    /**
     * AGGREGATOR SUB API
     * @param {*} msIsdn 
     * @param {*} agg_serviceId 
     * @param {*} channelId 
     * @returns 
     */
    async agg_Sub(msIsdn, agg_serviceId, channelId){
        try {
			let agg_sub;
			//let serviceId = `"${agg_serviceId}"`
            const soap = JSON.stringify({
				msisdn: String(msIsdn),
				ServiceID: String(agg_serviceId),
				Channel: channelId
			})
			
            //subscribeLogger.info(`description: sending subscription to aggregator, payload: ${JSON.stringify(soap)}`);
            const subout = await axios.post(process.env.AGGREGATOR_SUBSCRIPTION_URL, soap, {
                headers: {
                    'Content-Type': 'application/json',
                    'CPID': process.env.AGGREGATOR_CPID,
					'X-TOKEN': process.env.AGGREGATOR_X_TOKEN
                }
            })
            //subscribeLogger.info(`description: aggregator SMS response, payload: ${subout.data}`);
            return subout.data;
        } catch (error) {
            return error.message;
            //throw(500, error)
        }
	},
    /**
     * bytecode bulkSMS
     * @param {*} phone 
     * @param {*} message 
     * @returns 
     */
    async bulksms(phone, message){
        try {
            const url = process.env.BYTECODE_BULKSMS_URL
            const headers = {
                'api-auth': process.env.BYTECODE_API_AUTH,
                'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
                'User-Agent': 'yellowdot'
            }
            const body = `------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"phone\"\r\n\r\n0${phone}\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"message\"\r\n\r\n${message}\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"sender\"\r\n\r\nDTTRADING\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--`  
            const sendbulk = await axios.post(url, body, {headers})
            return sendbulk.data.data.status;
        } catch (error) {
            return error.message;
        }
    }
}