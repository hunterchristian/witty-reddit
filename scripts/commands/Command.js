var Promise = require('promise');

function Command() {}

Command.prototype.execute = function () {
    return new Promise(this.operation.bind(this));
};

module.exports = Command;
