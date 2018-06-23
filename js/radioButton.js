(function(PLUGIN_ID){
  "use strict"

  var numKeys;
  var matchingInfo = [];

  var api =  new Promise(
    function (resolve, reject) {
      var config = kintone.plugin.app.getConfig(PLUGIN_ID);
      numKeys = Object.keys(config).length;
      for(var i=0; i<numKeys ;i++){
        matchingInfo.push(JSON.parse(config['match'+i]));
      }
      resolve("SUCCESS");
    }
  );

  function failureCallback() {
    console.log("It failed");
  }

  kintone.events.on(['app.record.edit.show', 'app.record.detail.show', 'app.record.create.show', 'app.record.create.change.radioButton', 'app.record.edit.change.radioButton'], function(event) {
    api.then(eventHandler, failureCallback);

    function eventHandler(e) {
      var radioButtonSelectionName = event['record']['radioButton']['value'];

      for (var i=0; i<numKeys; i++) {
        var optionName = matchingInfo[i].optionName;
        var groupField = matchingInfo[i].groupField;
        if(radioButtonSelectionName == optionName) {
          kintone.app.record.setGroupFieldOpen(groupField, true);
        } else {
          kintone.app.record.setGroupFieldOpen(groupField, false);
        }
      }
    }
  });
})(kintone.$PLUGIN_ID);
