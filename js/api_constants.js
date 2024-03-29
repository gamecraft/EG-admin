// requires server_constants.js to be loader first
// Server is defined in server_constants.js

Server.API = {};
Server.API.Skill = "/Skill";
Server.API.TeamMember = "/TeamMember";
Server.API.Team = "/Team";
Server.API.Achievement = "/Achievement";
Server.API.Phase = "/Phase";

Server.API.Helper = {};
Server.API.Helper.ADD_SKILL = "/skill";
Server.API.Helper.ADD_MEMBER = "/member";
Server.API.Helper.PHASE_FINISHED= "/finished";
Server.API.Helper.ADD_POINTS = "/points" // can be added to Team and to TeamMember
Server.API.Helper.ADD_ACHV = "/achievement"; // can be added to Team and to TeamMember
Server.API.Helper.CURRENT_PHASE = "/current";
Server.API.Helper.MARK_PHASE_AS_FINISHED = "/finished";
Server.API.Helper.NEXT_PHASE_ID = "next";
Server.API.Helper.ACTIVE_PHASE = "/active";