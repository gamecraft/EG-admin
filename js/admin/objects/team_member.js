// requires admin_main.js to be loaded first
// requires jQuery

EDE.Admin.TeamMember = {
    IdToObject : {},
    NameToId : {},
    cacheMembers : function(data) {
        this.NameToId = data;
    },
    cacheObjects : function(data) {
        this.IdToObject = data;  
    },
    getIdByName : function(name /*string*/) {
        if(typeof(this.NameToId[name]) === "undefined") {
            return false;
        }
        
        return this.NameToId[name];
    },
    getObjectById : function(id) {
        return this.IdToObject[id];
    }
};