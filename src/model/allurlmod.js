const mongoose = require('mongoose');

const datascema =new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    url: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    views: {
        type: String,
        require: true
    },
    tag: {
        type: String,
        require: true
    },
    cat: {
        type: String,
        require: true
    },
    downlink: {
        type: Object,
        require: true
    }
},
{ timestamps: true });


module.exports = mongoose.model('aserialghars',datascema);
