var RedditRequest = require('./simpleCommands/serviceHandlers/redditRequest');
var Promise = require('promise');

function Submission(rawSubmission) {
    this.permalink = rawSubmission.data.permalink;
}

Submission.prototype.getComments = function () {
    return new Promise(function (resolve, reject) {
        var requestComments = new RedditRequest(this.permalink + '.json');
        requestComments.execute().then(function (responseData) {
            var jsonResponse = JSON.parse(responseData);
            resolve(jsonResponse[1].data.children);
        }, reject);
    }.bind(this));
};

Submission.prototype.toJson = function () {
    return {
        permalink: this.permalink
    };
};

module.exports = Submission;
