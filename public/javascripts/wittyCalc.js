/**
 * Created by hunterhodnett on 5/15/15.
 */
var http = require('http');

function getAskRedditWittyComments(callback) {
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
            // Data reception is done, do whatever with it!
            var responseJson = JSON.parse(body);
            wittyComments.push(hotCallback(responseJson, callback));
        });
    });

    return wittyComments;
}

module.exports = getAskRedditWittyComments;

function hotCallback(responseJson, callback) {

    var hotTopics = responseJson.data.children;
    var wittyComments = [];

    for(var i = 0;i < Math.min(hotTopics.length, 10);i++) {
        if(i >= Math.min(hotTopics.length, 10)) {
            requestComments(hotTopics[i].data.url, function(comments) {
                wittyComments.push(comments);
                callback(wittyComments);
            });
        }
        requestComments(hotTopics[i].data.url, function(comments) {
            wittyComments.push(comments);
        });
    }
}

function requestComments(topicLink) {

    var host = 'www.reddit.com';
    var path = topicLink.substring(topicLink.indexOf(host) + host.length, topicLink.length) + '/.json'; // remove host from link

    var wittyComments = [];

    http.get({
        host: host,
        path: path
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });

        response.on('end', function() {
            // Data reception is done, do whatever with it!
            var responseJson = JSON.parse(body);
            wittyComments.push(getWittyComments(responseJson));
            callback(wittyComments);
        });
    });
}

function getWittyComments(responseJson) {
    // Comments are in the second object in the response array. The post is the first object
    var comments = responseJson[1].data.children;
    var wittyComments = [];
    var threshhold = 100;

    for(var i = 0;i < comments.length;i++) {
        var parent = {};
        var child = comments[i];

        var wittyResults = calcWittyness(parent, child, threshhold);

        if(wittyResults.wittyness > threshhold) {
            wittyComments.push(wittyResults)
        }
    }

    return wittyComments;
}

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