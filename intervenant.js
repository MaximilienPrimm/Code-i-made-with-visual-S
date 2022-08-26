// const {db} = require("../db");
// const {sqls} = require("../db/requests");
// const {logfile} = require("../logs/log-utils");
// const msg = require("../messages.js");
// const du = require("../utils/db-utils.js");
// var Fonction = require("./fonction.js");
// var Personne = require("./personne.js");
// var moment = require("moment");

var Intervenant = class Intervenant {
  constructor(id, metier_code, metier_lib, pseudo, pass, langue, langue_lib, statut, statut_lib, photo_uri, pw_change, type_id, type_lib, date_cre, date_maj, date_sup, fonctions){
    this.id = id;
    this.metier_code = metier_code;
    this.metier_lib = metier_lib;
    this.pseudo = pseudo;
    this.pass = pass;
    this.langue = langue;
    this.langue_lib = langue_lib;
    this.statut = statut;
    this.statut_lib = statut_lib;
    this.photo_uri = photo_uri;
    this.pw_change = pw_change;
    this.type_id = type_id;
    this.type_lib = type_lib;
    this.date_cre = date_cre;
    this.date_maj = date_maj;
    this.date_sup = date_sup;
    this.fonctions = fonctions;
  }
  //type_lib;

  /**
   *
   * @param {Fonction} fonction
   * @returns {Promise<Boolean>}
   */
  async hasFonction(fonction) {
    return this._hasFonction(this.id, fonction.id);
  }

  /**
   * @param {String} userId
   * @param {Number} fonctionId
   * @returns {Promise<Boolean>}
   */
  _hasFonction(userId, fonctionId) {
    return new Promise((resolve, reject) => {
      db.query(sqls.request.intervenantHasFonction,
        [userId, fonctionId],
        (err, res) => {
        if(err) {
          logfile.consoleError('DB intervenantHasFonction query error');
          resolve(false);
        } else {
          var atLeastOneRow = res.rowCount > 0;
          resolve(atLeastOneRow);
        }
      });
    });
  }

  /**
   * Returns:
   *      - Either null if user is not found
   *      - Or an Intervenant instance otherwise
   * @param {String} pseudo
   * @returns {Promise<Intervenant>}
   */
  static findIntervenant(pseudo) {
    return new Promise((resolve, reject) => {
      const query = {
        text: sqls.request.intervenantLogin,
        values: [pseudo],
        rowMode: "array",
      };
      db.query(query, (err, res) => {
        if (err) {
          logfile.consoleError("DB intervenantLogin query error");
          logfile.consoleError(err);
          reject(err);
        } else {
          if (res.rowCount > 0) {
            // 2 columns : pseudo, hashed pass
            var usrId = res.rows[0][0];
            var usrPseudo = res.rows[0][1];
            var pw = res.rows[0][2];
            var changePw = res.rows[0][3];
            var photoURI = res.rows[0][4];
            var intervenant = new Intervenant();
            intervenant.id = usrId;
            intervenant.pseudo = usrPseudo;
            intervenant.pass = pw;
            intervenant.pw_change = changePw;
            intervenant.photo_uri = photoURI;
            resolve(intervenant);
          } else {
            reject(new Error("DB intervenantLogin query error: 0"));
          }
        }
      });
    });
  }

  /**
   * @param {String} id id intervenant
   * @param {String} photoUri URI de la photo
   * @returns {Promise<Boolean>}
   */
  static modifierPhotoUri(id, photoUri) {
    return new Promise((resolve, reject) => {
      db.query(
        sqls.request.modifierIntervenantPhoto,
        [id, photoUri],
        (err, res) => {
          if (err) {
            logfile.consoleError("DB modifierIntervenantPhoto query error");
            logfile.consoleError(err);
            reject(err);
          } else {
            // photo_uri updated
            resolve(true);
          }
        }
      );
    });
  }

  /**
   * @param {Intervenant} user
   * @returns {Promise<Boolean>}
   */
  static ajouterIntervenant(user) {
    return new Promise((resolve, reject) => {
      var newId = du.genId();
      db.query(
        sqls.request.ajouterIntervenant,
        [
          newId,
          user.metier_code,
          user.pseudo,
          user.pass,
          user.langue,
          user.statut,
          user.photo_uri,
          user.pw_change,
          user.type_id,
        ],
        (err, res) => {
          if (err) {
            logfile.consoleError("DB INSERT intervenant query error");
            logfile.consoleError(err);
            reject(err);
          } else {
            var pers = new Personne();
            pers.nom_naissance = '';
            pers.prenoms = '';
            pers.nom_usage = '';
            pers.prenom_usage = '';
            pers.alias = '';
            pers.pseudo = user.pseudo;
            pers.langue = 'FRA';
            pers.nni = '';
            pers.nni_clef = '';
            pers.type_code = 'PPI';
            pers.civilite_code = 'NP';
            pers.date_naissance = null;
            pers.nationalite_code = 'FRA';
            pers.num_passeport = '';
            pers.num_sejour = '';
            pers.num_caf = '';
            pers.num_caf_cle = '';
            pers.famille_code = 'celibataire';
            pers.aidant_oui_non = false;
            pers.nbre_enfant = 0;
            pers.confiance_oui_non = true;
            pers.animal_oui_non = false;
            pers.prot_jur_oui_non = false;
            pers.prot_jur_code = null;
            pers.mandat_pf_actif_oui_non = false;
            pers.commune_naissance_code = '';
            pers.droit_image_code = '';
            pers.nom_ins = '';
            pers.prenoms_ins = '';
            pers.prenom_1_ins = '';
            pers.nia_ins = '';
            pers.ins_c = '';
            Personne.ajouterPersonne(pers, newId)
            .then((pCreated) => {
              resolve(true);
            })
            .catch((err) => {
                logfile.consoleError(err);
                reject(err);
            });
          }
        }
      );
    });
  }

  /**
   * @returns {Promise<List<Intervenant>>}
   */
  static listerIntervenants() {
    return new Promise((resolve, reject) => {
      db.query(sqls.request.listIntervenants, [], (err, res) => {
        if (err) {
          logfile.consoleError("DB listIntervenant query error");
          logfile.consoleError(err);
          reject(err);
        } else {
          if (res.rowCount > 0) {
            const intervenants = new Array();
            res.rows.forEach((intervenant) => {
              // -------------- actes, array  TODO MODIFY
              var intrv = new Intervenant();
              intrv.id = intervenant.intervenant_id;
              intrv.metier_code = intervenant.intervenant_metier_code;
              intrv.metier_lib = intervenant.intervenant_metier_lib;
              intrv.pseudo = intervenant.intervenant_pseudo;
              intrv.pass = "*";
              intrv.langue = intervenant.intervenant_langue;
              intrv.langue_lib = intervenant.intervenant_langue_lib;
              intrv.statut = intervenant.intervenant_statut;
              intrv.statut_lib = intervenant.intervenant_statut_lib;
              intrv.photo_uri = intervenant.intervenant_photo_uri;
              intrv.pw_change = intervenant.intervenant_pw_change;
              intrv.type_id = intervenant.intervenant_type_id;
              intrv.type_lib = intervenant.intervenant_type_lib;
              intrv.date_cre = intervenant.date_cre;
              intrv.date_maj = intervenant.date_maj;
              intrv.date_sup = intervenant.date_sup;

              intervenants.push(intrv);
            });
            resolve(intervenants);
          } else {
            reject(new Error(msg.error.listeIntervenants));
          }
        }
      });
    });
  }

  /**
   *
   * @param {*} json
   * @returns {Intervenant}
   */
  static fromJson(json) {
    var intervenant = new Intervenant();
    intervenant.id = json.id;
    intervenant.langue = json.langue;
    intervenant.metier_code = json.metier_code;
    intervenant.metier_lib = json.metier_lib;
    intervenant.pass = json.pw ? json.pw : "";
    intervenant.photo_uri = json.photo_uri;
    intervenant.pseudo = json.pseudo;
    intervenant.pw_change = json.pw_change;
    intervenant.statut = json.statut;
    intervenant.statut_lib = json.statut_lib;
    intervenant.type_id = json.type_id;
    intervenant.type_lib = json.type_lib;
    intervenant.date_sup = json.date_sup;
    return intervenant;
  }

  /**
   * @param {Intervenant} user
   * @returns {Promise<Boolean>}
   */
  static modifierIntervenant(user) {
    return new Promise((resolve, reject) => {
      db.query(
        sqls.request.modifierIntervenant,
        [
          user.id,
          user.metier_code,
          user.pseudo,
          user.pass,
          user.langue,
          user.statut,
          user.photo_uri,
          user.pw_change,
          user.type_id
        ],
        (err, res) => {
          if (err) {
            logfile.consoleError("DB UPDATE intervenant query error");
            logfile.consoleError(err);
            reject(err);
          } else {
            // intervenant inserted
            resolve(true);
          }
        }
      );
    });
  }

  /**
   * @param {Intervenant} user
   * @returns {Promise<Boolean>}
   */
  static modifierIntervenantSaufPass(user) {
    if (user.date_sup === "banned") {
      //user.date_sup = moment().format('YYYY-MM-DD HH:mm:ss');
      user.date_sup = moment().format();
    } else {
      user.date_sup = null;
    }
    return new Promise((resolve, reject) => {
      db.query(
        sqls.request.modifierIntervenantSaufPass,
        [
          user.id,
          user.metier_code,
          user.pseudo,
          user.langue,
          user.statut,
          user.photo_uri,
          user.pw_change,
          user.type_id,
          user.date_sup,
        ],
        (err, res) => {
          if (err) {
            logfile.consoleError("DB UPDATE intervenant query error");
            logfile.consoleError(err);
            reject(err);
          } else {
            // intervenant inserted
            resolve(true);
          }
        }
      );
    });
  }

  /*
   * @param {String} id id intervenant
   * @param {String} newPassword newPassword intervenant
   * @returns {Promise<Boolean>}
   */
  static modifierIntervenantPW(id, newPassword) {
    return new Promise((resolve, reject) => {
      db.query(
        sqls.request.modifierIntervenantPassword,
        [id, newPassword],
        (err, res) => {
          if (err) {
            logfile.consoleError("DB modifierIntervenantPassword query error");
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
   * @param {Array<Intervenant>} intervenants
   * @returns {Array<Intervenant>}
   */
  static toPublicList(intervenants) {
    var intPublic = [];
    intervenants.forEach((intrv) => {
      var intervenantLight = new Intervenant();
      intervenantLight.id = intrv.id;
      intervenantLight.pseudo = intrv.pseudo;
      intervenantLight.photo_uri = intrv.photo_uri;
      intervenantLight.type_lib = intrv.type_lib;
      
      intPublic.push(intervenantLight);
    });
    return intPublic;
  }
};
module.exports.Intervenant = Intervenant;