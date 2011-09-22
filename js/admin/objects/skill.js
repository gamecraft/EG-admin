// requires admin_main.js to be loaded first
// requires jQuery

EDE.Admin.Skill = {
    groupBy : function(data /*array*/, fieldName /*string*/) {
        if(data.constructor.toString().indexOf("Array") == -1 || typeof(fieldName) !== "string") {
            return false;
        }
        
        var groupedMap = {};
        for(var i = 0, len = data.length; i < len; ++i) {
            if(typeof(groupedMap[data[i][fieldName]]) === "undefined") {
                groupedMap[data[i][fieldName]] = [data[i]]
            } else {
                groupedMap[data[i][fieldName]].push(data[i]);
            }
        }    
        return groupedMap;
    }
};
