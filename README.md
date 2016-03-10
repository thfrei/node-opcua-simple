node-opcua-simple
=================

acts as a wrapper for node-opcua package to support promise-based api.

Requires
--------

node-opcua@0.0.48

Usage
-----
```
var nodeOpcuaSimple = new require('node-opcua-simple');
var opcua = new opc.opcua();

opcua.connect(endpointUrl)
  .then(function(){
    
    opcua.read(nodeId)
      .then(function(data){
        console.log(data.value.value);
      });
      
    opcua.write(nodeId, value, type).
      then(function(result){
        console.log(result);
      });
      
    opcua.subscribe()
      .then(ocpua.monitor.bind(opcua, nodeId))
      .then(function(monitoredItem){
        monitoredItem.on('changed', function(data){
          console.log(data.value.value);
        });
      });
  });
```

