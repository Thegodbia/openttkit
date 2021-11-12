const cron     =   require('node-cron');
const axios = require('axios');

module.exports = async () => {
    //check for subscription status using cron
    cron.schedule("*/30 * * * *", async ()=>{
        console.log("running a task every 30 minute");
        await axios.get(`http://localhost:4111/checksubscription`);
    });

    //define another cron task here
    //cron.schedule("*/5 * * * * *", ()=>{
    //    console.log("running a task every 5 second");
    //});
}
