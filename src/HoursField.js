Ext.onReady(function () {

    /*
    * Extends the Sencha's ExtJS Ext.form.field.Spinner class to provide a new
    * form field suitable for displaying a quantity of hours.
    * Can be used in forms for setting of a treshold values for hours, for example in an application which manipulates working time
    * The raw value of the field displays data in an 'H:i:s'-similar form, for examples '123:44:56', or '123:44', or just '123' (the hours part can be more than 24)
    * To set the value to an hour, one can use setValue(3600), setValue('3600') or setValue('1:00:00')
    *
    * Available configs (all are optional and will be set to defaults if not provided):
    * @param {Number/String} value - as number of seconds or as formatted string, eg. 600, '600' or '00:10:00'
    * @param {Number/String} minValue - as number of seconds or as formatted string, eg. 60, '60' or '00:01:00'. Default is 0, and negative values are not permitted
    * @param {Number/String} maxValue - as number of seconds or as formatted string, eg. 6000, '6000' or '01:40:00'. Default is undefined, and negative values are not permitted
    * @param {String} targetFormat - available values are 'H', 'H:i', 'H:i:s'. Default is 'H:i:s'. Determines how the data is displayed in the field and how is submitted (if submitSeconds is false)
    * @param {Boolean} submitSeconds - if true, the number of seconds will be submitted, instead of the formatted text. Default is false (submit '1:00:00', instead of 3600)
    * @param {String} spinnerTarget - available values are 'hours', 'minutes', 'seconds'. Default is 'hours'. Determines which of the hours/minutes/seconds the spinners will change
    * @param {Number} spinnerStep - Default is 1. Determines the quantity of the hours/minutes/seconds the spinners will add/subtract according to the spinnerTarget
    *
    * regexText can be used to set a custom warning text if the field is invalid. If omitted, the field will show a string consisting of the standard invalidText concatenated with '. Expected format is ' + targetFormat;
    * When invalid values are provided via setValue() method, the field value will be set according to defaults or minValue/maxValue boundaries
    *
    * Example Sencha fiddle available at:
    * https://fiddle.sencha.com/#fiddle/2daf
    * */

    Ext.define('Ext.ux.form.field.Hours', {
        extend: 'Ext.form.field.Spinner',
        alias: 'widget.hoursfield',
        checkChangeBuffer: 150,

        initComponent: function () {
            var me = this;
            me.targetFormat = (!me.targetFormat || ['H', 'H:i', 'H:i:s'].indexOf(me.targetFormat) == -1) ? ('H:i:s') : (me.targetFormat);
            var targetRegex = {
                'H:i:s': /^\d+:[0-5][0-9]:[0-5][0-9]$/i,
                'H:i': /^\d+:[0-5][0-9]$/i,
                'H': /^\d+$/i
            };
            me.regex = targetRegex[me.targetFormat];
            me.maskRe = me.targetFormat == 'H' ? /[\d]/ : /[\d:]/;

            me.spinnerTarget = (!me.spinnerTarget || ['hours', 'minutes', 'seconds'].indexOf(me.spinnerTarget) == -1) ? ('hours') : (me.spinnerTarget);
            me.spinnerStep = (isNaN(me.spinnerStep) || me.spinnerStep <= 0) ? (1) : (me.spinnerStep);
            var targetStep = {
                'hours': 3600,
                'minutes': 60,
                'seconds': 1
            };
            me.spinnerStep = targetStep[me.spinnerTarget] * me.spinnerStep;

            me.regexText = me.regexText || me.invalidText + '. Expected format is ' + me.targetFormat;

            if (me.minValue) {
                if (Ext.isNumeric(me.minValue) && parseInt(me.minValue) >= 0) {
                    me.minValue = parseInt(me.minValue);
                } else if (Ext.isString(me.minValue)) {
                    me.minValue = me.rawToValue(me.minValue);
                } else {
                    me.minValue = 0;
                }
            } else {
                me.minValue = 0;
            }

            if (me.maxValue) {
                if (Ext.isNumeric(me.maxValue) && parseInt(me.maxValue) >= 0) {
                    me.maxValue = parseInt(me.maxValue);
                } else if (Ext.isString(me.maxValue)) {
                    me.maxValue = me.rawToValue(me.maxValue);
                } else {
                    me.maxValue = null;
                }
            }

            if (me.value) {
                if (Ext.isNumeric(me.value) && parseInt(me.value) >= 0) {
                    me.value = parseInt(me.value);
                } else if (Ext.isString(me.value)) {
                    me.value = me.rawToValue(me.value);
                } else {
                    me.value = me.minValue;
                }
            } else {
                me.value = me.minValue;
            }

            me.on({
                change: me.alignValue
            });

            me.callParent();
        },

        //checks if the value respects origins and set it to the minValue/maxValue as needed
        alignValue: function () {
            var me = this;
            var val = me.getValue();
            me.setValue(val < me.minValue ? me.minValue : val);
            if (val < me.minValue) {
                me.setValue(me.minValue);
                return;
            }
            if (me.maxValue && val > me.maxValue) {
                me.setValue(me.maxValue);
            }

        },

        onSpinUp: function () {
            var me = this;
            me.setValue(me.getValue() + me.spinnerStep);

        },

        onSpinDown: function () {
            var me = this;
            me.setValue(me.getValue() - me.spinnerStep);
        },

        valueToRaw: function (seconds) {
            var me = this;

            if (Ext.isString(seconds)) {
                if (Ext.isNumeric(seconds)) {
                    seconds = parseInt(seconds); //when setValue('3600')
                } else {
                    seconds = me.rawToValue(seconds); //when setValue('111:22:33')
                }
            } else if (Ext.isNumber(seconds)) {
                seconds = parseInt(seconds) //when setValue(15.5), get only the int part
            } else {
                seconds = me.minValue; //set it to the minValue in all other cases
            }

            switch (me.targetFormat) {
                case 'H':
                    var hours = Math.floor(seconds / 3600);
                    return hours.toString();
                    break;

                case 'H:i':
                    var hours = Math.floor(seconds / 3600);
                    var remainingSeconds = seconds % 3600;
                    var minutes = Math.floor(remainingSeconds / 60);
                    return hours + ':' + Ext.util.Format.leftPad(minutes, 2, '0');
                    break;

                default:
                    var hours = Math.floor(seconds / 3600);
                    var remainingSeconds = seconds % 3600;
                    var minutes = Math.floor(remainingSeconds / 60);
                    var seconds = remainingSeconds % 60;
                    return hours + ':' + Ext.util.Format.leftPad(minutes, 2, '0') + ':' + Ext.util.Format.leftPad(seconds, 2, '0');

            }

        },

        rawToValue: function (rawValue) {
            var me = this;

            var arr = rawValue.split(':');
            var hours = Ext.isEmpty(arr[0]) ? 0 : parseInt(arr[0]) * 3600;

            switch (me.targetFormat) {
                case 'H':
                    return hours;
                    break;

                case 'H:i':
                    var minutes = Ext.isEmpty(arr[1]) ? 0 : parseInt(arr[1].substr(0, 2)) * 60;
                    return hours + minutes;
                    break;

                default:
                    var minutes = Ext.isEmpty(arr[1]) ? 0 : parseInt(arr[1].substr(0, 2)) * 60;
                    var seconds = Ext.isEmpty(arr[2]) ? 0 : parseInt(arr[2].substr(0, 2));
                    return hours + minutes + seconds;

            }

        },

        //based on the 'submitSeconds' config - submits either seconds or the formatted string
        getSubmitValue: function () {
            var me = this;
            return me.submitSeconds ? me.getValue() : me.getRawValue();
        }

    });
});
