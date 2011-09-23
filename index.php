<?php
header("Content-Type: text/html; charset=utf-8");
?>
<html>
    <head>
        <title>Admin Page</title>
        <script src="http://code.jquery.com/jquery-latest.js"></script>
        <script src="js/admin/jquery-ui-1.8.16.custom.min.js"></script>
        <link href="js/admin/css/start/jquery-ui-1.8.16.custom.css" rel="stylesheet" />

        <!--   Toast jQuery plugin    
                http://akquinet.github.com/jquery-toastmessage-plugin/
        -->
        <script type="text/javascript" src="js/admin/jquery.toastmessage.js"></script>
        <link href="js/admin/resources/css/jquery.toastmessage.css" rel="stylesheet" />

        <!--  jQuery List Plugin
              https://github.com/mpalmerlee/jQuery-UI-Listbox/
        -->
        <link rel="stylesheet" href="js/admin/js-listbox-style.css" />
        <script type="text/javascript" src="js/admin/js-inherit.js"></script>
        <script type="text/javascript" src="js/admin/js-listbox.js"></script>

        <!--   Main JavaScript logic-->
        <script type="text/javascript" src="js/additional_prototypes.js"></script>
        <script type="text/javascript" src="js/server_constants.js"></script>
        <script type="text/javascript" src="js/api_constants.js"></script>
        <script type="text/javascript" src="js/json2.js"></script>
        <script type="text/javascript" src="js/admin/admin_main.js"></script>
        <script type="text/javascript" src="js/admin/objects/api.js"></script>
        <script type="text/javascript" src="js/admin/objects/skill.js"></script>
        <script type="text/javascript" src="js/admin/objects/team_member.js"></script>
        <style>
            .listBox {
                width: 250px;
                height: 150px;
            }

            .subSkills {
                margin-left: 10px;
            }

            .assigned {
                color : green;
            }

            .notassigned {
                color : red;
            }
        </style>
    </head>
    <body>
        <div id="tabs">
            <ul>
                <li><a href="#tabs-1">Skills</a></li>
                <li><a href="#tabs-2">Teams</a></li>
                <li><a href="#tabs-3">Achievments</a></li>
                <li><a href="#tabs-4">Lottery</a></li>
                <li><a href="#tabs-5">Team Points</a></li>
            </ul>
            <div id="tabs-1"> <!-- Skills tab  -->
                <div id="skillCreation">
                    <label for="skillName">Skill name:</label>
                    <br />
                    <input id="skillName" type="text" />
                    <br />
                    <label for="masterSkillForSkill">MasterSkill:</label>
                    <br />
                    <select id="masterSkillForSkill">
                    </select>
                    <br />
                    <label for="skillDescription">Description:</label>
                    <br />
                    <textarea id="skillDescription" rows="5" cols="30"></textarea>
                    <br />
                    <label for="skillLevel">Skill Level:</label>
                    <br />
                    <input id="skillLevel" type="text" />
                    <br />
                    <input id="addSkillButton" type="button" value="Add Skill" />
                    <hr />
                    <div id="skillList" class="listBox">
                        <!--ListBox-->

                    </div>
                    <input type="hidden" id="skillListHidden" />
                    <br />
                    <div id="skillTextDescription"></div>
                </div>
            </div>
            <div id="tabs-2"> <!-- Teams Tab -->
                <div id="teamCreation">
                    <!--      New member registration              -->
                    <label for="memberName">Member name:</label>
                    <br />
                    <input id="memberName" type="text" />
                    <br />
                    <input id="addMemberButton" type="button" value="Register member" />
                    <br />
                    <hr />

                    <!--New team registration-->
                    <label for="teamName">Team name:</label>
                    <br />
                    <input id="teamName" type="text" />
                    <br />

                    Имената на играчите:
                    <br />
                    <strong>#1</strong> : <input class="teamMembers" type="text" />
                    <br />
                    <strong>#2</strong> : <input class="teamMembers" type="text" />
                    <br />
                    <strong>#3</strong> : <input class="teamMembers" type="text" />
                    <br />
                    <strong>#4</strong> : <input class="teamMembers" type="text" />
                    <br />
                    <input id="addTeamButton" type="button" value="Add Team" />
                    <hr />

                    <div id="userList" class="listBox"></div>
                    <input type="hidden" id="userListHidden" />

                    <div id="skillPlace">

                    </div>
                </div>
            </div>
            <div id="tabs-3"><!-- Achievments Tab -->
                <div id="achievmentCreation">
                    <label for="achievmentName">Achievment name:</label>
                    <br />
                    <input id="achievmentName" type="text" />
                    <br />
                    <label for="masterSkillForAchievment">MasterSkill:</label>
                    <br />
                    <select id="masterSkillForAchievment">
                    </select>
                    <br />
                    <label for="achievmentDescription">Description:</label>
                    <br />
                    <textarea id="achievmentDescription" rows="5" cols="30"></textarea>
                    <br />
                    <label for="teamPointsReward">Team Points Reward?</label>
                    <br />
                    <input type="text" id="teamPointsReward" value="15" />
                    <br />
                    <input id="addAchievmentButton" type="button" value="Add Achievment" />
                </div>
            </div>
            <div id="tabs-4">
                <a href="lottery.php" target="_blank">Click to go to the Lottery :)</a>
            </div>

            <div id="tabs-5">
            </div>
        </div>
    </body>
</html>
