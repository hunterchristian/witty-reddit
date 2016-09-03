'use strict';

const _ = require('lodash');
const Command = require('../Command');
const RedditRequest = require('./RedditRequest');
const Comment = require('../../models/Comment');

const COMMENT = 't1';
const COMMENT_FIELDS = ['body', 'score', 'id'];

/**
 * Indicate that the response was not structured in a way that we expected.
 */
function handleMalformedResponse() {
    console.error('malformed response received in GetCommentsForSubmission');
}

/**
 * Retrieve the comments from the response.
 * @param {Object} response
 * @param {Comment} parentComment
 * @param {String} submissionLink
 * @returns {Array<Object>}
 */
const parsedComments = [];
function getCommentsFromResponse(response, parentComment, submissionLink) {
    const submissionContents = response.data.children;
    _.each(submissionContents, function (pieceOfContent) {
        if(pieceOfContent.kind === COMMENT) {
            const rawComment = _.pick(pieceOfContent.data, COMMENT_FIELDS);
            const parsedComment = new Comment(submissionLink, rawComment, parentComment);
            parsedComments.push(parsedComment);
            
            const replies = pieceOfContent.data.replies;
            if (replies) {
                getCommentsFromResponse(replies, parsedComment, submissionLink);
            }
        }
    });
}

/**
 * Check to see if the data we requested is present in the response.
 * @param {Object} response
 * @returns {boolean}
 */
function validResponseReceived(response) {
    return !!(response[1] && response[1].data && response[1].data.children);
}

/**
 * Constructor for the GetCommentsForSubmission command.
 * @param {Submission} submission
 * @constructor
 **/
function GetCommentsForSubmission(submission) {
    this.submission = submission;
}

_.extend(GetCommentsForSubmission.prototype, Command.prototype, {
    operation: function (resolve, reject) {
        var requestComments = new RedditRequest('/r/gaming/.json');
        requestComments.execute().then(function (responseAsString) {
            // do some stuff with the response that we received...I parse it into a JavaScript object and do some cool
            // stuff with ranking the comments in this project. You can ask me about it, but I removed it here to
            // demonstrate the design pattern.
            resolve();
        }.bind(this), reject);
    }
});

module.exports = GetCommentsForSubmission;