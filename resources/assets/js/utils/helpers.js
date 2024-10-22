var helpers = {

    relativeDate: function (date) {
        var moment = require('moment');

        return moment(date).calendar(null, {
            sameDay: '[Today at] h:mm A',
            nextDay: '[Tomorrow at] h:mm A',
            nextWeek: 'dddd [at] h:mm A',
            lastDay: '[Yesterday at] h:mm A',
            lastWeek: '[Last] dddd [at] h:mm A',
            sameElse: 'MMM D [at] h:mm A'
        });

    },
    stripTags: function(string, replace='') {
        return string.replace(/<.+?>/g, replace);
    },
    xmlToJson: function (xml) {

        // Create the return object
        var obj = {};

        if (xml.nodeType == 1) { // element
            // do attributes
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) { // text
            obj = xml.nodeValue;
        }

        // do children
        // If just one text node inside
        if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
            obj = xml.childNodes[0].nodeValue;
        }
        else if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof(obj[nodeName]) == "undefined") {
                    obj[nodeName] = helpers.xmlToJson(item);// TODO NOT DEFINED!!
                } else {
                    if (typeof(obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(helpers.xmlToJson(item));
                }
            }
        }
        return obj;
    },
    isInt: function (value) {
        return !isNaN(value) &&
            parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
    }
};

module.exports = helpers;