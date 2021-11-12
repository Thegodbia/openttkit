const AccessControl = require("accesscontrol");
const ac = new AccessControl();
 
exports.roles = (function() {
ac.grant("Agent")
 .readOwn("profile")
 .updateOwn("profile")
 
ac.grant("Administrator")
 .extend("Agent")
 .updateAny("profile")
 .deleteAny("profile")
 
return ac;
})();