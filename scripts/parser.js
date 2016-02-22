var Submission = require('./submission');
var Comment = require('./comment');
var Promise = require('promise');

var Parser = {
    parseSubmissions: function (subredditBody) {
        var parsedSubmissions = [];
        var rawSubmissions = subredditBody.data.children;

        for(var i = 0; i < rawSubmissions.length; i++) {
            var parsedSubmission = new Submission(rawSubmissions[i]);
            parsedSubmissions.push(parsedSubmission);
        }

        return parsedSubmissions;
    },
    parseComments: function (submission) {
        return new Promise(function (resolve, reject) {
            var parsedComments = [];
            
            submission.getComments().then(function (rawComments) {
                for(var i = 0; i < rawComments.length; i++) {
                    if(rawComments[i].kind === 't1') {
                        var parsedComment;
                        try {
                            parsedComment = new Comment(rawComments[i]);
                            parsedComments.push(parsedComment);
                        } catch (err) {
                            debugger;
                        }
                    }
                }
                resolve(parsedComments);        
            }, reject);
        });
    }
};


module.exports = Parser;
