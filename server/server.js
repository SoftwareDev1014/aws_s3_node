// const functions = require('firebase-functions');
let express = require('express');
const cors = require('cors')
const app = express();
const PORT = 3001;
const server = app.listen(PORT, function () {
    console.log('Server is running on PORT:', PORT);
});
var dicomParser = require('dicom-parser');

const bodyParser = require('body-parser')
const axios = require('axios');
const fileUpload = require('express-fileupload');

app.use(cors())
app.use(fileUpload({
    createParentPath: true
}));

/***********************************coninpayment.net******************************/
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: "500mb", extended: true, parameterLimit: 50000}));
////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////

app.get('/test', function (req, res) {
    res.status(200).send('testing api12');
});

const AWS = require('aws-sdk');
const fs = require('fs');

const ID = 'xxx';
const SECRET = 'xxx';

// The name of the bucket that you have created
const BUCKET_NAME = 'testbucket1014';

let dcmToJson = function (dataSet) {
    let result_json = {}
    let keys = Object.keys(dataSet.elements)
    keys.forEach((key, index) => {
        var institution = dataSet.string('x00080080');
        if (dataSet.elements[key].items == undefined) {
            let temp = dataSet.string(key)
            result_json[key] = temp
        } else {
            let temp_items = dataSet.elements[key].items
            result_json.elememts = []
            temp_items.forEach(item => {
                result_json.elememts.push(dcmToJson(item.dataSet))
            })
        }
    })
    return result_json
}
let readFile = function (path) {
    var dicomFileAsBuffer = fs.readFileSync(path);
    console.log(dicomFileAsBuffer)
    var dataSet = dicomParser.parseDicom(dicomFileAsBuffer);
    let temp_json = dcmToJson(dataSet)
    //  let key_path=getUpperPathByValue(temp_json,'','SRT')
    return temp_json.elememts
}

app.get('/test1', function (req, res) {
    let result=readFile('CT-RDSR-Toshiba_DoseCheck.dcm')
    res.status(200).send({
        result
    });
});

app.post('/fileupload', async function (req, res) {
    let file=req.files.file
    console.log(file.data)
    var dataSet = dicomParser.parseDicom(file.data);
    let temp_json = dcmToJson(dataSet)
    res.status(200).send({
        result:temp_json
    });
    /*const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET
    });
    console.log('file',file)
    //const fileContent = fs.readFileSync(file.name);

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: file.name, // File name you want to save as in S3
        Body: file.data
    };
    let uploaded_url='test'
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully.`,data.Location);
        uploaded_url= data.Location;
        res.status(200).send(data.Location);
    });*/


});
app.get('/readfile', function (req, res) {
    const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET
    });
    const params = {
        Bucket: BUCKET_NAME,
        Key: "androidicon.png", // File name you want to save as in S3
    };
    s3.getObject(params, function (err, data) {

        if (err) {
            console.log(err);
        } else {
            console.log(data.Body.toString()); //this will log data to console
        }

    })
    res.status(200).send('testing api12');
});
