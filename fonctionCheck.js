// const globals = require("./../globals.js");
// const msg = require("./../messages.js");
// const {models} = require("./../models");
// const {Fonction} = require("../models/fonction.js");
// const {Intervenant} = require("../models/intervenant.js");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 * @param {Fonction} fonction
 */
var _checkFonctionByIntervenantId = async(req, res, next, fonction) => {
    var bError = false;
    var user /*Intervenant*/ = await Intervenant.findIntervenant(req.username)
        .catch((err) => {
            bError = true;
        });

    var hasRight = user && await user.hasFonction(fonction);
    if (!bError && hasRight) {
        next();
    } else {
        // fonction not found, user does not have this Fonction
        res.status(globals.http.accessDenied)
            .send({ message: msg.error.accessDenied });
    }
};

var fonctionCheck = {
    peutLireMotDirection:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(req, res, next, Fonction.lireMotDirection);
    },

    peutModifierMotDirection:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.modifierMotDirection
        );
    },

    peutListerPatients:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(req, res, next, Fonction.listerPatients);
    },

    // peutVoirDetailEtablissement:
    //   /**
    //    * @param {import('express').Request} req
    //    * @param {import('express').Response} res
    //    * @param {Function} next
    //    */
    //   async (req, res, next) => {
    //     await _checkFonctionByIntervenantId(
    //       req,
    //       res,
    //       next,
    //       Fonction.voirDetailEtablissement
    //     );
    //   },

    peutModifierDetailEtablissement:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.modifierDetailEtablissement
        );
    },

    peutModifierImagePatient:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.modifierImagePatient
        );
    },

    peutPrendreEnCharge:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(req, res, next, Fonction.prendreEnCharge);
    },

    // peutVoirHistoirePatient:
    // /**
    //  * @param {import('express').Request} req
    //  * @param {import('express').Response} res
    //  * @param {Function} next
    //  */
    //     async(req, res, next) => {
    //     await _checkFonctionByIntervenantId(
    //         req,
    //         res,
    //         next,
    //         Fonction.voirHistoirePatient
    //     );
    // },

    peutModifierHistoirePatient:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.modifierHistoirePatient
        );
    },

    peutAccederEspaceAdmin:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.espaceAdmin
        );
    },

    peutModifierIntervenant:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.ajouterIntervenant
        );
    },

    // peutGererSessions:
    // /**
    //  * @param {import('express').Request} req
    //  * @param {import('express').Response} res
    //  * @param {Function} next
    //  */
    // async (req, res, next) => {
    //   await _checkFonctionByIntervenantId(
    //     req,
    //     res,
    //     next,
    //     Fonction.gererSessions
    //   );
    // },

    // peutGererTerminaux:
    // /**
    //  * @param {import('express').Request} req
    //  * @param {import('express').Response} res
    //  * @param {Function} next
    //  */
    // async (req, res, next) => {
    //   await _checkFonctionByIntervenantId(
    //     req,
    //     res,
    //     next,
    //     Fonction.gererTerminaux
    //   );
    // },

    peutGererUtilisateur:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.gestionUtilisateurs
        );
    },

    // peutVoirPlansEtLieux:
    // /**
    //  * @param {import('express').Request} req
    //  * @param {import('express').Response} res
    //  * @param {Function} next
    //  */
    // async (req, res, next) => {
    //   await _checkFonctionByIntervenantId(
    //     req,
    //     res,
    //     next,
    //     Fonction.voirPlansLieux
    //   );
    // },

    peutModifierPlansEtLieux:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.modifierPlansLieux
        );
    },

    peutModifierDossierAdministratif:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.modifierDossierAdministratif
        );
    },

    peutModifierTransmissions:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.modifierTransmissions
        );
    },

    // peutLireTransmissions:
    // /**
    //  * @param {import('express').Request} req
    //  * @param {import('express').Response} res
    //  * @param {Function} next
    //  */
    // async (req, res, next) => {
    //   await _checkFonctionByIntervenantId(
    //     req,
    //     res,
    //     next,
    //     Fonction.lireTransmissions
    //   );
    // },

    // peutUtiliserMessagerie:
    // /**
    //  * @param {import('express').Request} req
    //  * @param {import('express').Response} res
    //  * @param {Function} next
    //  */
    //     async(req, res, next) => {
    //     await _checkFonctionByIntervenantId(
    //         req,
    //         res,
    //         next,
    //         Fonction.utiliserMessagerie
    //     );
    // },

    peutModifierAjouterSpecificite:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.peutModifierAjouterSpecificite
        );
    },

    // peutSupprimerSpecificite:
    // /**
    //  * @param {import('express').Request} req
    //  * @param {import('express').Response} res
    //  * @param {Function} next
    //  */
    //     async(req, res, next) => {
    //     await _checkFonctionByIntervenantId(
    //         req,
    //         res,
    //         next,
    //         Fonction.peutSupprimerSpecificite
    //     );
    // },

    peutLireSurveillance:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.peutLireSurveillance
        );
    },

    // peutModifierAjouterSurveillance:
    // /**
    //  * @param {import('express').Request} req
    //  * @param {import('express').Response} res
    //  * @param {Function} next
    //  */
    //     async(req, res, next) => {
    //     await _checkFonctionByIntervenantId(
    //         req,
    //         res,
    //         next,
    //         Fonction.peutModifierAjouterSurveillance
    //     );
    // },

    peutModifierAjouterOrdonnance:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.peutModifierAjouterOrdonnance
        );
    },

    peutSupprimerOrdonnance:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.peutSupprimerOrdonnance
        );
    },

    peutLireOrdonnance:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.peutLireOrdonnance
        );
    },

    ajouterModifierActualite:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.ajouterModifierActualite
        );
    },

    supprimerActualite:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.supprimerActualite
        );
    },

    ajouterModifierStock:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.ajouterModifierStock
        );
    },

    lireStock:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.ajouterModifierStock
        );
    },

    ajouterModifierPrestataire:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.ajouterModifierPrestataire
        );
    },

    lirePrestataire:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.ajouterModifierPrestataire
        );
    },

    ajouterModifierIntervention:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.ajouterModifierIntervention
        );
    },

    lireIntervention:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.ajouterModifierIntervention
        );
    },

    ajouterModifierChambre:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.ajouterModifierChambre
        );
    },

    lireChambre:
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     */
        async(req, res, next) => {
        await _checkFonctionByIntervenantId(
            req,
            res,
            next,
            Fonction.ajouterModifierChambre
        );
    },

};
module.exports.fonctionCheck = fonctionCheck;