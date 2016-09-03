/**
 * Created by hunterhodnett on 5/15/15.
 */
const http = require('http');
const _ = require('lodash');
const parser = require('./parser');
const Comment = require('./models/Comment');
const Promise = require('promise');
const GetCommentsForSubmission = require('./commands/requests/GetCommentsForSubmission');

var WittyCalc = {
  getAskRedditWittyComments: function(callback) {
    var wittyComments = [];

    http.get({
        host: 'www.reddit.com',
        path: '/r/AskReddit/hot/.json'
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });

        response.on('end', function() {
            const submissions = parser.parseSubmissions(JSON.parse(body));
            const parsingPromises = [];
            _.each(submissions, function (submission) {
                var command = new GetCommentsForSubmission(submission);
                parsingPromises.push(command.execute());
            });
            
            Promise.all(parsingPromises).then(function (listOfCommentsForAllSubmissions) {
                var allWittyComments = [];
                _.each(listOfCommentsForAllSubmissions, function (commentsForSingleSubmission) {
                    allWittyComments.concat(_.filter(commentsForSingleSubmission, function (comment) {
                        return comment.hivemindRating;
                    }));

                    debugger;
                });

                debugger;
                
                callback(allWittyComments);
            });
        });
    });
  }
};

module.exports = WittyCalc;


