//import all controllers here
const   introController = require('./intro.controller'),
        authController = require('./auth.controller'),
        adminController = require('./admin.controller'),
        agentController = require('./agent.controller'),
        emailController = require('./email.controller'),
        userController = require('./user.controller')


module.exports = {
    introController,
    authController,
    adminController,
    agentController,
    emailController,
    userController
}