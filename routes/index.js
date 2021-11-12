//index.js for routes directory
const   Router              =   require('koa-router'),
    router = new Router(),
    { introController, authController, agentController, userController, adminController } = require('../controllers'),
    isAuthenticated     =  require('../policies/isAuthenticated')
        
//define all routes here   
router.get('/', introController.home);
router.get('/sign-in', authController.get_login);
router.get('/sign-up', authController.get_register);
router.get('/reset-pin', authController.get_reset);
router.post('/sign-in', userController.signin);
//router.post('/reset-password', isAuthenticated, userController.get_reset);
router.get('/verify-otp', authController.otp_page);
router.post('/verify-otp', userController.verify_otp);
router.post('/resend-otp', userController.resendOtp);
router.post('/sign-up', userController.signup);
router.post('/greset-pin', userController.guestresetpassword);
router.get('/dtt-logout', userController.logout);


router.get('/agent/home', isAuthenticated, agentController.home);
router.get('/agent/subscription', isAuthenticated, agentController.subscription);
router.post('/agent/subscription', isAuthenticated, agentController.subscription);
router.get('/agent/donut', isAuthenticated, agentController.getdonut);


router.get('/agent/linechart', isAuthenticated, agentController.getlineChart);
router.get('/agent/faq', isAuthenticated, agentController.faq);
router.get('/agent/support', isAuthenticated, agentController.support);
router.post('/agent/support', isAuthenticated, agentController.support);
router.get('/agent/report/:id', isAuthenticated, agentController.report);
router.get('/agent/reset-pin', isAuthenticated, agentController.resetpin);
router.post('/agent/reset-pin', isAuthenticated, agentController.resetpin);
router.get('/agent/verify-otp', isAuthenticated, agentController.verifypin);

//ADMIN
router.get('/admin/home', isAuthenticated, adminController.home);
router.get('/admin/chart', isAuthenticated, adminController.getChart);
//REGION
router.get('/admin/settings-region', isAuthenticated, adminController.get_regions);
router.get('/admin/settings-region/:id', isAuthenticated, adminController.get_regionbyId);
router.get('/admin/settings-region-add', isAuthenticated, adminController.add_region_form);
router.post('/admin/settings-region-add', isAuthenticated, adminController.add_region);
router.put('/admin/settings-region-edit', isAuthenticated, adminController.edit_region);
router.delete('/admin/settings-region-delete/:id', isAuthenticated, adminController.delete_region);

router.get('/admin/settings-subregion', isAuthenticated, adminController.get_subregions);
//router.get('/admin/settings-subregion', isAuthenticated, adminController.get_subregions);
router.post('/admin/settings-subregion-add', isAuthenticated, adminController.add_subregion);
//router.get('/admin/settings-subregion', isAuthenticated, adminController.get_subregions);
//router.get('/admin/settings-subregion', isAuthenticated, adminController.get_subregions);


//services
router.get('/admin/settings-service', isAuthenticated, adminController.get_services);
router.get('/admin/settings-service/:id', isAuthenticated, adminController.get_servicebyId);
router.post('/admin/settings-service-add', isAuthenticated, adminController.add_service);
//router.put('/admin/settings-agent-edit', isAuthenticated, adminController.get_services);
//router.delete('/admin/settings-agent-delete', isAuthenticated, adminController.get_services);

//commision
router.get('/admin/settings-commission', isAuthenticated, adminController.get_commission);

//agent
router.get('/admin/settings-agent', isAuthenticated, adminController.get_agents);
//router.get('/admin/settings-agent/:id', isAuthenticated, adminController.get_agentbyId);
router.post('/admin/settings-agent-add', isAuthenticated, adminController.add_agent);
//router.put('/admin/settings-agent-edit', isAuthenticated, adminController.edit_agent);
//router.delete('/admin/settings-agent-delete/:id', isAuthenticated, adminController.delete_agent);

//whitelist
router.get('/admin/settings-whitelist', isAuthenticated, adminController.get_whitelist);
router.get('/admin/settings-whitelist/:id', isAuthenticated, adminController.get_whitelistbyId);
router.post('/admin/settings-whitelist-add', isAuthenticated, adminController.add_whitelist);
//router.put('/admin/settings-whitelist-edit', isAuthenticated, adminController.edit_whitelist);
//router.delete('/admin/settings-whitelist-delete/:id', isAuthenticated, adminController.delete_whitelist);

router.get('/admin/support', isAuthenticated, adminController.get_support);
router.get('/admin/faq', isAuthenticated, adminController.get_faq);

router.get('/checksubscription', introController.check);

//router.get('/contact-hisorted', frontendController.contact); //contact page
//router.post('/contact', frontendController.contact); //contact
//router.post('/newsletter', frontendController.newsletter); //newsletter
//router.get('/quote', frontendController.quote); //get quote page
//router.post('/quote', frontendController.quote); //get quote submit data
module.exports = router;        