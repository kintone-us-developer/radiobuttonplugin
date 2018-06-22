(function(PLUGIN_ID){
    "use strict"

    var fields, options;
    var matchingInfo = [];

    kintone.api(kintone.api.url('/k/v1/preview/app/form/fields', true), 'GET', {
        'app': kintone.app.getId()
    }, function(resp) {
            //Creates an object of arrays of each field type
            fields = {
                'radioButtonField': [],
                'groupField': [],
        };
        for (var key in resp.properties) {
            var field = resp.properties[key];
            var item = {
                label: field.label || field.code,
                code: field.code,
                type: field.type,
                options: null
            };
            switch (field.type) {
                case 'RADIO_BUTTON':
                    item.options = field.options;
                    fields['radioButtonField'].push(item);
                    break;
                case 'GROUP':
                    fields['groupField'].push(item);
                    break;
                default:
                    break;
            }
        }
        options = Object.keys(fields.radioButtonField[0].options);
        console.log(options);//an array of all options

        var config = kintone.plugin.app.getConfig(PLUGIN_ID);
        for(var i=0; i<options.length;i++){
            matchingInfo.push(JSON.parse(config['match'+i]));
        }
        console.log(matchingInfo);//matchingInfo is an array of objects that have two properties:'optionName' and 'fieldCode'
    });

    kintone.events.on(['app.record.edit.show', 'app.record.create.show', 'app.record.create.change.radioButton', 'app.record.edit.change.radioButton'], function(event) {

        // for (var field in fields.radioButtonField) {
        //     field.option
        // }

        console.log(matchingInfo);

        var radioButtonField = event['record']['radioButton']['value'];
        //var groupField = event['record']['group']['value'];

        var button1 = 'sample1';
        var button2 = 'sample2';
        var group1 = 'field_group_1';
        var group2 = 'field_group_2';

        if(radioButtonField == button1){
            kintone.app.record.setGroupFieldOpen(group1, true);
            kintone.app.record.setGroupFieldOpen(group2, false);

        } else if(radioButtonField == button2){
            kintone.app.record.setGroupFieldOpen(group2, true);
            kintone.app.record.setGroupFieldOpen(group1,false);

        }


        /////////////////////justin's below

        // kintone.api(kintone.api.url('/k/v1/field/acl', true), 'GET', body, function(resp) {
        //   // success
        //   console.log(resp);
        //}
    })

    // kintone.events.on(['app.record.edit.show', 'app.record.create.show', 'app.record.index.edit.show'], function(event) {
    //     //console.log(kintone.app.record.getFieldElement(countField));
    //     //console.log(document.getElementsByClassName('line-cell-gaia recordlist-ellipsis-gaia'));
    //     event['record'][countField]['disabled'] = true;
    //     return event;
    // })
})(kintone.$PLUGIN_ID);
