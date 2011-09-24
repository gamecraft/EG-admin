// requires admin_main.js to be loaded first
// requires jQuery

EDE.Admin.Team = {
    IdToObject : {},
    getObjectById : function(id) {
        return this.IdToObject[id];
    },
    getPointsFromServer : function(id, callback) {
        EDE.Admin.API.getById(Server.API.Team, id, "Points fetched", function(data) {
            res = data.data.totalPoints;
            callback(res);
        });
    }
};



