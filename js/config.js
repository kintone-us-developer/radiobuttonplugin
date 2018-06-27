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

            config['radioButton'] = $('#radioButtonID').val();
            for(var i=0; i<options.length; i++){
                config['match'+i] = JSON.stringify({optionName: options[i], groupFieldCode: $('#'+options[i].replace(/[^a-zA-Z0-9]+/g,'')).val()});
                console.log($('#'+options[i].replace(/[^a-zA-Z0-9]+/g,'')).val());
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
        var templateRadioButton = $.templates(document.querySelector('#plugin-template-radioButton'));
        var templateItemsRadioButton = {kintoneRadioButtons:[]};

        templateItemsRadioButton.kintoneRadioButtons.push({
            title: "Select your desired Radio Button Field below",
            require: '*',
            row: '',
            id: 'radioButtonID',
            fields: fields.radioButtonField
        });

        //render HTML
        $('#plugin-container').html(templateRadioButton(templateItemsRadioButton));

        $('#radioButtonID').change(function() {
            var templateOption = $.templates(document.querySelector('#plugin-template-option'));
            var templateItemsOption = {kintoneFields:[], pluginSubmit:'', pluginCancel:''};

            var selectedFieldCode = $('#radioButtonID').val();

            var options = [];
            //var selectedRadioButtonLabel ='';
            for(var i=0; i<fields.radioButtonField.length; i++){
                if(fields.radioButtonField[i].code==selectedFieldCode){
                    options = Object.keys(fields.radioButtonField[i].options);
                    //selectedRadioButtonLabel = fields.radioButtonField.label;
                }
            }

            //As the number of radio buttons increase, change the index of the fields.radioButtonField array
            for(var i=0; i<options.length; i++){
                templateItemsOption.kintoneFields.push({
                    title: options[i],
                    require: '*',
                    row: '',
                    id: options[i].replace(/[^a-zA-Z0-9]+/g,''),
                    fields: fields.groupField
                });
            }
            // section4 buttons
            templateItemsOption.pluginSubmit = i18n.submitButton;
            templateItemsOption.pluginCancel = i18n.cancelButton;

            //$('#plugin-template-option').remove();
            //$(”script”).remove(”#plugin-template-option”);
            //$('#plugin-container').remove(templateOption(templateItemsOption));
            $("#plugin-template-option-div").remove();

            $('#plugin-container').append(templateOption(templateItemsOption));
            appendEvents(fields);
        });
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
                        item.options = field.options;
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

            //When the plugin setting page is re-opened, it displays the previously set conditions.
            var config = kintone.plugin.app.getConfig(PLUGIN_ID);
            var numKeys = Object.keys(config).length;
            if (numKeys != 0) {
            var options = Object.keys(fields.radioButtonField[0].options);
            for(var i=0; i<options.length; i++){
                console.log(JSON.parse(config['match'+i]));
                $('#'+options[i]).val(JSON.parse(config['match'+i]).groupField);
                }
            }

            appendEvents(fields);

        });
    };

    // initiated
    $(document).ready(function() {
        renderHtml();
    });
})(jQuery, kintone.$PLUGIN_ID);
