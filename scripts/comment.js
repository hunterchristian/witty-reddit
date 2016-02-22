
function Comment(rawComment, parentComment) {
    this.text = rawComment.data.body;
    this.score = rawComment.data.score;

    if (parentComment) {
        this.parentComment = parentComment;
    }

    if (rawComment.data.replies) {
        this.replies = rawComment.data.replies.data.children;
    }

    if (this.text === undefined || this.score === undefined) {
        debugger;
    }
}

Comment.prototype.toJson = function () {
    return {
        text: this.text,
        score: this.score,
        parentComment: this.parentComment
    };
};

module.exports = Comment;
