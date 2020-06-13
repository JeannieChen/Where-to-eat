
var funcObj = {};

funcObj.escapeRegex = function(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


module.exports = funcObj;