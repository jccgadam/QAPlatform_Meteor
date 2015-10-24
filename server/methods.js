Meteor.methods({
  'deleteFile': function(_id) {
    check(_id, String);
// <<<<<<< HEAD

//     var upload = Uploads.findOne(_id);
//     if (upload == null) {
//       throw new Meteor.Error(404, 'Upload not found'); // maybe some other code
//     }

//     UploadServer.delete(upload.path);
//     Uploads.remove(_id);
// =======

    var upload = Uploads.findOne(_id);
    if (upload == null) {
      throw new Meteor.Error(404, 'Upload not found'); // maybe some other code
    }

    UploadServer.delete(upload.path);
    Uploads.remove(_id);
  },
  'Images':function(uuid){
  	var mysql = Meteor.npmRequire('mysql');
    Future = Npm.require('fibers/future');
    var myFuture = new Future();

        var connection = mysql.createConnection({
            host     : 'uploadimages.cbwgrfnpfxqv.us-west-2.rds.amazonaws.com',
            user     : 'root',
            password : '12345678',
            database : 'images',
        });

       connection.connect();
        connection.query("select * from images where uuid='"+uuid+"';", function(err, rows, fields) {
            if (err)
            {
               myFuture.throw(err)
            }
            else {
               myFuture.return(rows);
            }
        });
         connection.end();
       return myFuture.wait();
  },
  'removeImage':function(uuid){
  	var mysql = Meteor.npmRequire('mysql');
    Future = Npm.require('fibers/future');
    var myFuture = new Future();

        var connection = mysql.createConnection({
            host     : 'uploadimages.cbwgrfnpfxqv.us-west-2.rds.amazonaws.com',
            user     : 'root',
            password : '12345678',
            database : 'images',
        });
       connection.connect();
        connection.query("delete from images where uuid='"+uuid+"';", function(err, rows, fields) {
            if (err)
            {
               myFuture.throw(err)
            }
            else {
               myFuture.return(rows);
            }
        });
         connection.end();
       return myFuture.wait();

// >>>>>>> update questionDetail
  }
})