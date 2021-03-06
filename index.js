// Backbone components
// var AppView = require('./app-view');
// var appView = new AppView();

// stock jQuery
global.$ = require('jquery');
var _ = require('lodash');
var Promise = require('bluebird');

var projects = {
    'gripen': 1492890,
    'stryker': 1496834,
    'monorail': 1492888,
    'maglev': 1492892,
    'ui': 1508076
};

var ptBaseURL = 'https://www.pivotaltracker.com/services/v5';
var storiesUrl = function(projectName) {
    return ptBaseURL +
    '/projects/' + projects[projectName] + '/stories' +
    '?filter=state:delivered,finished,rejected,started,unstarted,unscheduled';
};
var epicsUrl = function(projectName) {
    return ptBaseURL +
    '/projects/' + projects[projectName] + '/epics';
};
var iterationsUrl = function(projectName) {
    return ptBaseURL +
    '/projects/' + projects[projectName] + '/iterations?scope=current_backlog';
    // scope = 'current', 'done', 'backlog', current_backlog
};

// var url = 'https://www.pivotaltracker.com/services/v5';
// url += '/projects/' + projects.gripen;
// url += '/stories?filter=state:delivered,finished,rejected,started';
// url += ',unstarted,unscheduled';
// url += '&limit=20';

var sizeFromEstimate = function(value) {
    return "fa-lg";
    // if (value > 1.1 && value < 3.1) {
    //     //2 or 3
    //     return "fa-lg";
    // }
    // if (value > 3.1 && value < 5.1) {
    //     //4 or 5
    //     return "fa-2x";
    // }
    // if (value > 5.1 && value < 7.9) {
    //     // 6 or 7
    //     return "fa-3x";
    // }
    // if (value > 7.9) {
    //     // 8+
    //     return "fa-4x";
    // }
    // return "";
};

var contextColorFromState = function(current_state) {
    // story.current_state ('accepted','started','delivered','finished','unscheduled','unstarted')
    if (current_state == "unstarted") {
        return "text-muted";
    }
    if (current_state == "unscheduled") {
        // return "text-muted";
        return "text-warning";
    }
    if (current_state == "delivered" || current_state == "finished" ) {
        return "text-primary";
    }
    if (current_state == "accepted" || current_state == "started" ) {
        return "text-success";
    }
    if (current_state == "rejected" ) {
        return "text-danger";
    }
    return "text-info";
};


var retrievePivotalTrackerData = function(projectName) {
    var gripenEpics = Promise.resolve($.ajax({url: epicsUrl(projectName)}))
    .then(function(epics) {
        // console.log("epics are in!");
        $("#"+projectName).append("<h3><a href=\"https://www.pivotaltracker.com/n/projects/"+projects[projectName]+"\">"+projectName+"</a></h3>");
        _.forEach(epics, function(epic) {
            // console.log(epic);
            $("#"+projectName)
            .append("<div class=\"panel panel-info\" id=\""+epic.label.id+"\"></div>");
            $("#"+epic.label.id)
            .append("<div class=\"panel-heading\"><h3 class=\"panel-title\" type=\"button\"><a href=\""+epic.url+"\" target=\"_blank\"><i class=\"fa fa-external-link\"></i></a>&nbsp;"+epic.label.name+"</h3></div>")
            .append("<div class=\"panel-body\"></div>");
        });
        // epic.id
        // epic.name
        // epic.description
        // epic.label.id
        // epic.label.name
        return Promise.resolve($.ajax({url: storiesUrl(projectName)}));
    })
    //Promise.resolve($.ajax({url: iterationsUrl(projectName)}))
    // .then(function(iterations) {
    //     console.log("iterations are in");
    //     console.log(iterations);
    //     // iterations is an Array of objects
    //     // obj.kind = "iteration"
    //     // obj.stories = [array of stories]
    //     // obj.stories[2].id
    //     // obj.stories[2].url
    //     // obj.stories[2].story_type (feature, chore, etc)
    //     // obj.stories[2].name
    //     // obj.stories[2].labels[1].id
    //     // obj.stories[2].labels[1].name
    //     // get the stories
    //
    // })
    .then(function(stories) {
        $("#"+projectName+" .fa-spinner").hide();
        console.log("stories are in for "+projectName);
        _.forEach(stories, function(story) {
            // console.log(story);
            // console.log(story.labels[0].id);
            if(story.labels && story.labels[0] && $("#"+story.labels[0].id)) {
                // console.log("INSERT!");
                // $(#123456) represents the panel for the epic in the label
                if (story.estimate) {
                    $("#"+story.labels[0].id+" .panel-body")
                    .append("<a href=\""+story.url+"\"><i class=\"fa fa-square "+sizeFromEstimate(story.estimate)+
                    " "+contextColorFromState(story.current_state)+"\"></i></a>");
                } else {
                    $("#"+story.labels[0].id+" .panel-body")
                    .append("<a href=\""+story.url+"\"><i class=\"fa fa-question-circle fa-lg "+contextColorFromState(story.current_state)+"\"></i></a>");
                }
            }
            // $("#gstories").after("<li><i class=\"fa-li fa fa-square\"></i><a href=\""+story.url+"\">"+story.name+"</a></li>");
            //$(story.labels[0].id)
        });
        // story.id
        // story.labels[1].name
        // story.labels[1].id
        // story.story_type
        // story.url
        // story.estimate
        // story.name
        // story.current_state ('accepted','started','delivered','finished','unscheduled','unstarted')
        // story.description
    });
};


var retrieveGithubTrackerData = function() {
    var util = require('util');
    var Github = require("github-api");
    var github = new Github({});
    var repo = github.getRepo('rackhd','rackhd');

    repo.show(function(err, repo) {
        // console.log("err is", err);
        // console.log("repo is ", repo);
        $("#github .fa-spinner").hide();
        $("#github").append("<a href=\"https://github.com/rackhd\">RackHD</a> stars: "+repo.stargazers_count);
        // console.log(util.inspect(github));
    });

    var pullrequests = github.getSearch("is%3Aopen+is%3Apr+user%3ARackHD");
    console.log("pullrequests are ", pullrequests);
    pullrequests.issues({}, function (err, prs) {
        // console.log("err is", err);
        // console.log("PRs are ", prs);
        $("#github").append("<p>Pull Requests: "+prs.total_count+"</p><ul class=\"pullrequests\"></ul>");
        _.forEach(prs.items, function(pullrequest) {
            $("#github .pullrequests").append("<li><a href=\""+pullrequest.html_url+"\">"+pullrequest.title+"</a>");
        });
    });

    var buglist = github.getSearch("is%3Aopen+is%3Aissue+user%3ARackHD+label%3Abug");
    buglist.issues({}, function (err, bugs) {
        // console.log("err is", err);
        // console.log("issues are ", bugs);
        $("#github").append("<p>Bugs: "+bugs.total_count+"</p><ul class=\"buglist\"></ul>");
        _.forEach(bugs.items, function(issue) {
            $("#github .buglist").append("<li><a href=\""+issue.html_url+"\">"+issue.title+"</a>");
        });
    });


};
var loadProjects = function() {
    _.forEach(projects, function(projectId, projectName) {
        console.log("retrieving data for ", projectName);
        retrievePivotalTrackerData(projectName);
    });
    retrieveGithubTrackerData();
};

loadProjects();
