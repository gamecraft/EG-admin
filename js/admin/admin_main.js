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

EDE.Admin.UI.updateSkillBox = function(groupedSkills /*object*/) {
    $.each(groupedSkills, function(key, value){
        $("#skillPlace").append('<div id="{0}">{1}</p>'.format(key, key));
        for(var i = 0, len = value.length; i < len; ++i) {
            $("#{0}".format(key)).append("<p class='subSkills'>{0} - Level {1} <input type='button' value='+' /></p>".format(value[i].name, value[i].level));
        }
    });
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
    
    
    // autocomplete the names and load the ListBoxes
    admin.API.get(Server.API.TeamMember, "Members fetched", function(data) {
        var membersDataProvider = [];
        var nameToId = {};
        var IdToObject = {};
        
        for(var i = 0, len = data.data.length; i < len; ++i) {
            membersDataProvider.push(data.data[i].name);
            nameToId[data.data[i].name] = data.data[i]._id;
            IdToObject[data.data[i]._id] = data.data[i];
        }
        $(".teamMembers").autocomplete({
            source : membersDataProvider
        });
        admin.TeamMember.cacheMembers(nameToId);
        admin.TeamMember.cacheObjects(IdToObject);
        
        admin.UI.createListBox("userList", "userListHidden", nameToId, function(value){
            console.log(value);
        // fetch the skills for the given user
            
        });
    });
    
    admin.API.get(Server.API.Skill, "Skills fetched", function(data) {
        console.log(data);
        var groupedSkills = EDE.Admin.Skill.groupBy(data.data, "parentName");
        EDE.Admin.UI.updateSkillBox(groupedSkills);
       
        var skillNameToId = {};
        for(var i = 0, len = data.data.length; i < len; ++i) {
            skillNameToId[data.data[i].name] = data.data[i]._id;
        }
        EDE.Admin.UI.createListBox("skillList", "skillListHidden", skillNameToId); 
    });
    
    // click handlers goes down
    
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
        var teamMembers = [],
        teamName = $("#teamName").val();
       
        $(".teamMembers").each(function(index, item){
            teamMembers.push(EDE.Admin.TeamMember.getIdByName($(item).val())); 
        });

        var dataObject = {
            name : teamName,
            members : teamMembers
        };
        
        admin.API.create(dataObject, Server.API.Team, "Created team {0}".format(teamName));
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
});