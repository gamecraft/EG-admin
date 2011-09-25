EDE.Admin.Phase = {
    getCurrent : function(callback /*function*/) {
        EDE.Admin.API.get(Server.API.Phase + Server.API.Helper.CURRENT_PHASE, false, callback);
    },
    markAsFinished : function(phaseId, dataObject) {
        EDE.Admin.API.helperMethod(Server.API.Phase, phaseId, Server.API.Helper.MARK_PHASE_AS_FINISHED, dataObject, "Phase finished. To start a new phase -> use the button");
    }
};

