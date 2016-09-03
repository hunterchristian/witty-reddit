var Submission = require('./models/Submission');
var Comment = require('./models/Comment');
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
    }
};


module.exports = Parser;
