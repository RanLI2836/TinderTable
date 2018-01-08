'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
// const moment = require('moment');
const fileType = require('file-type');
const sha1 = require('sha1');
const unixTime = require('unix-time');
AWS.config.update({region: 'us-east-1'});
// let MongoClient = require('mongodb').MongoClient;
// let mongodb = require('mongodb').Db;
var MongoClient = require('mongodb').MongoClient;

function storeUserInfo(event){
    var url = 
    console.log("pre-connect");
    MongoClient.connect(url, function(err, client) {
        var db = client.db();
        
        if (err){
            console.log('Err',err);
        }else{
            console.log("Connected correctly to server");
            var myobj = { 
                "_id": event.userId,
                "firstname": event.firstname, 
                "lastname": event.lastname ,
                "phone": event.phone,
                "gender": event.gender,
                "zipcode":event.zipcode,
                "requests":[],
                "invitations":[]
            };
            db.collection("user_info").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                client.close();
            });
        }
    });
}

exports.handler = function(event, context, callback) {
    // console.log(event.photo);
    let accountId = event.userId;
    let base64String = event.photo.split(',')[1];
    storeUserInfo(event);
//     console.log(event);
    console.log(accountId);
    // console.log(base64String);
    let buffer = new Buffer(base64String, 'base64');
    // console.log(buffer);
    let fileMime = fileType(buffer);
    
    // if (fileMime === null) {
    //     return context.fail('The string supplied is not a file type');
    // }
    // let imgId = sha1(accountId);
    let imgId = accountId
    let file = getFile(fileMime, buffer, imgId);
    let params = file.params;
    // let fileName = params.Key;

    s3.putObject(params, function(err, data) {
        if (err) {
            return console.log(err);
        }
        return console.log('File URL', file.uploadFile.full_path);
    });


    // Create the DynamoDB service object
    let ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

    let paramsDB = {
      TableName: 'tinder_user',
      Item: {
        'user_account' : {S: accountId},
        'imageID' : {S: params.Key},
      }
    };

    // Call DynamoDB to add the item to the table
    ddb.putItem(paramsDB, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
      }
    });
    
    // callback(null, "Success!");
    callback(null, { status: 'success', message: 'The user info and photo has been successfully added to the database.' }); 
}

let getFile = function(fileMime, buffer, imgId) {
    let fileExt = fileMime.ext;
    // let imgId = sha1(new Buffer(new Date().toString())); 
    // let imgId = sha1(userAccount);
    // let now = moment().format('YYYY-MM-DD HH:mm:ss');
    // let fileName = unixTime(now) + '.' +fileExt;
    
    // no extension
    let fileName = imgId +'.' +fileExt;
    // let fileName = imgId;
    let filePath = 'your bucket path' + fileName;

    let params = {
        Bucket: '',
        Key: fileName,
        Body: buffer
    }

    let uploadFile = {
        size: buffer.toString('ascii').length,
        type: fileMime.mime,
        name: fileName,
        full_path: filePath,
    }

    return {
        'params': params,
        'uploadFile': uploadFile
    }
}