// requires admin_main.js to be loaded first
// requires jQuery

EDE.Admin.API = {
    create : function(dataObject /*object*/, apiObjectName /*string*/, successToastMessage /*string*/) {
        if(typeof(dataObject) !== "object" || typeof(apiObjectName) !== "string" || typeof(successToastMessage) !== "string") {
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
                $().toastmessage('showSuccessToast', successToastMessage);
                console.log(data)
            },
            error: function(jqXHR, textStatus, errorThrown){
                $().toastmessage('showErrorToast', "An Error Occured. Check the console for details.");
                console.log(textStatus + ' ' + errorThrown);
            }
        });
        
        return true;
    },
    get : function(apiObjectName/*string*/, successToastMessage/*string*/, callback/*function*/) {
        if(typeof(callback) !== "function" || typeof(apiObjectName) !== "string" || typeof(successToastMessage) !== "string") {
            return false;
        }
        
        $.ajax({
            type : "GET",
            url : Server.URL + apiObjectName,
            dataType : "json",
            success : function(data) {
                $().toastmessage('showSuccessToast', successToastMessage);
                callback(data);
            },
            error: function(jqXHR, textStatus, errorThrown){
                $().toastmessage('showErrorToast', "An Error Occured. Check the console for details.");
                console.log(textStatus + ' ' + errorThrown);
            }
        });
        return true;
    },
    getById : function(apiObjectName, apiObjectId, successToastMessage, callback) {
        
    },
    update : function(apiObjectName, apiObjectId, dataObject, successToastMessage) {
        if(typeof(dataObject) !== "object" || typeof(apiObjectId) !== "string" || typeof(apiObjectId) !== "string" || typeof(successToastMessage) !== "string") {
            return false;
        }
        dataObject = JSON.stringify(dataObject);
        $.ajax({
            type : "UPDATE",
            url : Server.URL + apiObjectName + "/" + apiObjectId,
            dataType : "json",
            contentType:"application/json; charset=utf-8",
            data : dataObject,
            success : function(data) {
                $().toastmessage('showSuccessToast', successToastMessage);
            },
            error: function(jqXHR, textStatus, errorThrown){
                $().toastmessage('showErrorToast', "An Error Occured. Check the console for details.");
                console.log(textStatus + ' ' + errorThrown);
            }
        });
        return true;
    }
};


