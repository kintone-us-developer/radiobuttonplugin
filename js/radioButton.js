(function(PLUGIN_ID){
  "use strict"

  var numKeys;
  var matchingInfo = [];
  var config;

  var api =  new Promise(
    function (resolve, reject) {
      config = kintone.plugin.app.getConfig(PLUGIN_ID);
      numKeys = Object.keys(config).length - 1; //Don't include the radio Button itself
      for(var i=0; i<numKeys ;i++){
        console.log(matchingInfo);
        matchingInfo.push(JSON.parse(config['match'+i]));
      }
      resolve("SUCCESS");
    }
  );

  function failureCallback() {
      console.log("It failed");
  }

  kintone.events.on(['app.record.edit.show', 'app.record.detail.show', 'app.record.create.show', 'app.record.create.change.' + config['radioButton'], 'app.record.edit.change.'+ config['radioButton']], function(event) {
      api.then(eventHandler, failureCallback);

      function eventHandler() {
          var radioButtonSelectionName = event['record'][config['radioButton']]['value'];

          for (var i=0; i<numKeys; i++) {
              var optionName = matchingInfo[i].optionName;
              var groupFieldCode = matchingInfo[i].groupFieldCode;
              console.log(optionName);
              console.log(radioButtonSelectionName);
              if(radioButtonSelectionName == optionName) {
                console.log(groupFieldCode);
                kintone.app.record.setGroupFieldOpen(groupFieldCode, true);
              } else {
                kintone.app.record.setGroupFieldOpen(groupFieldCode, false);
              }
          }
      }
      return event;
  });
})(kintone.$PLUGIN_ID);
