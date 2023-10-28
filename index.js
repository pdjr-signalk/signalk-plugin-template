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

const HttpInterface = require('./lib/signalk-libhttpinterface/HttpInterface.js');
//const Log = require('./lib/signalk-liblog/Log.js');
//const Delta = require("./lib/signalk-libdelta/Delta.js");
//const Notification = require("./lib/signalk-libnotification/Notification.js");

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

  plugin.start = function(options) {
    const httpInterface = new HttpInterface(app.getSelfPath('uuid'));

    console.log(httpInterface.getServerAddress());
    console.log(httpInterface.getServerInfo());
    console.log(httpInterface.getAuthenticationToken());
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
