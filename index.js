// Backbone components
// var AppView = require('./app-view');
// var appView = new AppView();

// stock jQuery
global.$ = require('jquery');
var ui = require('jquery-ui');
var _ = require('lodash');
var Promise = require('bluebird');

var projects = {
    'gripen': 1492890,
    'styker': 1496834,
    'monorail': 1492888,
    'maglev': 1492892
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


// var url = 'https://www.pivotaltracker.com/services/v5';
// url += '/projects/' + projects.gripen;
// url += '/stories?filter=state:delivered,finished,rejected,started';
// url += ',unstarted,unscheduled';
// url += '&limit=20';
console.log('requesting stories for Gripen');
var gripenEpics = Promise.resolve($.ajax({url: epicsUrl('gripen')}))
.then(function(epics) {
    console.log("epics are in!");
    _.forEach(epics, function(epic) {
        console.log(epic);

        $("#gstories").after("<h3><a href=\""+epic.url+"\">"+epic.label.name+"</a></h3>");
    });

}).then(function() {
    // get the stories
    return Promise.resolve($.ajax({url: storiesUrl('gripen')}));
}).then(function(stories) {
    console.log("stories are in!");
    _.forEach(stories, function(story) {
        console.log(story);
        $("#gstories").after("<li><a href=\""+story.url+"\">"+story.name+"</a></li>");
    });
});

$('body').prepend('<p>Woooooooooooooot</p>');
