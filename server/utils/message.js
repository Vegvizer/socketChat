const moment = require('moment');


var generateMessage = (from, text) =>{
    var date = moment(new Date().getTime());

    return {
        from,
        text,
        createdAt: date.format('h:mm a')
    };
};
var generateLocationMessage = (from, lat, long) =>{
    var date = moment(new Date().getTime());
    return {
        from,
        url: `https://www.google.com/maps?q=${lat},${long}`,
        createdAt: date.format('h:mm a')

    };
};

module.exports= {
    generateMessage,
    generateLocationMessage
}