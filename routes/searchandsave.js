var request = require('request')
var fs = require('fs')
var express = require('express')
var router = express.Router();

var dbSaveImages = require('..//models/saveImages')

var Scraper = require('images-scraper'),
    google = new Scraper.Yahoo();
//New comment    git status
/**
 * API for sending the requeust to google and saving the image on local drive 
 * and then saving the file path on the mongodb. 
 */

router.route('/query').post(function(req, res) {
    console.log("inside post api");
    console.log(req.body);
    if (req.body.query ) {
        var queryString = req.body.query.toLowerCase()
        google.list({
            keyword: queryString,
            num: 15,
            detail: true,
            nightmare: {
                show: false
            }
        })
            .then(function(queryres) {
                if (!fs.existsSync(queryString)) {
                    fs.mkdirSync(queryString)
                    var dbImage = new dbSaveImages({
                        keyword: queryString
                    })
                    dbImage.save(function(err, data) {
                        if (err) {
                            res.json({
                                status: false,
                                msg: 'Database error'
                            })
                        } else {
                            console.log(queryres)
                            var urlarr = []
                            for (var i = 0; i < queryres.length; i++) {
                                console.log("In loop")

                                request(queryres[i].url).pipe(fs.createWriteStream('./' + queryString + '/' + queryString + i + '.png'))
                                console.log("File saved")
                                var urlString = './' + queryString + '/' + queryString + i + '.png';
                                urlarr.push(urlString)
                                console.log(urlarr)
                            }
                            dbSaveImages.findByIdAndUpdate({
                                _id: data._id
                            }, {
                                $set: { 'imagepath': urlarr }
                            }, function(err, resData) {
                                if (err) {
                                    res.json({
                                        status: false,
                                        msg: 'Databse error'

                                    })
                                } else {
                                    console.log(resData)
                                    res.json({
                                        status: true,
                                        msg: 'Data saved'
                                    })
                                }
                            })

                        }
                    })


                } else {
                    res.json({
                        status: false,
                        msg: 'Query String already stored'
                    })
                }



            })
            .catch(function(err) { console.log('err', err); });
    } else {
        res.json({
            status: false,
            msg: 'Data not sent'
        })
    }
})

//---------------------------------------------------------------------------------------------
.get(function(req, res) {
    console.log("in get api ");
    dbSaveImages.find().then((result)=>{
        res.json({"message":"succesful","result":result})
    },(err)=>{
        res.json({"message":"succesful","err":err});
    })
    // res.end("in get api")
});


module.exports = router;