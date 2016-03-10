'use strict';

/**
 * Created by Thomas on 27.08.2015.
 */
var assert = require("better-assert");
var _ = require("lodash");

/**
 * Helper Class
 * @type {{checkAndCorrectNodeId: Function, modifiyNodeArray: Function, addAtributeId: Function, concatNodesAndResults: Function}}
 */
var helper = {
  /**
   * Check NodeId and adds / removes stuff if necessary
   *
   * @accepts 'MI5.Queue.Queue0.', 'ns=4;s=MI5.Queue.Queue0'
   * @param baseNode
   * @returns {String}
   */
  checkAndCorrectNodeId : function(baseNode) {
    // add . at the end if missing
    if (baseNode.slice(-1) == '.') {
      baseNode = baseNode.slice(0, -1);
    }

    // check for namespace and node-identifier
    if (baseNode.slice(0, 7) != 'ns=4;s=') {
      baseNode = 'ns=4;s=' + baseNode;
    }

    return baseNode;
  },

  /**
   * Adds node-opcua specific nodes values: 'node' --> {nodeId: node}
   *
   * @param string
   * @returns object
   */
  modifiyNodeArray : function(node) {
    return {
      nodeId : node
    };
  },

  /**
   * Add attributeId to node-object array:
   * {nodeId: node} ==> {nodeId: node, attributeId: 13}
   *
   * @param node
   * @returns {number}
   */
  addAtributeId : function(node){
    node.attributeId = 13;
    return node;
  },

  /**
   * Combines nodes and results to one data array with the structure:
   * [{"nodeId":"MI5.Module1101.Output.SkillOutput.SkillOutput0.Busy",
       * "value":0}, {...}, {...}]
   *
   * @param nodes :
   *          nodeId
   * @param results :
   *          value
   * @returns {Array}
   */
  concatNodesAndResults : function(nodes, results) {
    var output = new Array;
    for (var i = 0; i <= nodes.length; i++) {
      if (nodes[i] != undefined && results[i] != undefined) {
        // Check for BadNodeId (value: null, then statusCode)
        // console.log(nodes[i]);
        // console.log(results[i]);
        if (_.isEmpty(results[i].value)) {
          output[i] = {
            nodeId : nodes[i].nodeId.value,
            value : '',
            error : results[i].statusCode.description
          };
        } else {
          output[i] = {
            nodeId : nodes[i].nodeId.value,
            value : results[i].value.value
          };
        }
      }
    }
    return output;
  },

  /**
   * returns Node-OPCUA Datatype according to normal datatype.
   *
   * e.g.: value
   *          <scalar> the value to writeCB (e.g. "hallo", 1, 23, 2.5, true)
   *
   * @param type
   *          <string> corresponding type (e.g. String, Int16, Int32, Float,
   *          Boolean)
   * @return <nodeData>
   */
  convertDataType : function(type) {
    assert(typeof type === 'string');

    var nodeopcua = require('node-opcua');

    // Match Datatypes:
    if (type === 'String') {
      type = nodeopcua.DataType.String;
    } else if (type === 'Double') {
      type = nodeopcua.DataType.Double
    } else if (type === 'Float') {
      type = nodeopcua.DataType.Float
    } else if (type === 'Int16') {
      type = nodeopcua.DataType.Int16
    } else if (type === 'UInt16') {
      type = nodeopcua.DataType.UInt16
    } else if (type === 'Boolean') {
      type = nodeopcua.DataType.Boolean
    } else {
      console.log('Datatype is not supported by simpleOpcua Model');
      assert(false); // TODO: nicer way
    }

    return type;
  },

};
exports.helper = helper;