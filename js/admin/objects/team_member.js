// requires admin_main.js to be loaded first
// requires jQuery

EDE.Admin.TeamMember = {
    NameToId : {},
    cacheMembers : function(data) {
        this.NameToId = data;
    },
    getIdByName : function(name /*string*/) {
        if(typeof(this.NameToId[name]) === "undefined") {
            return false;
        }
        
        return this.NameToId[name];
    }
};