'use strict';

const _ = require('lodash');

/**
 * Draw a measurement from the relationship between a child comment and a parent comment.
 * @param {Comment} childComment
 * @param {Comment} parentComment
 * @returns {boolean}
 */
function calcHivemindRating(childComment, parentComment) {
    if (parentComment) {
        return true;
        // if (this.parentComment.score < 10 && this.score - this.parentComment.score > 20) {
        //     this.hivemindRating = true;
        // } else if (this.parentComment.score < 100 && this.score - this.parentComment.score > 100) {
        //     this.hivemindRating = true;
        // } else if (this.parentComment.score < 500 && this.score - this.parentComment.score > 500) {
        //     this.hivemindRating = true;
        // } else if (this.parentComment.score < 1000 && this.score - this.parentComment.score > 1000) {
        //     this.hivemindRating = true;
        // }
    } else {
        return false;
    }
}


/**
 * Constructor for a Comment object.
 * @param {String} submissionLink
 * @param {Object} commentDataFields - object containing the desired comment data that we want to display
 *          - {String} text
 *          - {number} score
 *          - {String} id - the id of the comment
 * @param {Comment} [parentComment]
 * @constructor
 */
function Comment(submissionLink, commentDataFields, parentComment) {
    _.extend(this, commentDataFields);

    this.submissionLink = submissionLink;
    this.linkToContext = submissionLink + this.id;
    this.hivemindRating = false;

    if (parentComment) {
        this.hivemindRating = calcHivemindRating(this, parentComment);
    }
}

Comment.prototype.getSubmissionLink = function () {
    return this.submissionLink;
};

Comment.prototype.toJson = function () {
    return {
        text: this.body,
        score: this.score,
        linkToContext: this.linkToContext,
        hivemindRating: this.hivemindRating
    };
};

module.exports = Comment;
