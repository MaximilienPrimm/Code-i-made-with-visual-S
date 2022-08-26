// const globals = require("../globals.js");
// const msg = require("../messages.js");
// const {logfile} = require("../logs/log-utils");
// const du = require('../utils/db-utils.js').du;
// const {Action} = require("../models/action.js");
// const {Invite} = require("../models/invite.js");
// const {Recurrence} = require("../models/recurrence.js");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
var _ajouterAction = async (req, res) => {
  var act = Action.fromJson(req.body);
  act.type = await du.getItemCodeFromItemLibOrCode(
    "ActionType",
    act.type
  );
  act.libelle = await du.getItemCodeFromItemLibOrCode(act.type, act.libelle);
  act.origine = await du.getItemCodeFromItemLibOrCode(
    "ActionOrig",
    act.origine
  );
  act.status = await du.getItemCodeFromItemLibOrCode("ActionStat", act.status);
  act.periodeQuotidienne = await du.getItemCodeFromItemLibOrCodeWithDefault(
    "HorairePl",
    act.periodeQuotidienne,
    "00"
  );
  act.actionPrecedenteLien = await du.getItemCodeFromItemLibOrCodeWithDefault(
    "TyLien",
    act.actionPrecedenteLien,
    "FD"
  );
  act.intervenantId = req.userid;

  Action.ajouterAction(act)
    .then(async (newId) => {
      var organisateur = new Invite();
      organisateur.personneId = req.userid;
      organisateur.statut = "organisateur";
      organisateur.present = true;
      await Invite.ajouterInvite(newId, organisateur);
      var newAct = await Action.chargerAction(newId);
      res.status(globals.http.success).send(newAct);
      socketFoncs.notifyAllWithId(
        req.userid,
        [],
        "planningActionUpdate",
        "planningActionUpdate",
        newId
      );
      // logfile.logFunc(req, 'I-xxxCre', newId);
    })
    .catch((err) => {
      res.status(globals.http.error).send({ message: msg.error.ajouterAction });
    });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
var _modifierAction = async (req, res) => {
  var act = Action.fromJson(req.body);
  act.type = await du.getItemCodeFromItemLibOrCode(
    "ActionType",
    act.type
  );
  act.libelle = await du.getItemCodeFromItemLibOrCode(act.type, act.libelle);
  act.origine = await du.getItemCodeFromItemLibOrCode(
    "ActionOrig",
    act.origine
  );
  act.status = await du.getItemCodeFromItemLibOrCode("ActionStat", act.status);
  act.periodeQuotidienne = await du.getItemCodeFromItemLibOrCodeWithDefault(
    "HorairePl",
    act.periodeQuotidienne,
    "00"
  );
  act.actionPrecedenteLien = await du.getItemCodeFromItemLibOrCodeWithDefault(
    "TyLien",
    act.actionPrecedenteLien,
    "FD"
  );
  act.intervenantId = req.userid;

  Action.modifierAction(act)
    .then(async (bOK) => {
      res.status(globals.http.success).send();
      socketFoncs.notifyAllWithId(
        req.userid,
        [],
        "planningActionUpdate",
        "planningActionUpdate",
        act.id
      );

      Invite.listerInvites(act.id)
        .then((invites) => {
          //invites: refresh their agenda
          var invitesList = invites.map((invite) => invite.personneId);
          socketFoncs.notifyAllWithId(
            req.userid,
            invitesList,
            "planningActionUtilisateurUpdate",
            "planningActionUtilisateurUpdate",
            act.id
          );
        })
        .catch((err) => {
          logfile.consoleError(err);
        });

      // logfile.logFunc(req, 'I-xxxMaj', newId);
    })
    .catch((err) => {
      res
        .status(globals.http.error)
        .send({ message: msg.error.modifierAction });
    });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
var _modifierListAction = async (req, res) => {
  var actionsList = [];
  req.body.actions.forEach(async (action, index) => {
    var act = Action.fromJson(action);
    act.type = await du.getItemCodeFromItemLibOrCode(
      "ActionType",
      act.type
    );
    act.libelle = await du.getItemCodeFromItemLibOrCode(act.type, act.libelle);
    act.origine = await du.getItemCodeFromItemLibOrCode(
      "ActionOrig",
      act.origine
    );
    act.status = await du.getItemCodeFromItemLibOrCode(
      "ActionStat",
      act.status
    );
    act.periodeQuotidienne = await du.getItemCodeFromItemLibOrCodeWithDefault(
      "HorairePl",
      act.periodeQuotidienne,
      "00"
    );
    act.actionPrecedenteLien = await du.getItemCodeFromItemLibOrCodeWithDefault(
      "TyLien",
      act.actionPrecedenteLien,
      "FD"
    );
    act.intervenantId = req.userid;
    actionsList.push(act);
    index++;
    if (req.body.actions.length === index) {
      actionsList.forEach((act, index) => {
        Action.modifierAction(act)
          .then(async (bOK) => {
            socketFoncs.notifyAllWithId(
              req.userid,
              [],
              "planningActionUpdate",
              "planningActionUpdate",
              act.id
            );

            Invite.listerInvites(act.id)
              .then((invites) => {
                //invites: refresh their agenda
                var invitesList = invites.map((invite) => invite.personneId);
                socketFoncs.notifyAllWithId(
                  req.userid,
                  invitesList,
                  "planningActionUtilisateurUpdate",
                  "planningActionUtilisateurUpdate",
                  act.id
                );
                index++;
                if (actionsList.length === index) {
                  res.status(globals.http.success).send();
                }
              })
              .catch((err) => {
                logfile.consoleError(err);
              });

            // logfile.logFunc(req, 'I-xxxMaj', newId);
          })
          .catch((err) => {
            res
              .status(globals.http.error)
              .send({ message: msg.error.modifierAction });
          });
      });
    }
  });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
var _listerAction = async (req, res) => {
  var actionId = req.params.id;

  Action.chargerAction(actionId)
    .then((act) => {
      res.status(globals.http.success).send(act);
    })
    .catch((err) => {
      res.status(globals.http.error).send({ message: msg.error.listerAction });
    });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
var _supprimerAction = async (req, res) => {
  var actionId = req.params.id;

  Action.supprimerAction(actionId)
    .then(async (bOK) => {
      await Action.supprimerOccurences(actionId);
      res.status(globals.http.success).send();
      socketFoncs.notifyAllWithId(
        req.userid,
        [],
        "planningActionDeleteUpdate",
        "planningActionDeleteUpdate",
        actionId
      );
    })
    .catch((err) => {
      res
        .status(globals.http.error)
        .send({ message: msg.error.supprimerAction });
    });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
var _ajouterInvite = async (req, res) => {
  var actionId = req.params.id;
  var invite = Invite.fromJson(req.body);
  invite.statut = await du.getItemCodeFromItemLibOrCode(
    "ActionStatInv",
    invite.statut
  );

  var actionOrigineId = await Action.getActionOrigineId(actionId);
  if (actionOrigineId) {
    actionId = actionOrigineId;
  }
  Invite.ajouterInvite(actionId, invite)
    .then((bOK) => {
      socketFoncs.notifyAllWithId(
        req.userid,
        [invite.personneId],
        "planningActionUtilisateurUpdate",
        "planningActionUtilisateurUpdate",
        actionId
      );
      res.status(globals.http.success).send();
    })
    .catch((err) => {
      res.status(globals.http.error).send({ message: msg.error.ajouterInvite });
    });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
var _listerInvites = async (req, res) => {
  var actionId = req.params.id;

  var actionOrigineId = await Action.getActionOrigineId(actionId);
  if (actionOrigineId) {
    actionId = actionOrigineId;
  }

  Invite.listerInvites(actionId)
    .then((invites) => {
      res.status(globals.http.success).send(invites);
    })
    .catch((err) => {
      res.status(globals.http.error).send({ message: msg.error.listerInvites });
    });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
var _mesInvitations = async (req, res) => {
  var intervenantId = req.userid;

  //Invite.listerInvitations(intervenantId).then((invitations) => {
  Invitation.listerInvitations(intervenantId)
    .then((invitations) => {
      res.status(globals.http.success).send(invitations);
    })
    .catch((err) => {
      res
        .status(globals.http.error)
        .send({ message: msg.error.listerInvitations });
    });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
var _modifierInvite = async (req, res) => {
  var actionId = req.params.id;
  var invite = Invite.fromJson(req.body);
  invite.statutCode = await du.getItemCodeFromItemLibOrCode(
    "ActionStatInv",
    invite.statut
  );

  var actionOrigineId = await Action.getActionOrigineId(actionId);
  if (actionOrigineId) {
    actionId = actionOrigineId;
  }

  Invite.modifierInvite(actionId, invite)
    .then((bOK) => {
      socketFoncs.notifyAllWithId(
        req.userid,
        [invite.personneId],
        "planningActionUtilisateurUpdate",
        "planningActionUtilisateurUpdate",
        actionId
      );
      res.status(globals.http.success).send();
    })
    .catch((err) => {
      res
        .status(globals.http.error)
        .send({ message: msg.error.modifierInvite });
    });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
var _supprimerInvite = async (req, res) => {
  var actionId = req.params.actionId;
  var inviteId = req.params.inviteId;

  var actionOrigineId = await Action.getActionOrigineId(actionId);
  if (actionOrigineId) {
    actionId = actionOrigineId;
  }

  Invite.supprimerInvite(actionId, inviteId)
    .then((bOK) => {
      socketFoncs.notifyAllWithId(
        req.userid,
        [inviteId],
        "planningActionUtilisateurUpdate",
        "planningActionUtilisateurUpdate",
        actionId
      );
      res.status(globals.http.success).send();
    })
    .catch((err) => {
      res
        .status(globals.http.error)
        .send({ message: msg.error.supprimerInvite });
    });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
var _ajouterRecurrence = async (req, res) => {
  var actionId = req.params.id;
  var recur = Recurrence.fromJson(req.body);
  recur.tousLes = await du.getItemCodeFromItemLibOrCode(
    "ActionRecur",
    recur.tousLes
  );
  recur.jour = await du.getItemCodeFromItemLibOrCode(
    "ActionJourRec",
    recur.jour
  );

  var actionOrigineId = await Action.getActionOrigineId(actionId);
  if (actionOrigineId) {
    actionId = actionOrigineId;
  }

  Recurrence.ajouterRecurrence(actionId, recur)
    .then((bOK) => {
      Action.chargerAction(actionId)
        .then((act) => {
          act.recurrence = true;
          Action.modifierActionRecurrence(act)
            .then(async (bmodifOK) => {
              // creation des occurences de l'action
              await Action.ajouterOccurences(act, recur);
              res.status(globals.http.success).send();
            })
            .catch((err) => {
              res
                .status(globals.http.error)
                .send({ message: msg.error.modifierAction });
            });
        })
        .catch((err) => {
          res
            .status(globals.http.error)
            .send({ message: msg.error.listerAction });
        });
    })
    .catch((err) => {
      res
        .status(globals.http.error)
        .send({ message: msg.error.ajouterRecurrence });
    });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
var _lireRecurrence = async (req, res) => {
  var actionId = req.params.id;

  var actionOrigineId = await Action.getActionOrigineId(actionId);
  if (actionOrigineId) {
    actionId = actionOrigineId;
  }
  Recurrence.chargerRecurrence(actionId)
    .then((recur) => {
      if (recur == null) res.status(globals.http.empty).send();
      else res.status(globals.http.success).send(recur);
    })
    .catch((err) => {
      res
        .status(globals.http.error)
        .send({ message: msg.error.chargerRecurrence });
    });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
var _modifierRecurrence = async (req, res) => {
  var actionId = req.params.id;
  var recur = Recurrence.fromJson(req.body);
  recur.tousLes = await du.getItemCodeFromItemLibOrCode(
    "ActionRecur",
    recur.tousLes
  );
  recur.jour = await du.getItemCodeFromItemLibOrCode(
    "ActionJourRec",
    recur.jour
  );

  var actionOrigineId = await Action.getActionOrigineId(actionId);
  if (actionOrigineId) {
    actionId = actionOrigineId;
  }

  Recurrence.modifierRecurrence(actionId, recur)
    .then((bOK) => {
      Action.supprimerOccurences(actionId)
        .then(async (bSuppOK) => {
          var act = await Action.chargerAction(actionId);
          act.recurrence = true;
          // creation des occurences de l'action
          await Action.ajouterOccurences(act, recur);
          res.status(globals.http.success).send();
        })
        .catch((err) => {
          res
            .status(globals.http.error)
            .send({ message: msg.error.supprimerRecurrenceOccurences });
        });
    })
    .catch((err) => {
      res
        .status(globals.http.error)
        .send({ message: msg.error.modifierRecurrence });
    });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
var _supprimerRecurrence = async (req, res) => {
  var actionId = req.params.id;

  var actionOrigineId = await Action.getActionOrigineId(actionId);
  if (actionOrigineId) {
    actionId = actionOrigineId;
  }

  Recurrence.supprimerRecurrence(actionId)
    .then((bOK) => {
      Action.chargerAction(actionId)
        .then((act) => {
          act.recurrence = false;
          Action.modifierActionRecurrence(act)
            .then(async (bModifOK) => {
              await Action.supprimerOccurences(actionId);
              res.status(globals.http.success).send();
            })
            .catch((err) => {
              res
                .status(globals.http.error)
                .send({ message: msg.error.modifierAction });
            });
        })
        .catch((err) => {
          res
            .status(globals.http.error)
            .send({ message: msg.error.listerAction });
        });
    })
    .catch((err) => {
      res
        .status(globals.http.error)
        .send({ message: msg.error.supprimerRecurrence });
    });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
var _agendaPatient = async (req, res) => {
  var patientId = req.params.id;
  var fromDate = req.headers["from"];
  var toDate = req.headers["to"];

  Action.chargerAgendaPatient(patientId, fromDate, toDate)
    .then((actions) => {
      res.status(globals.http.success).send(actions);
    })
    .catch((err) => {
      res
        .status(globals.http.error)
        .send({ message: msg.error.listerActionsPatient });
    });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
var _allPatientsAgendas = async (req, res) => {
  var fromDate = req.headers["from"];
  var toDate = req.headers["to"];
  var filterType = req.headers["filter-type"];
  var filterVal = req.headers["filter-value"];

  Action.chargerAllPatientsAgendas(fromDate, toDate)
    .then((actions) => {
      res.status(globals.http.success).send(actions);
    })
    .catch((err) => {
      res
        .status(globals.http.error)
        .send({ message: msg.error.listerAllActionsPatient });
    });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
var _agendaIntervenant = async (req, res) => {
  var intervenantId = req.userid;
  var fromDate = req.headers["from"];
  var toDate = req.headers["to"];
  var filterType = req.headers["filter-type"];
  var filterVal = req.headers["filter-value"];

  if (filterType === "secteur") {
    Action.chargerAgendaIntervenantBySecteur(
      intervenantId,
      fromDate,
      toDate,
      filterVal
    )
      .then((actions) => {
        res.status(globals.http.success).send(actions);
      })
      .catch((err) => {
        res
          .status(globals.http.error)
          .send({ message: msg.error.listerActionsAgendaIntervenant });
      });
  }

  Action.chargerAgendaIntervenant(intervenantId, fromDate, toDate)
    .then((actions) => {
      res.status(globals.http.success).send(actions);
    })
    .catch((err) => {
      res
        .status(globals.http.error)
        .send({ message: msg.error.listerActionsAgendaIntervenant });
    });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
var _planningIntervenant = async (req, res) => {
  var intervenantId = req.userid;
  var fromDate = req.headers["from"];
  var toDate = req.headers["to"];

  Action.chargerPlanningIntervenant(intervenantId, fromDate, toDate)
    .then((actions) => {
      res.status(globals.http.success).send(actions);
    })
    .catch((err) => {
      res
        .status(globals.http.error)
        .send({ message: msg.error.listerActionsPlanningIntervenant });
    });
};

var actionContr = {
  ajouterAction: _ajouterAction,
  modifierAction: _modifierAction,
  modifierListAction: _modifierListAction,
  listerAction: _listerAction,
  supprimerAction: _supprimerAction,
  ajouterInvite: _ajouterInvite,
  listerInvites: _listerInvites,
  modifierInvite: _modifierInvite,
  supprimerInvite: _supprimerInvite,
  ajouterRecurrence: _ajouterRecurrence,
  lireRecurrence: _lireRecurrence,
  modifierRecurrence: _modifierRecurrence,
  supprimerRecurrence: _supprimerRecurrence,
  agendaPatient: _agendaPatient,
  allPatientsAgendas: _allPatientsAgendas,
  agendaIntervenant: _agendaIntervenant,
  planningIntervenant: _planningIntervenant,
  mesInvitations: _mesInvitations,
};

module.exports.actionContr = actionContr;
