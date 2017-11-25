 
 const mongoose = require('mongoose');
 const Schema = mongoose.Schema;

 var imageSearch = new Schema({
    keyword :{
        type :String,
        unique:true
    },
    imagepath:[{type : String}]
});

var imageResults = mongoose.model('imageResult', imageSearch);

module.exports=imageResults;

