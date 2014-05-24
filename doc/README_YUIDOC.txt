Yuidoc Instructions

1. Make sure all dependencies are installed, yuidoc will be installed along with everything else.

2. In code, write inline documentation in the following manner,

CLASS

/**
* Description of class
*
* @class (Class Name)
* @constructor
*/

METHOD

/**
* Description of method
*
* @method (Method Name)
* @param {String} ex (Description for String ex)
* @param {Object} obj (Description of Object obj)
* @return {Boolean} (Description of return condition)
*/

PROPERTY

/**
* Descriptio of property
* 
* @property propertyName
* @type {Object}
* @default "foo"
*/

--DESCRIPTIONS MAY SPAN MULTIPLE LINES--
--THESE ARE NOT THE ONLY TAGS FOR YUIDOC--

3. Run yuidoc . in the directory of your code

4. In your directory, you will find a new folder name out

5. Inside this folder there is a file index.html, open this with any web browser to view documentation, as well as source code.

6. For more information on yuidoc and all possible tags go to http://yui.github.io/yuidoc/