/**
 * Created by Thomas on 26.08.2015.
 */
var opcua = require("node-opcua");

// Promise API for server createion
var Q = require('q');

// Let's create an instance of OPCUAServer
var server = new opcua.OPCUAServer({
  port: 4334, // the port of the listening socket of the server
  resourcePath: "UA/InputModuleMock", // this path will be added to the endpoint resource name
  buildInfo : {
    productName: "InputModuleMock",
    buildNumber: "7658",
    buildDate: new Date(2015,8,6)
  }
});

/**
 * Create the variables using a generalized function
 * @param server
 */
function construct_my_address_space(server) {
  // Mi5-Tag
  server.engine.addFolder("RootFolder", {browseName: "Mi5"});

  // Module-Interface
  server.engine.addFolder("Mi5", {browseName: "Module2501"});

  // Module-Interface Input
  server.engine.addFolder("Module2501", {browseName: "Input"});
  createOpcuaVariable('Input', 'MI5.Module2501.Input.PositionInput', 'Double', 0);
  server.engine.addFolder("Input", {browseName: "SkillInput"});
  server.engine.addFolder("SkillInput", {browseName: "SkillInput0"}); // old Array structure
  createOpcuaVariable('SkillInput0', 'MI5.Module2501.Input.SkillInput.SkillInput0.Execute', 'Boolean', false);

  // Module-Interface Output
  server.engine.addFolder("Module2501", {browseName: "Output"});
  server.engine.addFolder("Output", {browseName: "SkillOutput"});
  server.engine.addFolder("SkillOutput", {browseName: "SkillOutput0"});
  createOpcuaVariable('SkillOutput0', 'MI5.Module2501.Output.SkillOutput.SkillOutput0.ID', 'Int16', 8765);
  createOpcuaVariable('SkillOutput0', 'MI5.Module2501.Output.SkillOutput.SkillOutput0.Name', 'String', 'SkillOutput0 / Description');
  createOpcuaVariable('SkillOutput0', 'MI5.Module2501.Output.SkillOutput.SkillOutput0.Ready', 'Boolean', true);
  createOpcuaVariable('SkillOutput0', 'MI5.Module2501.Output.SkillOutput.SkillOutput0.Busy', 'Boolean', false);
  createOpcuaVariable('SkillOutput0', 'MI5.Module2501.Output.SkillOutput.SkillOutput0.Done', 'Boolean', false);
  createOpcuaVariable('SkillOutput0', 'MI5.Module2501.Output.SkillOutput.SkillOutput0.Error', 'Boolean', false);
  server.engine.addFolder("SkillOutput0", {browseName: "ParameterSO0"}); // Folder needs unique name, therfore deviation from module-interface
  server.engine.addFolder("ParameterSO0", {browseName: "ParameterSO00"}); // temp convention: SOx for SkillOutputx, Parameter Count, SOxy
  createOpcuaVariable('ParameterSO00', 'MI5.Module2501.Output.SkillOutput.SkillOutput0.Parameter.Parameter0.ID', 'Int16', 8765);
  createOpcuaVariable('ParameterSO00', 'MI5.Module2501.Output.SkillOutput.SkillOutput0.Parameter.Parameter0.Name', 'String', 'Parameter0 Desription - Marmelade');
  createOpcuaVariable('ParameterSO00', 'MI5.Module2501.Output.SkillOutput.SkillOutput0.Parameter.Parameter0.Unit', 'String', 'ml');
  createOpcuaVariable('ParameterSO00', 'MI5.Module2501.Output.SkillOutput.SkillOutput0.Parameter.Parameter0.Value', 'Int16', 0);
  createOpcuaVariable('ParameterSO00', 'MI5.Module2501.Output.SkillOutput.SkillOutput0.Parameter.Parameter0.Default', 'Int16', 50);
  createOpcuaVariable('ParameterSO00', 'MI5.Module2501.Output.SkillOutput.SkillOutput0.Parameter.Parameter0.MinValue', 'Int16', 10);
  createOpcuaVariable('ParameterSO00', 'MI5.Module2501.Output.SkillOutput.SkillOutput0.Parameter.Parameter0.MaxValue', 'Int16', 100);
  createOpcuaVariable('ParameterSO00', 'MI5.Module2501.Output.SkillOutput.SkillOutput0.Parameter.Parameter0.Required', 'Boolean', true);

  // StateValues
  server.engine.addFolder("Mi5", {browseName: "StateValue"});
  server.engine.addFolder("StateValue", {browseName: "StateValue0"});
  createOpcuaVariable('StateValue0', 'MI5.Module2501.StateValue.StateValue0.Value', 'Int16', 40);
  createOpcuaVariable('StateValue0', 'MI5.Module2501.StateValue.StateValue0.Name', 'String', 'Percentage Done');
  createOpcuaVariable('StateValue0', 'MI5.Module2501.StateValue.StateValue0.Description', 'String', 'Percentage of done - Long Description'); // max-size=200
  createOpcuaVariable('StateValue0', 'MI5.Module2501.StateValue.StateValue0.Unit', 'String', '%');
  server.engine.addFolder("StateValue", {browseName: "StateValue1"});
  createOpcuaVariable('StateValue1', 'MI5.Module2501.StateValue.StateValue1.StringValue', 'String', 'http://xyz.de/id=123453');
  createOpcuaVariable('StateValue1', 'MI5.Module2501.StateValue.StateValue1.Name', 'String', 'Last Scan');
  createOpcuaVariable('StateValue1', 'MI5.Module2501.StateValue.StateValue1.Description', 'String', 'URL to the .ojb/.stl file of the last object that has been scanned'); // max-size=200
  createOpcuaVariable('StateValue1', 'MI5.Module2501.StateValue.StateValue1.Unit', 'String', 'string');

  // Recipe Mock
  server.engine.addFolder("Mi5", {browseName: "Recipe"});
  server.engine.addFolder("Recipe", {browseName: "Recipe[0]"}); // newer Array Structure
  createOpcuaVariable('Recipe[0]', 'MI5.Recipe[0].Description', 'String', 'Recipe 0 description');
  createOpcuaVariable('Recipe[0]', 'MI5.Recipe[0].Name', 'String', 'XTS one Round');
  createOpcuaVariable('Recipe[0]', 'MI5.Recipe[0].RecipeID', 'Int16', 10001);
  server.engine.addFolder("Recipe", {browseName: "Recipe[1]"}); // newer Array Structure
  createOpcuaVariable('Recipe[1]', 'MI5.Recipe[1].Description', 'String', 'Recipe 1 description');
  createOpcuaVariable('Recipe[1]', 'MI5.Recipe[1].Name', 'String', 'XTS two Round');
  createOpcuaVariable('Recipe[1]', 'MI5.Recipe[1].RecipeID', 'Int16', 10002);

  // Order-tool
  server.engine.addFolder("Mi5", {browseName: "Order"});
  server.engine.addFolder("Order", {browseName: "Order[0]"});
  var localPending = false;
  function pendingSet(variant){
    localPending = variant.value; // boolean cast
    // Reset false after it has been set to true
    if(variant.value == true){
      setTimeout(function(){
        localPending = false;
      },1000);
    }
    return opcua.StatusCodes.Good;
  }
  function pendingGet(){
    return new opcua.Variant({dataType: opcua.DataType['Boolean'], value: localPending });
  }
  createOpcuaVariable('Order[0]', 'MI5.Order[0].Pending', 'Boolean', false, pendingSet, pendingGet);
  createOpcuaVariable('Order[0]', 'MI5.Order[0].Locked', 'Boolean', false);
  createOpcuaVariable('Order[0]', 'MI5.Order[0].Name', 'String', '');
  createOpcuaVariable('Order[0]', 'MI5.Order[0].RecipeID', 'Int16', 0);
  createOpcuaVariable('Order[0]', 'MI5.Order[0].TaskID', 'Int16', 0);
  server.engine.addFolder("Order[0]", {browseName: "UserParameter"});
  server.engine.addFolder("UserParameter", {browseName: "UserParameter[0]"});
  createOpcuaVariable('UserParameter[0]', 'MI5.Order[0].UserParameter[0].Value', 'Int16', 0);
  server.engine.addFolder("UserParameter", {browseName: "UserParameter[1]"});
  createOpcuaVariable('UserParameter[1]', 'MI5.Order[0].UserParameter[1].Value', 'Int16', 0);
  server.engine.addFolder("UserParameter", {browseName: "UserParameter[2]"});
  createOpcuaVariable('UserParameter[2]', 'MI5.Order[0].UserParameter[2].Value', 'Int16', 0);
  server.engine.addFolder("UserParameter", {browseName: "UserParameter[3]"});
  createOpcuaVariable('UserParameter[3]', 'MI5.Order[0].UserParameter[3].Value', 'Int16', 0);
  server.engine.addFolder("UserParameter", {browseName: "UserParameter[4]"});
  createOpcuaVariable('UserParameter[4]', 'MI5.Order[0].UserParameter[4].Value', 'Int16', 0);
  server.engine.addFolder("UserParameter", {browseName: "UserParameter[5]"});
  createOpcuaVariable('UserParameter[5]', 'MI5.Order[0].UserParameter[5].Value', 'Int16', 0);

}

