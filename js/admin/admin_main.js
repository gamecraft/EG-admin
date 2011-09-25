// namespaces

/**
 * The main namespace. Every object goes there. EDE = Europen Entrepreneurship Day
 **/
EDE = {};

/**
 * Objects and constants that are related to the admin panel
 **/
EDE.Admin = {};

/**
 * Objects and functions that are related to the User Interface
 **/
EDE.Admin.UI = {};

/**
 * All UI initializations happen here
 **/
EDE.Admin.UI.init = function() {
    $( "#tabs" ).tabs();
};

/**
 * A simple clear function
 * Takes a div ID and sets the values of all text inputs to ""
 **/
EDE.Admin.UI.clearDivWithInputs = function(divId /*string*/) {
    if(typeof(divId) !== "string") {
        return false;
    }
    $("#{0} :input[type=text], textarea".format(divId)).each(function(index, item){
        $(item).val("");
    });
    return true;
};

/**
 * Global configuration for the jQuery Toast plugin
 **/
EDE.Admin.UI.configToasts = function(config /*object*/) {
    if(typeof(config) !== "object") {
        return false;
    }
    $().toastmessage(config);
    return true;
};

/**
 * This is the custom ListBoxItem class that is used in the app
 * It takes a hidden input id to update the selected item's value
 **/
EDE.Admin.UI.ListBoxItem = JSListBox.Item.extend({
    text: "",
    init: function(config, clickCallback /*optional, function*/) {
        this.text = config.text;
        this.value = config.value;
        this.selectedItemId = config.hiddenId;
        
        if(typeof(clickCallback) !== "undefined") {
            this.clickCallback = clickCallback;
        }
    },
    render: function() {
        return '<a href="#">' + this.text + '</a>';
    },
    onClick : function() {
        $("#{0}".format(this.selectedItemId)).val(this.value); 
        
        if(typeof(this.clickCallback) !== "undefined") {
            this.clickCallback(this.value);
        }
    }
});

EDE.Admin.UI.createListBox = function(containerSelector/*string*/, valueContainer /*string*/, data/*object*/, callback /*function*/) {
    var listBox = new JSListBox({
        "containerSelector" : containerSelector
    });
    var dataProvider = [];
    $.each(data, function(key, val){
        dataProvider.push(new EDE.Admin.UI.ListBoxItem({
            text : key ,
            value : val,
            hiddenId : valueContainer
        }, callback))
    });
    
    listBox.addItems(dataProvider);
};

/**
 * Creates an <select> component inside componentId and populates it with <option>s from the data array
 **/
EDE.Admin.UI.optionComponent = function(componentId /*string*/, data /*array*/) {
    $(data).each(function(index, item){
        $("#{0}".format(componentId)).append('<option value="{0}">{1}</option'.format(item, item));
    });
};

EDE.Admin.UI.createSkillBox = function(groupedSkills /*object*/) {
    $.each(groupedSkills, function(key, value){
        $("#skillPlace").append('<div id="{0}">{1}</p>'.format(key.removeWhiteSpace(), key));
        for(var i = 0, len = value.length; i < len; ++i) {
            
            var id = value[i].name.removeWhiteSpace();
            id = id.replace("!", "");
            
            var htmlContent = "<p id='{0}' class='subSkills'>{1} - Level {2} <input type='button' class='assign' value='+' /><input type='hidden' value='{3}' /></p>";
            htmlContent = htmlContent.format(id /*id*/, value[i].name/*name*/, value[i].level /*level*/, value[i]._id /*hidden value*/);
            $("#{0}".format(key.removeWhiteSpace())).append(htmlContent);
        }
    });
    $(".assign").click(function(event) {
        var memberId = $("#userListHidden").val(),
        skillId = $(event.target).next().val();
        
        // visualy show that is assigned
        $(event.target).parent().removeClass("notassigned");
        $(event.target).parent().removeClass("assigned");
        $(event.target).parent().addClass("assigned");
        $(event.target).css("visibility", "hidden");
        var dataObject = {
            "skillId" : skillId  
        };
        EDE.Admin.API.helperMethod(Server.API.TeamMember, memberId, Server.API.Helper.ADD_SKILL, dataObject, "Skill added");
    });
};

EDE.Admin.UI.updateSkillBox = function(userSkills /*groupedSkills format!!*/) {
    console.log(userSkills);
    var groupedSkills = EDE.Admin.Skill.groupedSkills;

    for(var key in groupedSkills) {
        if(groupedSkills.hasOwnProperty(key)) {
            var value = groupedSkills[key];
            for(var i = 0, len = value.length; i < len; ++i) {
                // make the id compatible for HTML element id
                var containerSelector = "#{0}".format(value[i].name.removeWhiteSpace());
                containerSelector = containerSelector.replace("!", "");
                // clear all classes
                $(containerSelector).removeClass("notassigned");
                $(containerSelector).removeClass("assigned");
                $(containerSelector).children("input[type=button]").css("visibility", "visible");
                
                if(typeof(userSkills[key]) === "undefined") {
                    // the user does not have skills from this parent
                    $(containerSelector).addClass("notassigned");
                    continue;
                }
                var userSkillsArray = userSkills[key];
            
                if(EDE.Admin.Skill.contains(value[i].name, userSkillsArray)) {
                    $(containerSelector).addClass("assigned");
                    console.log( $(containerSelector).children("input[type=hidden]"));
                    $(containerSelector).children("input[type=button]").css("visibility", "hidden");
                } else {
                    $(containerSelector).addClass("notassigned");
                }
            }
        }
    }
};

