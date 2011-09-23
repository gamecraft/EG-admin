/**
 * Format function that replace placeholders in strings with values
 * Usage : "This is {0} formatted {1}".format("a", "string");
 **/
String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

String.prototype.removeWhiteSpace = function() {
  return this.replace(/\s/g, "");
};