/**
 * Promised based API for server
 *
 * usage: serverQ()
 *         .then(post_initialize)
 *         .then(start_server);
 * @returns {Promise}
 */
var serverQ = function(){
  return Q.Promise(function(resolve){
    server.initialize(resolve);
  });
};
// exports a promise, so that the sole require does not start a server.
exports.instance = function(){
  return Q.promise(function(resolve){
    serverQ()
      .then(post_initialize)
      .then(start_server)
      .then(resolve);
  });
};

/**
 * Create a console interface
 *
 * start the server directly using:
 * // $..PassiveModule\test\mock>node opcua-server.js --start
 */
if(process.argv.pop() == '--start'){
  serverQ()
    .then(post_initialize)
    .then(start_server)
    .catch(console.log);
}

/**
 * Construct the address space
 *
 * this post_initialize is from the node-opcua github example
 * @returns {Promise}
 */
function post_initialize() {
  console.log("initialized");

  return Q.promise(function(resolve){
    construct_my_address_space(server);
    resolve();
  });
}

/**
 * start the server
 *
 * @returns {Promise}
 */
function start_server(){
  return Q.promise(function(resolve){
    server.start(function(err) {
      console.log('err',err);
      console.log("Server is now listening ... ( press CTRL+C to stop)");
      console.log("port ", server.endpoints[0].port);
      var endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
      console.log(" the primary server endpoint url is ", endpointUrl );

      resolve();
    });
  });
}


