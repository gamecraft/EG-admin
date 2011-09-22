// namespace
EDE = {};
EDE.Admin = {};
EDE.Admin.UI = {};

EDE.Admin.clearDivWithInputs = function(divId /*string*/) {
    if(typeof(divId) !== "string") {
        return false;
    }
    $("#{0} :input[type=text], textarea".format(divId)).each(function(index, item){
        $(item).val("");
    });
    return true;
};

EDE.Admin.configToasts = function(config /*object*/) {
    if(typeof(config) !== "object") {
        return false;
    }
    $().toastmessage(config);
    return true;
};

EDE.Admin.UI.ListBoxItem = JSListBox.Item.extend({
    text: "",
    init: function(text) {
        this.text = text;
    },
    render: function() {
        return '<a href="#">' + this.text + '</a>';
    } 
});

EDE.Admin.UI.init = function() {
    $( "#tabs" ).tabs();
};

EDE.Admin.UI.optionComponent = function(componentId /*string*/, data /*array*/) {
    $(data).each(function(index, item){
        console.log(item);
        $("#{0}".format(componentId)).append('<option value="{0}">{1}</option'.format(item, item));
    });
};

$(document).ready(function(){
    var admin = EDE.Admin;
    admin.UI.init();
    
    var skillsArray = ["Помодоро", "Lean", "Мисловни Карти", "Scrum", "Фото-Четене", "Предприемачество", "Презентация", "BrainStorming", "6 Мислещи Шапки"    ];
    
    admin.UI.optionComponent("masterSkillForSkill", skillsArray);
    admin.UI.optionComponent("masterSkillForAchievment", skillsArray);
    // general config for the toasts
    admin.configToasts({
        position : "top-right",
        sticky : false
    });
    
    // autocomplete the names
    admin.API.get(Server.API.TeamMember, "Members fetched", function(data) {
        var membersDataProvider = [];
        var nameToId = {};
        
        for(var i = 0, len = data.data.length; i < len; ++i) {
            membersDataProvider.push(data.data[i].name);
            nameToId[data.data[i].name] = data.data[i]._id;
        }
        $(".teamMembers").autocomplete({
            source : membersDataProvider
        });
        EDE.Admin.TeamMember.cacheMembers(nameToId);
        
        for(i = 0, len = membersDataProvider.length; i < len; ++i) {
            membersDataProvider[i] = new EDE.Admin.UI.ListBoxItem(membersDataProvider[i]);
        }
        
        var listBox = new JSListBox({
            containerSelector : "membersListBox"
        });
        
        listBox.addItems(membersDataProvider);
        
    });
    
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
        
        console.log(teamMembers);
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
    
// init the jQuery UI Listbox
    
});