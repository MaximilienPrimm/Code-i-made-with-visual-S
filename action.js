// const {db} = require('../db');
// const {du} = require('../utils/db-utils.js');
// const {globals} = require('../globals.js');
// var {dateUtils} = require('./../utils/date-utils');
// const {Recurrence} = require('./recurrence.js');

// const { sqls } = require("../db/requests");

/**
 * @class
 * @public
 * @property {String} id
 * @property {String} date
 * @property {String} type
 * @property {String} libelle
 * @property {String} origine
 * @property {String} origineId
 * @property {String} commentaire
 * @property {String} status
 * @property {String} periodeQuotidienne
 * @property {String} dureePrevue
 * @property {Boolean} heureDebutImperative
 * @property {String} heureDebutSouhaitee
 * @property {String} heureFinSouhaitee
 * @property {String} heureDebutPrevu
 * @property {String} heureFinPrevue
 * @property {String} heureDebutReel
 * @property {String} heureFinReelle
 * @property {String} actionPrecedenteId
 * @property {String} actionPrecedenteLien
 * @property {String} beneficiaireId
 * @property {String} intervenantId
 * @property {String} lieuId
 * @property {String} lieuContId
 * @property {String} delaiPrecedent
 * @property {Boolean} occupe
 * @property {Boolean} jourComplet
 * @property {Boolean} recurrence
 * @property {Boolean} terminee
 * @property {String} dateCre
 * @property {String} dateMaj
 * @property {String} dateSup
 */
