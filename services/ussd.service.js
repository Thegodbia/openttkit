const axios = require('axios')
const parseString = require('xml2js')

module.exports = {
    //sendUSSD
    async sendUSSD(msIsdn, spId, spPassword, serviceId, url, msgType, senderCB, ussdOpType, serviceCode, codeScheme, ussdString) {
        try {
            const menu = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
xmlns:loc="http://www.csapi.org/schema/parlayx/ussd/send/v1_0/local">
<soapenv:Header>
	<tns:RequestSOAPHeader xmlns:tns="http://www.huawei.com.cn/schema/common/v2_1">
	<tns:spId>${spId}</tns:spId>
	<tns:spPassword>${spPassword}</tns:spPassword>
	<tns:serviceId>${serviceId}</tns:serviceId>
	<tns:timeStamp>20200923220053</tns:timeStamp>
	<tns:OA>${msIsdn}</tns:OA>
	<tns:FA>${msIsdn}</tns:FA>
	</tns:RequestSOAPHeader>
</soapenv:Header>
<soapenv:Body>
	<loc:sendUssd>
		<loc:msgType>${msgType}</loc:msgType>
		<loc:senderCB>${senderCB}</loc:senderCB>
		<loc:receiveCB>${senderCB}</loc:receiveCB>
		<loc:ussdOpType>${ussdOpType}</loc:ussdOpType>
		<loc:msIsdn>${msIsdn}</loc:msIsdn>
		<loc:serviceCode>${serviceCode}</loc:serviceCode>
		<loc:codeScheme>${codeScheme}</loc:codeScheme>
		<loc:ussdString>${ussdString}</loc:ussdString>
	</loc:sendUssd>
</soapenv:Body>
</soapenv:Envelope>`
            subscribeLogger.info(`description: sending subscription request, payload: ${JSON.stringify(soap)}`) 
            const subscription = await axios.post(url, soap, {
                headers: {
                    'Content-Type': 'text/xml; Charset=UTF-8',
                    'SOAPAction': ""
                }
            })
			const ussdpush = await axios.post(url, menu, {
                headers: {
                    'Content-Type': 'text/xml',
                    'SOAPAction': ""
                }
            })
            const newUssdPush = ussdpush.data
            let optionData = await parseString.parseStringPromise(newUssdPush, { mergeAttrs: true })
            let newOptionData = optionData["soapenv:Envelope"]["soapenv:Body"]
            let newOptionDataNext = Object.assign({}, newOptionData)
            let optionReceipt = newOptionDataNext['0']['ns1:sendUssdResponse']
            let optionReceiptData = Object.assign({}, optionReceipt)
            let newOptionReceipt = optionReceiptData['0']['ns1:result']['0']
            return newOptionReceipt;
        } catch (error) {
            throw(500, error)
        }
    }
}