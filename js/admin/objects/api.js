// requires admin_main.js to be loaded first
// requires jQuery

EDE.Admin.API = (function() {
    var _private = {
        successToast : function(message) {
            if(message == false) {
                return;
            }
            $().toastmessage('showSuccessToast', message);
        },
        failToast : function() {
            $().toastmessage('showErrorToast', "An Error Occured. Check the console for details.");
        }
    };
    return {
        create : function(dataObject /*object*/, apiObjectName /*string*/, successToastMessage /*string*/) {
            if(typeof(dataObject) !== "object" || typeof(apiObjectName) !== "string") {
                return false;
            }
        
            dataObject = JSON.stringify(dataObject);
            console.log(dataObject);
            // make the call
            $.ajax({
                type : "POST",
                url : Server.URL + apiObjectName,
                data : dataObject,
                dataType : "json",
                contentType:"application/json; charset=utf-8",
                success : function(data) {
                    _private.successToast(successToastMessage);
                    console.log(data)
                },
                error: function(jqXHR, textStatus, errorThrown){
                    _private.failToast();
                    console.log(textStatus + ' ' + errorThrown);
                }
            });
        
            return true;
        },
        get : function(apiObjectName/*string*/, successToastMessage/*string*/, callback/*function*/) {
            if(typeof(callback) !== "function" || typeof(apiObjectName) !== "string") {
                return false;
            }
        
            $.ajax({
                type : "GET",
                url : Server.URL + apiObjectName,
                dataType : "json",
                success : function(data) {
                    _private.successToast(successToastMessage);
                    callback(data);
                },
                error: function(jqXHR, textStatus, errorThrown){
                    _private.failToast();
                    console.log(textStatus + ' ' + errorThrown);
                }
            });
            return true;
        },
        getById : function(apiObjectName, apiObjectId, successToastMessage, callback) {
            if(typeof(callback) !== "function" || typeof(apiObjectName) !== "string" || typeof(apiObjectId) !== "string") {
                return false;
            }
        
            $.ajax({
                type : "GET",
                url : Server.URL + apiObjectName + "/" + apiObjectId,
                dataType : "json",
                success : function(data) {
                    _private.successToast(successToastMessage);
                    callback(data);
                },
                error: function(jqXHR, textStatus, errorThrown){
                    _private.failToast();
                    console.log(textStatus + ' ' + errorThrown);
                }
            });
            return true;
        },
        update : function(apiObjectName, apiObjectId, dataObject, successToastMessage) {
            if(typeof(dataObject) !== "object" || typeof(apiObjectId) !== "string" || typeof(apiObjectId) !== "string") {
                return false;
            }
            dataObject = JSON.stringify(dataObject);
            $.ajax({
                type : "PUT",
                url : Server.URL + apiObjectName + "/" + apiObjectId,
                dataType : "json",
                contentType:"application/json; charset=utf-8",
                data : dataObject,
                success : function(data) {
                    _private.successToast(successToastMessage);
                },
                error: function(jqXHR, textStatus, errorThrown){
                    _private.failToast();
                    console.log(textStatus + ' ' + errorThrown);
                }
            });
            return true;
        },
        helperMethod  : function(apiObjectName, apiObjectId, helperMethodName, dataObject ,successMessage) {
            this.update(apiObjectName, apiObjectId + helperMethodName, dataObject, successMessage);
        },
        addSkillToMember : function(memberId, skillId) {
            console.log(Server.API.TeamMember + "/" + memberId + '/skill');
            this.update(Server.API.TeamMember, memberId + '/skill', {
                "skillId" : skillId
            }, "Added skill to member");
        }
    }
})();
