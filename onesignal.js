var format = require('util').format;
var https = require('https');

/** @module OneSignal
 * @class OneSignal */
function OneSignal(apiKey,version,debug) {
    this.apiKey = apiKey;
    this.version = version || "v1";
    this.debug = debug || false;
    this.options = {
        host: "onesignal.com",
        port: 443,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': format('Basic %s',this.apiKey)
        }
    };

    /**
     * @param {string} method
     * @param {string} path
     */
    this.__request = function(method,path,data) {
        var options = Object.assign({},this.options,{
            method: method,
            path: format('/api/%s/%s',this.version,path)
        });

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
    }
}

/** @param {string} path */
OneSignal.prototype.get = function(path) { return this.__request('delete',path); };
/** @param {string} path */
OneSignal.prototype.post = function(path,data) { return this.__request('post',path,data); };
/** @param {string} path */
OneSignal.prototype.put = function(path,data) { return this.__request('put',path,data); };
/** @param {string} path */
OneSignal.prototype.delete = function(path) { return this.__request('delete',path); };

function create(api_key) {
    return new OneSignal(api_key,"v1",false);
}

module.exports = Object.assign(OneSignal,{
    Create: create
});
