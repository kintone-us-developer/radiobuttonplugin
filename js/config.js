jQuery.noConflict();

(function($, PLUGIN_ID){
    "use strict"
    var terms = {
        'en': {
            radioButtonField: 'Radio Button Field',
            submitButton: '     Save   ',
            cancelButton: '     Cancel   '
        }
    }

    var lang = kintone.getLoginUser().language;
    var i18n = (lang in terms) ? terms[lang] : terms['en'];

    // append events
    var appendEvents = function appendEvents(fields) {
        // save plug-in settings
        $('#submit').click(function() {
            var options = Object.keys(fields.radioButtonField[0].options);
            var config = {};
            for(var i=0; i<options.length; i++){
                config['match'+i] = JSON.stringify({optionName: options[i], groupField: $('#'+options[i]).val()});
            }
            kintone.plugin.app.setConfig(config);
        });
        // cancel plug-in settings
        $('#cancel').click(function() {
            history.back();
        });
    };

    // create HTML (call in renderHtml)
    var createHtml = function(fields) {
        // template & items settings
        // '#plugin-template' is defined in config.html
        var template = $.templates(document.querySelector('#plugin-template'));
        var templateItems = {kintoneFields:[], pluginSubmit:'', pluginCancel:''};

        var options = Object.keys(fields.radioButtonField[0].options);
///As the number of radio buttons increase, change the index of the fields.radioButtonField array
        console.log(options);//options is an object

        for(var i=0; i<options.length; i++){
            templateItems.kintoneFields.push({
                title: options[i],
                require: '*',
                row: '',
                id: options[i],
                fields: fields.groupField
            });
        } 
        // section4 buttons
        templateItems.pluginSubmit = i18n.submitButton;
        templateItems.pluginCancel = i18n.cancelButton;
        // render HTML
        $('#plugin-container').html(template(templateItems));
    };

    // render HTML
    var renderHtml = function() {
        kintone.api(kintone.api.url('/k/v1/preview/app/form/fields', true), 'GET', {
            'app': kintone.app.getId()
        }, function(resp) {
            var fields = {
                'radioButtonField': [],
                'groupField': []
            };
            for (var key in resp.properties) {
                var field = resp.properties[key];
                var item = {
                    label: field.label || field.code,
                    code: field.code,
                    type: field.type,
                    options: []
                };
                switch (field.type) {
                    case 'RADIO_BUTTON':
                        console.log(field);
                        item.options = field.options; //the way options are stored is 1,3,2
                        fields['radioButtonField'].push(item);
                        break;
                    case 'GROUP':
                        fields['groupField'].push(item);
                        break;
                    default:
                        break;
                }
            };
            
            Object.keys(fields).forEach(function(f) {
                fields[f].sort(function(a, b) {
                    var aa = a.label || a.code;
                    var bb = b.label || b.code;
                    aa = aa.toUpperCase();
                    bb = bb.toUpperCase();
                    if (aa < bb) {
                        return -1;
                    } else if (aa > bb) {
                        return 1;
                    }
                    return 0;
                });
            });
            
            createHtml(fields);

//再度setting開いた時に前回の設定を表示する。
            //set existing values
//             var config = kintone.plugin.app.getConfig(PLUGIN_ID);
//             if (config) {
// ///ここのidはline48で決める。
//                 var options = Object.keys(fields.radioButtonField[0].options);
//                 for(var i=0; i<options.length; i++){
//                     $(options[i]).val(['match'+i]);
//                 }
//             }

            // append events
            appendEvents(fields);
        });
    };

    // initiated
    $(document).ready(function() {
        renderHtml();
    });
})(jQuery, kintone.$PLUGIN_ID);
