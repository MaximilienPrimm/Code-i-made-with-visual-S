// const jwt = require('jsonwebtoken');
// const globals = require('./../globals.js');
// const msg = require('./../messages.js');
// const { logfile } = require("../logs/log-utils");
// const { models } = require("../models");

/*
* Responsibility : check the token validity
* If token is registered and valid, it reads user id, name and terminalId from the token and adds them the request properties :
*   - userid
*   - username
*   - terminalId
*/
verifyToken = async (req, res, next) => {
    let token = req.headers[globals.httpHeader.xAccessToken];

    if(!token) {
        logfile.consoleWarning('No token in HTTP header');
        return res.status(globals.http.noAuth).send({message: msg.error.noTokenProvided});
    }

    var registered = await models.tokenRegistered(token);
    if(!registered) {
        logfile.consoleWarning('Token not found in DB');
        return res.status(globals.http.noAuth).send({message: msg.error.tokenInvalid});
    }

    jwt.verify(token, globals.sharedSec, (err, decoded) => {
        if(err) {
            logfile.consoleWarning('Token not valid');
            logfile.consoleWarning(err);
            return res.status(globals.http.noAuth).send({message: msg.error.tokenInvalid});
        }
        req.userid = decoded.id;
        req.username = decoded.pseudo;
        req.terminalId = decoded.terminalId;
        next();
    });
};

var authJwt = {
    verifyToken: verifyToken
};

module.exports.authJwt = authJwt;