//============================================================================================================
//===============================    Helper   ================================================================
//============================================================================================================
/**
 * Generate 15 digit random string
 * used for 'variable variable names'
 *
 * @returns {String}
 */
function createVariableName()
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwx";

  for( var i=0; i < 15; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

// important
var localVars = [];

/**
 * uses node v0.48
 *
 * @param parent
 * @param nodeId
 * @param type
 * @param value
 */
function createOpcuaVariable(parent, nodeId, type, value, setter, getter) {
  var helper = require('./../../models/opc-helper.js').helper;

  nodeId = helper.checkAndCorrectNodeId(nodeId);
  var browseName = nodeId.split('.').pop();

  // add to localVars array
  var currentElement = localVars.length;
  localVars[currentElement] = value;

  // functions
  function defSetter(variant) {
    if (type == 'Double') {
      localVars[currentElement] = parseFloat(variant.value);
    } else if (type == 'Int16' || type == 'UInt16') {
      localVars[currentElement] = parseInt(variant.value, 10);
    } else { // e.g. String, Boolean
      localVars[currentElement] = variant.value;
    }
    return opcua.StatusCodes.Good;
  }
  function defGetter(){
    return new opcua.Variant({dataType: opcua.DataType[type], value: localVars[currentElement] });
  }
  if(typeof setter == 'function'){
    defSetter = setter;
  }
  if(typeof getter == 'function'){
    defGetter = getter;
  }

  // generate random string for adding to server object
  var randomString  = createVariableName();
  try{
    var options = {
      nodeId: nodeId,
      browseName: browseName,
      dataType: type,
      value: {
        get: defGetter,
        set: defSetter
      }
    };
    server[randomString] = server.engine.addVariable(parent, options);
    console.log('created: ', nodeId);
  } catch(err){
    console.log('err',err);
  }
}