// main jQuery DOM ready function
$(document).ready(function(){
    var admin = EDE.Admin;
    admin.UI.init();
    
    // general config for the toasts
    admin.UI.configToasts({
        position : "top-right",
        sticky : false
    });
    
    var skillsArray = ["Помодоро", "Lean", "Мисловни Карти", 
    "Scrum", "Фото-Четене", "Предприемачество", 
    "Презентация", "BrainStorming", "6 Мислещи Шапки", "НЛП"];
    
    admin.UI.optionComponent("masterSkillForSkill", skillsArray);
    admin.UI.optionComponent("masterSkillForAchievment", skillsArray);
    
    /**
     *  FETCH THE TEAM MEMBERS
     *  After the TeamMembers are fetched the following things happen :
     *  Autocompletes are assigned where username input is needed
     *  ListBox is created for the teams tab
     **/
    admin.API.get(Server.API.TeamMember, "Members fetched", function(data) {
        var membersDataProvider = [];
        var nameToId = {};
        var IdToObject = {};
        
        for(var i = 0, len = data.data.length; i < len; ++i) {
            membersDataProvider.push(data.data[i].name);
            nameToId[data.data[i].name] = data.data[i]._id;
            IdToObject[data.data[i]._id] = data.data[i];
        }
        $(".teamMembers, .membersAutocomplete").autocomplete({
            source : membersDataProvider
        });
        admin.TeamMember.cacheMembers(nameToId);
        admin.TeamMember.cacheObjects(IdToObject);
        
        admin.UI.createListBox("userList", "userListHidden", nameToId, function(value){
            // fetch the skills for the given user
            var selectedUser = admin.TeamMember.getObjectById(value);
            if(typeof(selectedUser["skills"]) !== "undefined") {
                // group
                var groupedSkills = [];
                for(var i = 0, len = selectedUser.skills.length; i < len; ++i) {
                    console.log(i,groupedSkills);
                    groupedSkills.push(admin.Skill.getObjectById(selectedUser.skills[i]["skillId"]));
                }
                groupedSkills = admin.Skill.groupBy(groupedSkills, "parentName");
                admin.UI.updateSkillBox(groupedSkills);
            } else {
                admin.UI.updateSkillBox({});
            }
            
        });
    });
    
    /**
     *  FETCH THE SKILLS
     *  Skills are grouped by parent name and the SkillBox is populated with data
     *  ListBox is created with the name of the skills
     **/
    admin.API.get(Server.API.Skill, "Skills fetched", function(data) {
        var IdToObject = {};
        var groupedSkills = admin.Skill.groupBy(data.data, "parentName");
        admin.Skill.groupedSkills = groupedSkills;
        
        admin.UI.createSkillBox(groupedSkills);
        
        var skillNameToId = {};
        for(var i = 0, len = data.data.length; i < len; ++i) {
            skillNameToId[data.data[i].name] = data.data[i]._id;
            IdToObject[data.data[i]._id] = data.data[i];
        }
        admin.Skill.IdToObject = IdToObject;
        admin.UI.createListBox("skillList", "skillListHidden", skillNameToId, function(value){
            $("#skillTextDescription").html(admin.Skill.getObjectById(value).description);
        });
    });
    
    /**
     *  FETCH THE TEAMS
     *  ListBox is created with the name of the Teams in the TeamPoints tab
     *  
     **/
    admin.API.get(Server.API.Team, "Teams fetched", function(data){
        var IdToObject = {},
        teamNameToId = {};
        
        for(var i = 0, len = data.data.length; i < len; ++i) {
            teamNameToId[data.data[i].name] = data.data[i]._id;
            IdToObject[data.data[i]._id] = data.data[i];
            
            // add the html for the jury points
            $("#teamJuryPointsContainer").append("<strong>{0}:</strong>".format(data.data[i].name));
            
            $("#teamJuryPointsContainer").append("<div><input type='number' value='0' /><input type='hidden' value='{0}' /></div>".format(data.data[i]._id))
            
            $("#teamJuryPointsContainer").append("<br />");
        }
        
        admin.Team.IdToObject = IdToObject;
        admin.UI.createListBox("teamListBox", "teamListBoxHidden", teamNameToId, function(value){
            admin.Team.getPointsFromServer(value, function(res){
                $("#totalTeamPoints").html("Team points: {0}".format(res));
            });
        });
        
    });
    
    /**
     *  FETCH ACHIEVEMENTS
     *  ListBox is created with the name of the Teams in the TeamPoints tab
     *  
     **/
    admin.API.get(Server.API.Achievement, false, function(data) {
        var achNameToId = {};
        for(var i = 0, len = data.data.length; i < len; ++i) {
            achNameToId[data.data[i].name] = data.data[i]._id;
        }
        admin.UI.createListBox("achievementList", "achievementListHidden", achNameToId, function(value){
            console.log(value);
        });
    });
    
    /**
     *  CLICK HANDLERS
     **/
    $("#addSkillButton").click(function() {
        // gather the data
        var 
        skillName = $("#skillName").val(),
        parentName = $("#masterSkillForSkill").val(),
        description = $("#skillDescription").val(),
        level = $("#skillLevel").val();
            
        var dataObject = {
            "name" : skillName,
            "parentName" : parentName,
            "description" : description,
            "level" : level
        };
        admin.API.create(dataObject, Server.API.Skill, "Skill {0} added".format(dataObject.name));
    });
    
    $("#addMemberButton").click(function(){
        var memberName = $("#memberName").val();
        admin.API.create({
            name : memberName
        },Server.API.TeamMember, "Member {0} added".format(memberName));
    });
    
    $("#addTeamButton").click(function(){
        var teamName = $("#teamName").val();
       
        var dataObject = {
            name : teamName,
            totalPoints : 0
        };
        
        admin.API.create(dataObject, Server.API.Team, "Created team {0}".format(teamName), function(data) {
            var createdId = data.data._id;
            console.log(createdId);
            $(".teamMembers").each(function(index, item) {
                var memberId = EDE.Admin.TeamMember.getIdByName($(item).val());
                console.log($(item).val(), memberId);
                EDE.Admin.API.helperMethod(Server.API.Team, createdId, Server.API.Helper.ADD_MEMBER, {
                    "memberId" : memberId
                }, "Member added")
            });
        });
    });
    
    $("#addAchievmentButton").click(function(){
        var
        achievmentName = $("#achievmentName").val(),
        parentNameForAchievment = $("#masterSkillForAchievment").val(),
        achievmentDescription = $("#achievmentDescription").val(),
        teamPointsReward = parseInt($("#teamPointsReward").val());
       
        var dataObject =  {
            name : achievmentName,
            description : achievmentDescription,
            toMasterSkill: parentNameForAchievment, // the name of the MasterSkill to which they apply
            teamPointsReward : teamPointsReward // the number of team points that is rewarded for the given achievment
        };
        
        admin.API.create(dataObject, Server.API.Achievment, "Created achievment {0}".format(achievmentName));
    });
    
    $("#addTeamPointsButton").click(function(){
        var teamId = $("#teamListBoxHidden").val(),
        teamPointsToAdd = parseInt($("#teamPoints").val()); // is this jQuery or HTML5 fail ?
        
        var dataObject = {
            points : teamPointsToAdd
        };
        admin.API.helperMethod(Server.API.Team, teamId, Server.API.Helper.ADD_POINTS, dataObject, "Points added");
    });
    
    $("#payLotteryFeeButton").click(function(){
        var fee = Lottery.gameConstants.ENTRY_FEE / 100,
        toRemove = 0,
        teamId = $("#teamListBoxHidden").val();
        
        admin.Team.getPointsFromServer(teamId, function(res){
            res = parseInt(res);
            toRemove = fee * res;
            console.log(res, fee, toRemove);
            var dataObject = {
                points : -toRemove
            };
            admin.API.helperMethod(Server.API.Team, teamId, Server.API.Helper.ADD_POINTS, dataObject, "Fee of {0} points paid".format(toRemove));
        });
    });
    
    $("#assignAchievement").click(function(){
        var achievmentId = $("#achievementListHidden").val(),
        memberId = admin.TeamMember.getIdByName($("#achievementAssignMemberName").val());
        var dataObject = {
            "achievementId" : achievmentId  
        };
        
        admin.API.helperMethod(Server.API.TeamMember, memberId, Server.API.Helper.ADD_ACHV, dataObject, "Achievement Added!");
    });
    
    $("#endCurrentPhase").click(function(){
        var dataObject = [];
        $("#teamJuryPointsContainer div").each(function(index, item) {
            var teamId = $(item).children("input[type=hidden]").val(),
            juryPoints = $(item).children("input[type=number]").val();
            if(juryPoints.toString() === "NaN") {
                juryPoints = 0;
                console.log(juryPoints);
            }
            dataObject.push({
                "teamId" : teamId,
                "juryPoints" : juryPoints
            });
        });
        admin.Phase.getCurrent(function(data){
            admin.Phase.markAsFinished(data.data._id, dataObject)
        });
            
    });
    
    $("#nextPhase").click(function(){
        admin.Phase.nextPhase(); 
    });
    
    $("#hardResetButton").click(function(){
       admin.Phase.resetAll(); 
    });
});