'use strict';

var _ = require('lodash');
var Command = require('../Command');
var http = require('http');

var REDDIT_HOST_NAME = 'www.reddit.com';

/**
 * Constructor for the RedditRequest simple command.
 * @param {String} permalink
 * @constructor
 */
function RedditRequest(permalink) {
    this.permalink = permalink;
}

_.extend(RedditRequest.prototype, Command.prototype, {
    operation: function (resolve, reject) {
        http.get({
            host: REDDIT_HOST_NAME,
            path: this.permalink
        }, function (response) {
            var permalink = this.permalink;

            var body = [];
            response.on('data', function (chunk) {
                body.push(chunk);
            });

            response.on('error', function (err) {
                console.error(err.stack);
                reject('Error occurred while making request to host: ' + REDDIT_HOST_NAME + ', path: ' + permalink);
            });

            response.on('end', function () {
                resolve(Buffer.concat(body).toString());
            });
        }.bind(this));
    }
});  

module.exports =  RedditRequest;
