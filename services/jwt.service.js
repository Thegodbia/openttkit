const   jwt     = require('jsonwebtoken')
module.exports = {
    issue(payload, expiresIn){
        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: expiresIn
        })
    },
    verify(token){
        return jwt.verify(token, process.env.JWT_SECRET)
    }
}
