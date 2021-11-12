const JwtService    = require('../services/jwt.service')
let token ;
module.exports = async (ctx, next) => {
    try {
        if (ctx.session.user.success != true) {
            return ctx.redirect('/sign-in');
        } 
        token = ctx.req.headers['x-authorization-token'] || ctx.session.user['x-authorization-token'];
        //const decodeToken = JwtService.verify(token)
        //const user = await ctx.trade.query("SELECT `id`,`msisdn` FROM `users` WHERE `id`='"+decodeToken.payload.user+"'",{type: ctx.trade.QueryTypes.SELECT})
        ctx.state.user = ctx.session.user.user.id
        ctx.state.role = ctx.session.user.user.role
        ctx.state.msisdn = ctx.session.user.user.msisdn
        ctx.state.agent = `${ctx.session.user.user.first} ${ctx.session.user.user.last}`
        await next()
    } catch (error) {
        return ctx.redirect('/sign-in');
    }
}