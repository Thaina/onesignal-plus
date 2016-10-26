if(!Object.assign)
    Object.assign = require('util')._extend;

var format = require('util').format;
var https = require('https');

/** @module OneSignal
 * @class OneSignal */
function OneSignal(appID) {
    this.appID = appID;
    this.options = {
        host: 'onesignal.com',
        port: 443,
        version: 'v1',
        debug: false
    };
}

/** This method updates settings
 * @param {Object} options settings
 * @memberof OneSignal
 * @method setup */
OneSignal.prototype.setup = function (options) {
    if(options instanceof Object)
        this.options = Object.assign(this.options,options);
};

/** This method makes request
 * @memberof OneSignal
 * @method request
 * @private */
OneSignal.prototype.__request = function(method,path,data) {
    var options = {
        method: method,
        path: format('/api/%s/%s',this.options.version,path)
    };
    options.host = this.options.host;
    options.port = this.options.port;
    options.headers = {
        'Content-Type': 'application/json',
        'Authorization': format('Basic %s',this.options.api_key)
    };

    return new Promise((resolve,reject) => {
        var req = https.request(options,(res) => {
            res.on('data',resolve);
        }).on('error',(e) => reject([e]));

        if(data)
            req.write(JSON.stringify(data));
        req.end();
    }).then((data) => {
         var response = JSON.parse(data);
         if(response.errors instanceof Array && response.errors.length)
             throw response.errors;

         return response;
    });
};

/** @param {string} path */
OneSignal.prototype.get = (path) => this.__request('get',path);
/** @param {string} path */
OneSignal.prototype.post = (path, data) => this.__request('post',path,data);
/** @param {string} path */
OneSignal.prototype.put = (path, data) => this.__request('put',path,data);
/** @param {string} path */
OneSignal.prototype.delete = (path) => this.__request('delete',path);

exports.OneSignal = OneSignal;
exports.$instance = new OneSignal();
