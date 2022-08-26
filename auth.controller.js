// const globals = require("../globals.js");
// const cfg = require("../config.js");
// const msg = require("../messages.js");
// const models = require("../models");
// const {logfile} = require("../logs/log-utils");

// const Intervenant = require("../models/intervenant.js");
// const Terminal = require("../models/terminal");

// var jwt = require("jsonwebtoken");
// var bcrypt = require("bcryptjs");
// const {
//   findIntervenant,
//   findTerminalid
// } = require("../models/intervenant.js");
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
var loginFunc = async (req, res) => {
  // find user in DB
  var bErr = false;
  var dateNow = new Date();
  var tentative = await Tentative.findTentative(req.body.username, req.body.terminalId);
  if (tentative.proTenta >= dateNow && tentative.numTenta >= 3) {
    logfile.logFunc(req, "E-003", msg.error.E_003 + req.body.username);
      return res.status(globals.http.accountLock).send({
        message: msg.error.accountLock,
      });
  }
  var intervenant = await Intervenant.findIntervenant(req.body.username).catch(
    (err) => {
      logfile.consoleError(err);
      bErr = true;
    }
  );

  if (bErr) {
    if (tentative.numTenta >= 3) {
      await Tentative.nextTentative(
        req.body.username,
        req.body.terminalId,
        tentative.numTenta
      ).catch((err) => {
        logfile.consoleError(err);
      });
      logfile.logFunc(req, "E-003", msg.error.E_003 + req.body.username);
      return res.status(globals.http.accountLock).send({
        message: msg.error.accountLock,
      });
    } else {
      await Tentative.failTentative(
        req.body.username,
        req.body.terminalId,
        tentative
      ).catch((err) => {
        logfile.consoleError(err);
      });
      logfile.logFunc(req, "E-001", msg.error.E_001 + req.body.username);
      return res.status(globals.http.noAuth).send({
        message: msg.error.invalidUserOrPassword,
      });
    }
  }

  if (intervenant) {
    //check password
    var passValid = bcrypt.compareSync(req.body.password, intervenant.pass);
    if (!passValid) {
      if (tentative.numTenta >= 3) {
        await Tentative.nextTentative(
          req.body.username,
          req.body.terminalId,
          tentative.numTenta
        ).catch((err) => {
          logfile.consoleError(err);
        });
        logfile.logFunc(req, "E-003", msg.error.E_003 + req.body.username);
        return res.status(globals.http.accountLock).send({
        message: msg.error.accountLock,
      });
      } else {
        await Tentative.failTentative(
          req.body.username,
          req.body.terminalId,
          tentative
        ).catch((err) => {
          logfile.consoleError(err);
        });
      logfile.logFunc(req, "W-001", msg.warning.W_001 + intervenant.pseudo);
      return res.status(globals.http.noAuth).send({
        message: msg.error.invalidUserOrPassword,
      });
      }
    }
  }

  if (intervenant) {
    // si le terminal_code_id est vide 401
    if (req.body.terminalId.length < 1) {
      logfile.logFunc(req, "W-004", msg.warning.W_004 + intervenant.pseudo);
      return res.status(globals.http.noAuth).send({
        message: msg.error.invalidUserOrPassword,
      });
    } else {
      // enrich terminalId with IP
      req.body.terminalId = _cleanupIP(req.ip) + req.body.terminalId;
    }

    // vérifie si le terminal_code_id est associer à l'intervenant
    var terminal = await Terminal.verifyInterTerminal(
      req.body.username,
      req.body.terminalId
    ).catch((err) => {
      logfile.consoleWarning(err);
    });
    // recherché si le terminal_code_id est dans la base
    if (terminal == null) {
      var terminal = await Terminal.foundTerminal(req.body.terminalId).catch(
        (err) => {
          logfile.consoleError(err);
        }
      );
      // ajout d'un nouveau terminal
      if (!terminal) {
        var result = await Terminal.addTerminal(req.body.terminalId).catch(
          (err) => {
            logfile.consoleError(err);
          }
        );
        if (result) {
          // retrouvé le terminal ajouter
          terminal = await Terminal.foundTerminal(req.body.terminalId).catch(
            (err) => {
              logfile.consoleError(err);
            }
          );
        }
        if (terminal) {
          // association de l'intervenant avec le terminal
          await Terminal.associerTerminalIdToIntervenant(
            intervenant.id,
            terminal.terminal_id
          ).catch((err) => {
            logfile.consoleError(err);
          });
        }
      } else {
        // association de l'intervenant avec le terminal
        await Terminal.associerTerminalIdToIntervenant(
          intervenant.id,
          terminal.terminal_id
        ).catch((err) => {
          logfile.consoleError(err);
        });
        // insert réussi
      }
    }
  }

  if (intervenant && !terminal.terminal_brule_oui_non) {
    // make session token unique
    var now = new Date();
    var numExpiresIn = config.token.expiresIn;
    if (typeof numExpiresIn === "string") {
      // when TOKEN_EXPIRES_IN_SECONDS env var is set,
      // config.token.expiresIn becomes a string instead of a number
      // but, according to jsonwebtoken expiresIn parameter doc,
      // if expiresIn is a number, it is interpreted as seconds
      // if expiresIn is a string, it is interpreted as milliseconds (unless a time unit is provided)
      numExpiresIn = parseInt(numExpiresIn);
    }
    // create token
    var token = jwt.sign(
      {
        id: intervenant.id,
        pseudo: intervenant.pseudo,
        terminalId: terminal.terminal_id,
        t: now.getTime().toString(),
      },
      globals.sharedSec,
      {
        expiresIn: numExpiresIn,
      }
    );
    Tentative.tentativeSuccess(intervenant.pseudo).catch((err) => {
      logfile.consoleError(err);
    });
    await models.registerToken(token, intervenant.id, terminal.terminal_id);
    logfile.logFunc(req, "I-001", intervenant.pseudo);
    res.status(globals.http.success).send({
      accessToken: token,
      changePassword: intervenant.pw_change,
      profilePhotoUri: intervenant.photo_uri,
    });
  } else {
    return res.status(globals.http.noAuth).send({
      message: msg.error.invalidUserOrPassword,
    });
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
var logoutFunc = async (req, res) => {
  var token = req.headers[globals.httpHeader.xAccessToken];
  if (token) {
    await models.invalidateToken(token);
    res.status(globals.http.success).send({
      message: msg.info.logoutDone,
    });
    logfile.logFunc(req, "I-008", req.username);
  } else {
    logfile.logFunc(req, "E-002", msg.error.E_002 + req.username);
    res.status(globals.http.noAuth).send({
      message: msg.error.noTokenProvided,
    });
  }
};

/**
 * @param {String} ip
 * @returns {String}
 */
var _cleanupIP = (ip) => {
  if (ip) {
    var columnIdx = ip.lastIndexOf(":");
    if (columnIdx > 0) {
      var _ip = ip.slice(columnIdx + 1, ip.length);
      return _ip + " ";
    } else {
      return ip;
    }
  } else {
    return "";
  }
};

var authContr = {
  login: loginFunc,
  logout: logoutFunc,
};
module.exports.authContr = authContr;
