var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

module.exports = Backbone.View.extend({
    initialize: function() {
                    console.log('yo, here!');
                    this.render();
                },
    render: function() {
                var url = 'https://www.pivotaltracker.com/services/v5';
                url += '/projects/' + 1492890;
                url += '/stories?filter=state:delivered,finished,rejected,started';
                url += ',unstarted,unscheduled';
                url += '&limit=20';
                $.ajax({url: url}).done(function(stories) {
                    console.log("stories are in!");
                    console.log(stories);
                    $('body').prepend(stories);
                });

                $('body').prepend('<p>Woooooooooooooot</p>');
            }
});
