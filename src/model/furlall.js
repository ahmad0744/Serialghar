const mongoose = require('mongoose');

const moviescema =new mongoose.Schema({
    type: {
        type: String
    },
    url: {
        type: String
    }
});


module.exports = mongoose.model('ezoicurls',moviescema);