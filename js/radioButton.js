(function(PLUGIN_ID){
    "use trict"

    var matchingInfo = []; //Information about which options in the specified radion button match which group fields
    var config = kintone.plugin.app.getConfig(PLUGIN_ID); //Fetches the plugins settings set by the user
    var numKeys = Object.keys(config).length - 1; //Don't include the radio Button itself (config.radioButton)
    for(var i=0; i<numKeys ;i++){
        matchingInfo.push(JSON.parse(config['match'+i]));
    }

    kintone.events.on(['app.record.edit.show', 'app.record.detail.show', 'app.record.create.show', 'app.record.create.change.' + config['radioButton'],
                      'app.record.edit.change.'+ config['radioButton']], function(event) {
        var radioButtonSelectionName = event['record'][config['radioButton']]['value'];

        //Loops through all matches to determine which fields to open and close
        for (var i=0; i<numKeys; i++) {
            var optionName = matchingInfo[i].optionName;
            var groupFieldCode = matchingInfo[i].groupFieldCode;
            if(radioButtonSelectionName == optionName) {
              kintone.app.record.setGroupFieldOpen(groupFieldCode, true); //Open this field group
            } else {
              kintone.app.record.setGroupFieldOpen(groupFieldCode, false); //Close this field group
            }
        }
        return event;
    });
})(kintone.$PLUGIN_ID);
