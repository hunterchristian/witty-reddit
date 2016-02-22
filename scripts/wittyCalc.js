/**
 * Created by hunterhodnett on 5/15/15.
 */
var http = require('http');
var parser = require('./parser');
var Comment = require('./comment');
var Promise = require('promise');

function calcWittyness(parent, child, threshhold) {

    var parentUpvotes = comment && comment.data && comment.data.ups;
    var childUpvotes = child.data.ups;

    var wittyness = (childUpvotes / parentUpvotes) * (childUpvotes - parentUpvotes);
    var wittyResults = [];

    if(wittyness > threshhold) {
        wittyResults.push({
            parent: parent,
            wittyComment: child,
            wittyNess: wittyness
        });
    } else if(child.replies.data.children.length > 0) {
        for(var i = 0;i < child.replies.data.children.length;i++) {
            wittyResults.concat(calcWittyness(child.replies.data.children[i]));
        }
    }

    return wittyResults;
}

var highComments = [];

function findWittyComments(comment, parentComment) {
    try {
        for (var i = 0; comment.replies && i < comment.replies.length; i++) {
            if (comment.replies[i].kind === 't1') {
                var briefComment = {text: comment.text, score: comment.score};
                findWittyComments(new Comment(comment.replies[i], briefComment), comment);
            }
        }
        
        if (parentComment !== null && comment.score > parentComment.score) {
            if (parentComment.score < 10 && comment.score - parentComment.score > 20) {
                highComments.push(comment.toJson());
            } else if (parentComment.score < 100 && comment.score - parentComment.score > 100) {
                highComments.push(comment.toJson());
            } else if (parentComment.score < 500 && comment.score - parentComment.score > 500) {
                highComments.push(comment.toJson());
            } else if (parentComment.score < 1000 && comment.score - parentComment.score > 1000) {
                highComments.push(comment.toJson());
            }
        }
    } catch (err) {
        debugger;
    }
}

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
            var submissions = parser.parseSubmissions(JSON.parse(body));
            var parsingPromises = [];

            for (var j = 0; j < submissions.length; j++) {
                parsingPromises.push(parser.parseComments(submissions[j]));
            }
            
            Promise.all(parsingPromises).then(function (commentThreads) {
                for (var i = 0; i < commentThreads.length; i++) {
                    for (var k = 0; k < commentThreads[i].length; k++) {
                        findWittyComments(commentThreads[i][k], null);
                    }
                }
                debugger;
                callback(highComments);
            });
        });
    });
  }
};

module.exports = WittyCalc;


