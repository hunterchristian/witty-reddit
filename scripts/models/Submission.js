/**
 * Constructor for a Submission object.
 * @param {Object} rawSubmission - a reddit submission in raw JSON format
 * @constructor
 */
function Submission(rawSubmission) {
    this.permalink = rawSubmission.data.permalink;
}

/**
 * Returns a link to this submission
 * @returns {String}
 */
Submission.prototype.getPermalink = function () {
    return this.permalink;
};

/**
 * Print this object in JSON format.
 * @returns {{permalink: *}}
 */
Submission.prototype.toJson = function () {
    return {
        permalink: this.permalink
    };
};

module.exports = Submission;
