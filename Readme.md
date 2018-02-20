
Hours form field for Sencha ExtJS
-------------------------------------


**Source at GitHub**

[https://github.com/wencywww/Ext.ux.form.field.Hours](https://github.com/wencywww/Ext.ux.form.field.Hours)



**Demos**

[Sencha's Fiddle: https://fiddle.sencha.com/#fiddle/2daf](https://fiddle.sencha.com/#fiddle/2daf)




**Features:**

  * Extends the Sencha's ExtJS Ext.form.field.Spinner class to provide a newform field suitable for displaying a quantity of hours. 
  * Registers the 'hoursfield' xtype
  * Can be used in forms for setting of a threshold values for hours, for example in an application which manipulates working time.
  * minValue / maxValue configs can be used to restrict the valid values
  * targetFormat config for tuning the value displayed/submitted
  * submitSeconds config for submitting the value as number of seconds
  * spinnerTarget/spinnerStep configs for manipulating the desired parts of the value
  * Invalid values are detected and the value is set according to the restrictions/defaults
  * Tested with ExtJS version 4.2.1.883 and up to 6.5.3.57 

    
**Configuration options**

  * All configs are optional, defaults are applied if not provided
  * **value** (number/string) - as number of seconds (or numeric string), or as a formatted string, eg. 600, '600' or '00:10:00'
  * **minValue** (number/string) - as number of seconds or as formatted string, eg. 60, '60' or '00:01:00'. Default is 0, and negative values are not permitted
  * **maxValue** (number/string) - as number of seconds or as formatted string, eg. 6000, '6000' or '01:40:00'. Default is undefined, and negative values are not permitted
  * **targetFormat** (string) - valid values are 'H', 'H:i', 'H:i:s'. Default is 'H:i:s'. Determines how the data is displayed in the field and how it is submitted (if **submitSeconds** is false)
  * **submitSeconds** (boolean) - if true, the number of seconds will be submitted, instead of the formatted text. Default is false (submit '1:00:00', instead of 3600)
  * **spinnerTarget** (string) - available values are 'hours', 'minutes', 'seconds'. Default is 'hours'. Determines which of the hours/minutes/seconds the spinners will change
  * **spinnerStep** (number) - Default is 1. Determines the quantity of the hours/minutes/seconds the spinners will add/subtract according to the spinnerTarget
  * **regexText** (string) can be used to set a custom warning text if the field is invalid. If omitted, the field will show a string consisting of the standard **invalidText** concatenated with '. Expected format is ' + **targetFormat**
  
  
**Usage**

  * Include the `src/HoursField.js` file (Ext must be included prior to this)
  * Instantiate the class, for example `var myHoursField = Ext.create('Ext.ux.form.field.Hours')`, or using the 'hoursfield' xtype
  * Try to change the value either via the spinners or using `myHoursField.setValue(3600))` or `myHoursField.setValue('1:00:00'))` 
  

**List of Changes**

  * **2018-02-20**, initial commit