var Action = class Action {
  // id;
  // date;
  // type;
  // libelle;
  // origine;
  // origineId;
  // commentaire;
  // status;
  // periodeQuotidienne;
  // dureePrevue;
  // heureDebutImperative;
  // heureDebutSouhaitee;
  // heureFinSouhaitee;
  // heureDebutPrevu;
  // heureFinPrevue;
  // heureDebutReel;
  // heureFinReelle;
  // actionPrecedenteId;
  // actionPrecedenteLien;
  // beneficiaireId;
  // intervenantId;
  // lieuId;
  // delaiPrecedent;
  // occupe;
  // jourComplet;
  // recurrence;
  // terminee;
  // dateCre;
  // dateMaj;
  // dateSup;

  constructor() {}

  /**
   * @param {json} json
   * @returns {Action}
   */
  static fromJson(json) {
    var act = new Action();
    act.id = json.id;
    act.date = json.date;
    act.type = json.type;
    act.libelle = json.libelle;
    act.origine = json.origine;
    act.commentaire = json.commentaire;
    act.status = json.status;
    act.periodeQuotidienne = json.periodeQuotidienne;
    act.dureePrevue = json.dureePrevue;
    act.heureDebutImperative = json.heureDebutImperative;
    act.heureDebutSouhaitee = json.heureDebutSouhaitee;
    act.heureFinSouhaitee = json.heureFinSouhaitee;
    act.heureDebutPrevu = json.heureDebutPrevu;
    act.heureFinPrevue = json.heureFinPrevue;
    act.heureDebutReel = json.heureDebutReel;
    act.heureFinReelle = json.heureFinReelle;
    act.actionPrecedenteId = json.actionPrecedenteId;
    act.actionPrecedenteLien = json.actionPrecedenteLien;
    act.beneficiaireId =
      json.beneficiaireId === "" ? null : json.beneficiaireId;
    // act.intervenantId = json.intervenantId; // forced to currently logged in user on the server side
    act.lieuId = json.lieuId;
    act.lieuContId = json.lieuContId;
    act.delaiPrecedent = json.delaiPrecedent;
    act.occupe = json.occupe;
    act.jourComplet = json.jourComplet;
    act.recurrence = json.recurrence;
    act.terminee = json.terminee;
    // act.dateCre = json.; // not read from json, handled on server side and only sent to client using fromDbRow
    // act.dateMaj = json.; // not read from json, handled on server side and only sent to client using fromDbRow
    // act.dateSup = json.; // not read from json, handled on server side and only sent to client using fromDbRow
    return act;
  }

  /**
   * @param {any} row
   * @param {bool} dateWithAs,
   * @returns {Action}
   */
  static fromDbRow(row, dateWithAs) {
    var act = new Action();
    act.id = row.action_id;
    act.personneInviteId = row.personne_invite_id; // not
    act.date = row.action_date;
    act.date = dateUtils.dateToYearMonthDayString(act.date);
    act.dureePrevue = row.action_duree_prevue;
    act.type = row.action_type_code_lib;
    if(row.action_lib_code_lib === null){
      act.libelle = row.action_lib_code;
    } else {
      act.libelle = row.action_lib_code_lib;
    }
    act.origine = row.action_origine_code_lib;
    act.origineId = row.action_origine_id;
    act.commentaire = row.action_commentaire;
    act.status = row.action_status_code_lib;
    act.periodeQuotidienne = row.action_periode_q_code_lib;
    act.heureDebutImperative = row.action_debut_real_imp; // boolean
    act.heureDebutSouhaitee = row.action_debut_souhaite;
    act.heureFinSouhaitee = row.action_fin_souhaite;
    act.heureDebutPrevu = row.action_debut_prevu;
    act.heureFinPrevue = row.action_fin_prevue;
    act.heureDebutReel = row.action_debut_reel;
    act.heureFinReelle = row.action_fin_reelle;
    act.actionPrecedenteId = row.fk_action_id_precedente;
    act.actionPrecedenteLien = row.action_lien_preced_code_lib;
    act.beneficiaireId = row.fk_personne_id_beneficiaire;
    act.intervenantId = row.fk_intervenant_id;
    act.lieuId = row.fk_lieu_id;
    act.lieuContId = row.fk_lieu_contenant_id;
    act.delaiPrecedent = row.action_delai_precedent;
    act.occupe = row.action_occupe_oui_non;
    act.jourComplet = row.action_jour_complet_oui_non;
    act.recurrence = row.action_recurrence_oui_non;
    act.terminee = row.action_terminee_oui_non;
    if (dateWithAs) {
      act.dateCre = row.act_date_cre;
      act.dateMaj = row.act_date_maj;
      act.dateSup = row.act_date_sup;
    } else {
      act.dateCre = row.date_cre;
      act.dateMaj = row.date_maj;
      act.dateSup = row.date_sup;
    }
    return act;
  }

  /**
   * @param {String} action_id
   * @returns {Promise<Action>}
   */
  static chargerAction(action_id) {
    return new Promise((resolve, reject) => {
      db.query(
        sqls.request.selectAction,
        [action_id, globals.defaultLang],
        (err, res) => {
          if (err) {
            logfile.consoleError(err);
            reject(err);
          } else {
            if (res.rows.length > 0) {
              var row = res.rows[0];
              var act = Action.fromDbRow(row);
              resolve(act);
            } else {
              reject("No action with id = " + action_id);
            }
          }
        }
      );
    });
  }

  /**
   * @param {Action} act
   * @returns {Promise<String>} action_id newly created
   */
  static ajouterAction(act) {
    return new Promise((resolve, reject) => {
      db.query(
        sqls.request.insertAction,
        [
          act.type,
          act.libelle,
          act.origine,
          act.origineId,
          act.commentaire,
          act.status,
          act.periodeQuotidienne,
          act.dureePrevue === "" ? null : act.dureePrevue,
          act.heureDebutImperative,
          act.heureDebutPrevu === "" ? null : act.heureDebutPrevu,
          act.heureFinPrevue === "" ? null : act.heureFinPrevue,
          act.heureDebutSouhaitee === "" ? null : act.heureDebutSouhaitee,
          act.heureFinSouhaitee === "" ? null : act.heureFinSouhaitee,
          act.heureDebutReel === "" ? null : act.heureDebutReel,
          act.heureFinReelle === "" ? null : act.heureFinReelle,
          act.actionPrecedenteId === "" ? null : act.actionPrecedenteId,
          act.actionPrecedenteLien === "" ? null : act.actionPrecedenteLien,
          act.beneficiaireId,
          act.intervenantId,
          act.lieuId,
          act.delaiPrecedent === "" ? null : act.delaiPrecedent,
          act.date,
          act.occupe,
          act.jourComplet,
          act.recurrence,
          act.terminee,
          null /* action_standard_id ? */,
        ],
        (err, res) => {
          if (err) {
            logfile.consoleError(err);
            reject(err);
          } else {
            // should return newly created adresse_id
            var actId = res.rows[0].action_id;
            resolve(actId);
          }
        }
      );
    });
  }

  /**
   * @param {Action} act
   * @returns {Promise<Boolean>}
   */
  static modifierAction(act) {
    return new Promise((resolve, reject) => {
      db.query(
        sqls.request.updateAction,
        [
          act.id,
          act.type,
          act.libelle,
          act.origine,
          act.origineId,
          act.commentaire,
          act.status,
          act.periodeQuotidienne === null ? "00" : act.periodeQuotidienne,
          act.dureePrevue === "" ? null : act.dureePrevue,
          act.heureDebutImperative,
          act.heureDebutPrevu === "" ? null : act.heureDebutPrevu,
          act.heureFinPrevue === "" ? null : act.heureFinPrevue,
          act.heureDebutSouhaitee === "" ? null : act.heureDebutSouhaitee,
          act.heureFinSouhaitee === "" ? null : act.heureFinSouhaitee,
          act.heureDebutReel === "" ? null : act.heureDebutReel,
          act.heureFinReelle === "" ? null : act.heureFinReelle,
          act.actionPrecedenteId === "" ? null : act.actionPrecedenteId,
          act.actionPrecedenteLien,
          act.beneficiaireId,
          act.intervenantId,
          act.lieuId,
          act.delaiPrecedent === "" ? null : act.delaiPrecedent,
          act.date,
          act.occupe,
          act.jourComplet,
          act.recurrence,
          act.terminee,
          null /* action_standard_id ? */,
        ],
        (err, res) => {
          if (err) {
            logfile.consoleError(err);
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    });
  }

  /**
   * @param {Action} act
   * @returns {Promise<Boolean>}
   */
  static modifierActionRecurrence(act) {
    return new Promise((resolve, reject) => {
      db.query(
        sqls.request.updateActionRecurrence,
        [act.id, act.recurrence],
        (err, res) => {
          if (err) {
            logfile.consoleError(err);
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    });
  }

  /**
   * @param {String} action_id
   * @returns {Promise<Boolean>}
   */
  static supprimerAction(action_id) {
    return new Promise((resolve, reject) => {
      db.query(sqls.request.deleteAction, [action_id], (err, res) => {
        if (err) {
          logfile.consoleError(err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  /**
   * @param {Action} action
   * @param {Recurrence} recurrence
   * @returns {Promise<Boolean>}
   */
  static ajouterOccurences(action, recurrence) {
    var startDate = new Date(action.date);
    var endDate = new Date();
    var nbOccurences = 0;

    return new Promise(async (resolve, reject) => {
      // convert all '_code' action fields to item_code instead of item_libelle
      action.type = await du.getItemCodeFromItemLibOrCode(
        "ActionType",
        action.type
      );
      action.libelle = await du.getItemCodeFromItemLibAction(
        action.type,
        action.libelle
      );
      action.origine = await du.getItemCodeFromItemLibOrCode(
        "ActionOrig",
        action.origine
      );
      action.status = await du.getItemCodeFromItemLibOrCode(
        "ActionStat",
        action.status
      );
      action.periodeQuotidienne =
        await du.getItemCodeFromItemLibOrCodeWithDefault(
          "HorairePl",
          action.periodeQuotidienne,
          "00"
        );
      action.actionPrecedenteLien =
        await du.getItemCodeFromItemLibOrCodeWithDefault(
          "TyLien",
          action.actionPrecedenteLien,
          "FD"
        );

      // take into account sansFin, dateFin & nbFin in order
      if (recurrence.sansFin) {
        var year = startDate.getFullYear();
        var month = startDate.getMonth();
        var day = startDate.getDate();
        endDate = new Date(year + globals.planning.numberOfYears, month, day);
        // endDate.setDate(startDate.getDate() + globals.planning.numberOfYears * 365);
      } else if (recurrence.dateFin != null && recurrence.dateFin.length > 0) {
        endDate = new Date(recurrence.dateFin);
      } else if (recurrence.nbFin > 0) {
        nbOccurences = recurrence.nbFin;
        endDate = null;
      } else {
        reject("Recurrence inconsistency between sansFin/dateFin/nbFin");
      }

      var actionOccurence = action;
      actionOccurence.origineId = action.id;
      actionOccurence.recurrence = true; // already done but just to make sure ;)
      if (nbOccurences > 0) {
        for (let idx = 1; idx < nbOccurences; idx++) {
          actionOccurence.date = Action.computeNextOccurenceDate(
            actionOccurence.date,
            recurrence
          );
          await Action.ajouterAction(actionOccurence).catch((err) => {
            logfile.consoleError(err);
            reject(err);
          });
        }
      } else {
        actionOccurence.date = Action.computeNextOccurenceDate(
          actionOccurence.date,
          recurrence
        );
        var occurenceDate = new Date(actionOccurence.date);
        while (occurenceDate.getTime() <= endDate.getTime()) {
          await Action.ajouterAction(actionOccurence).catch((err) => {
            logfile.consoleError(err);
            reject(err);
          });
          actionOccurence.date = Action.computeNextOccurenceDate(
            actionOccurence.date,
            recurrence
          );
          occurenceDate = new Date(actionOccurence.date);
        }
      }
      resolve(true);
    });
  }

  /**
   * @param {String} action_origine_id
   * @returns {Promise<Boolean>}
   */
  static supprimerOccurences(action_origine_id) {
    return new Promise((resolve, reject) => {
      db.query(
        sqls.request.deleteActionOccurences,
        [action_origine_id],
        (err, res) => {
          if (err) {
            logfile.consoleError(err);
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    });
  }

  /**
   * @param {String} date // format 'YYYY-MM-DD'
   * @param {Recurrence} recurrence
   * @returns {String} next date according to recurrence properties, format 'YYYY-MM-DD'
   */
  static computeNextOccurenceDate(date, recurrence) {
    var nextDate = new Date(date);

    // compute next occurence date
    if (recurrence.tousLes.trim() === "d") {
      // add tousLesN day(s)
      nextDate.setDate(nextDate.getDate() + recurrence.tousLesN);
    } else if (recurrence.tousLes.trim() === "w") {
      // add tousLesN week(s)
      nextDate.setDate(nextDate.getDate() + 7 * recurrence.tousLesN);
    } else if (recurrence.tousLes.trim() === "m") {
      // add tousLesN month(s)
      nextDate.setMonth(nextDate.getMonth() + recurrence.tousLesN);
    } else {
      // add tousLesN year(s)
      var year = nextDate.getFullYear();
      var month = nextDate.getMonth();
      var day = nextDate.getDate();
      nextDate = new Date(year + recurrence.tousLesN, month, day);
    }

    return dateUtils.dateToYearMonthDayString(nextDate);
  }

  /**
   * @param {String} patientId
   * @param {String} fromDate
   * @param {String} toDate
   * @returns {Promise<Array<Action>>}
   */
  static chargerAgendaPatient(patientId, fromDate, toDate) {
    return new Promise((resolve, reject) => {
      var addedIds = new Map();
      db.query(
        sqls.request.selectPatientBeneficiaireActions,
        [patientId, globals.defaultLang, fromDate, toDate],
        (err, res) => {
          if (err) {
            logfile.consoleError(err);
            reject(err);
          } else {
            var results = new Array();
            var act;
            res.rows.forEach((row) => {
              act = Action.fromDbRow(row);
              results.push(act);
              addedIds.set(act.id, null);
            });

            db.query(
              sqls.request.selectInviteAgendaActions,
              [patientId, globals.defaultLang, fromDate, toDate],
              (err, res2) => {
                if (err) {
                  logfile.consoleError(err);
                  reject(err);
                } else {
                  res2.rows.forEach((row) => {
                    act = Action.fromDbRow(row);
                    if (addedIds.has(act.id)) {
                      // logfile.consoleInfo('Removed duplicated result ' + act.id);
                    } else {
                      results.push(act);
                    }
                  });
                  resolve(results);
                }
              }
            );
          }
        }
      );
    });
  }

  /**
   * @param {String} fromDate
   * @param {String} toDate
   * @returns {Promise<Map<Array<Action>>>}
   */
  static chargerAllPatientsAgendas(fromDate, toDate) {
    return new Promise((resolve, reject) => {
      var result = new Map();
      db.query(
        sqls.request.selectAllPatientsAgendas,
        [globals.defaultLang, fromDate, toDate],
        (err, res) => {
          if (err) {
            logfile.consoleError(err);
            reject(err);
          } else {
            var act;
            var acteUserId;
            res.rows.forEach((row) => {
              act = Action.fromDbRow(row);
              if (act.personneInviteId) {
                acteUserId = act.personneInviteId;
              } else {
                acteUserId = act.beneficiaireId;
              }
              var myArray = new Array();
              if (result.has(acteUserId)) {
                myArray = result.get(acteUserId);
              }
              myArray.push(act);
              result.set(acteUserId, myArray);
            });
            resolve([...result]);
          }
        }
      );
    });
  }

  /**
   * @param {String} intervenantId
   * @param {String} fromDate
   * @param {String} toDate
   * @returns {Promise<Array<Action>>}
   */
  static chargerAgendaIntervenant(intervenantId, fromDate, toDate) {
    return new Promise((resolve, reject) => {
      var addedIds = new Map();
      db.query(
        sqls.request.selectAuthorAgendaActions,
        [intervenantId, globals.defaultLang, fromDate, toDate],
        (err, res) => {
          if (err) {
            logfile.consoleError(err);
            reject(err);
          } else {
            var results = new Array();
            var act;
            res.rows.forEach((row) => {
              act = Action.fromDbRow(row);
              results.push(act);
              addedIds.set(act.id, null);
            });

            db.query(
              sqls.request.selectInviteAgendaActions,
              [intervenantId, globals.defaultLang, fromDate, toDate],
              (err, res2) => {
                if (err) {
                  logfile.consoleError(err);
                  reject(err);
                } else {
                  res2.rows.forEach((row) => {
                    act = Action.fromDbRow(row);
                    if (addedIds.has(act.id)) {
                      // logfile.consoleInfo('Removed duplicated result ' + act.id);
                    } else {
                      results.push(act);
                    }
                  });
                  resolve(results);
                }
              }
            );
          }
        }
      );
    });
  }

  /**
   * @param {String} intervenantId
   * @param {String} fromDate
   * @param {String} toDate
   * @param {String} filterValue
   * @returns {Promise<Array<Action>>}
   */
  static chargerAgendaIntervenantBySecteur(
    intervenantId,
    fromDate,
    toDate,
    filterValue
  ) {
    return new Promise((resolve, reject) => {
      var addedIds = new Map();
      db.query(
        sqls.request.selectAuthorAgendaActionsBySecteur,
        [intervenantId, globals.defaultLang, fromDate, toDate, filterValue],
        (err, res) => {
          if (err) {
            logfile.consoleError(err);
            reject(err);
          } else {
            var results = new Array();
            var act;
            res.rows.forEach((row) => {
              act = Action.fromDbRow(row);
              results.push(act);
              addedIds.set(act.id, null);
            });

            db.query(
              sqls.request.selectInviteAgendaActionsBySecteur,
              [
                intervenantId,
                globals.defaultLang,
                fromDate,
                toDate,
                filterValue,
              ],
              (err, res2) => {
                if (err) {
                  logfile.consoleError(err);
                  reject(err);
                } else {
                  res2.rows.forEach((row) => {
                    act = Action.fromDbRow(row);
                    if (addedIds.has(act.id)) {
                      // logfile.consoleInfo('Removed duplicated result ' + act.id);
                    } else {
                      results.push(act);
                    }
                  });
                  resolve(results);
                }
              }
            );
          }
        }
      );
    });
  }

  /**
   * @param {String} intervenantId
   * @param {String} fromDate
   * @param {String} toDate
   * @returns {Promise<Array<Action>>}
   */
  static chargerPlanningIntervenant(intervenantId, fromDate, toDate) {
    return new Promise((resolve, reject) => {
      var addedIds = new Map();
      db.query(
        sqls.request.selectAuthorPlanningActions,
        [intervenantId, globals.defaultLang, fromDate, toDate],
        (err, res) => {
          if (err) {
            logfile.consoleError(err);
            reject(err);
          } else {
            var results = new Array();
            var act;
            res.rows.forEach((row) => {
              act = Action.fromDbRow(row);
              results.push(act);
              addedIds.set(act.id, null);
            });

            db.query(
              sqls.request.selectInvitePlanningActions,
              [intervenantId, globals.defaultLang, fromDate, toDate],
              (err, res2) => {
                if (err) {
                  logfile.consoleError(err);
                  reject(err);
                } else {
                  res2.rows.forEach((row) => {
                    act = Action.fromDbRow(row);
                    if (addedIds.has(act.id)) {
                      // ignore, result already added
                    } else {
                      results.push(act);
                    }
                  });
                  resolve(results);
                }
              }
            );
          }
        }
      );
    });
  }

  /**
   * @param {String} action_id
   * @returns {Promise<String>} action_origine_id, if any (may be null if action_origine_id is null)
   */
  static getActionOrigineId(action_id) {
    return new Promise((resolve, reject) => {
      db.query(sqls.request.selectRootAction, [action_id], (err, res) => {
        if (err) {
          logfile.consoleError(err);
          reject(err);
        } else {
          var action_origine_id = res.rows[0].action_origine_id;
          resolve(action_origine_id);
        }
      });
    });
  }
};

module.exports.Action = Action;
