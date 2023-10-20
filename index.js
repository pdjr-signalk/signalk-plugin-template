/**
 * Copyright 2020 Paul Reeve <preeve@pdjr.eu>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const bonjour = require('bonjour')();

const Log = require("./lib/signalk-liblog/Log.js");
//const Delta = require("./lib/signalk-libdelta/Delta.js");
//const Notification = require("./lib/signalk-libnotification/Notification.js");
//const App = require('./lib/signalk-libapp/App.js');

const PLUGIN_ID = "test";
const PLUGIN_NAME = "Test";
const PLUGIN_DESCRIPTION = "Test platform";
const PLUGIN_SCHEMA = {
  "type": "object",
  "properties": {
  }
};
const PLUGIN_UISCHEMA = {};

module.exports = function (app) {

  var plugin = {};
  var unsubscribes = [];

  plugin.id = PLUGIN_ID;
  plugin.name = PLUGIN_NAME;
  plugin.description = PLUGIN_DESCRIPTION;
  plugin.schema = PLUGIN_SCHEMA;
  plugin.uiSchema = PLUGIN_UISCHEMA;

  const log = new Log(plugin.id, { ncallback: app.setPluginStatus, ecallback: app.setPluginError });
  
  plugin.start = function(options, restartPlugin) {
    const serverUuid = app.getSelfPath('uuid');

    plugin.options = { services: { webpush: { } } };
    app.debug("using configuration: %s", JSON.stringify(plugin.options, null, 2));

    findServerAddress(app.getSelfPath('uuid')).then((serverAddress) => {
      console.log(serverAddress);
      if (serverAddress) {
        if ((plugin.options.services.webpush) && (!serverAddress.startsWith('https:'))) {
          log.W("disabling web-push service (server not running SSL)");
          delete plugin.options.services.webpush;
        }
      }
    });
  }

  plugin.stop = function() {
    unsubscribes.forEach(f => f());
    unsubscribes = [];
  }

  //plugin.registerWithRouter = function(router) {
  //}

  //plugin.getOpenApi = function() {
  //  require("./resources/openApi.json");
  //}

  async function findServerAddress(uuid, timeout=5) {
    var serverAddress = null;
    return(await new Promise((resolve, reject) => {
      bonjour.find({ type: 'https' }, (service) => {
        if (service.txt.self === uuid) serverAddress = "https://" + service.addresses[0] + ":" + service.port;
      });
  
      setTimeout(() => {                                  // wait for 5 seconds, then...
        if (serverAddress != null) {
          resolve(serverAddress);
        } else {
          bonjour.find({ type: "http" }, (service) => {
            if (service.txt.self === uuid) serverAddress = "http://" + service.addresses[0] + ":" + service.port;
          });
          setTimeout(() => {                              // wait for 5 seconds, then...
            bonjour.destroy();
            resolve(serverAddress);                            // destroy bonjour instance
          }, timeout * 1000);    
        }
      }, (timeout * 1000));
    }).then(() => {
      return(serverAddress);
    }));
  }

  /********************************************************************
   * EXPRESS ROUTE HANDLING

  function handleRoutes(req, res) {
    app.debug("processing %s request on %s", req.method, req.path);
    try {
      switch (req.path.slice(0, (req.path.indexOf('/', 1) == -1)?undefined:req.path.indexOf('/', 1))) {
      }
    } catch(e) {
      app.debug(e.message);
      expressSend(res, ((/^\d+$/.test(e.message))?parseInt(e.message):500), null, req.path);
    }

    function expressSend(res, code, body = null, debugPrefix = null) {
      const FETCH_RESPONSES = { 200: null, 201: null, 400: "bad request", 403: "forbidden", 404: "not found", 503: "service unavailable (try again later)", 500: "internal server error" };
      res.status(code).send((body)?body:((FETCH_RESPONSES[code])?FETCH_RESPONSES[code]:null));
      if (debugPrefix) app.debug("%s: %d %s", debugPrefix, code, ((body)?JSON.stringify(body):((FETCH_RESPONSES[code])?FETCH_RESPONSES[code]:null)));
      return(false);
    }
  }
  */

  return(plugin);
}
