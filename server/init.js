Meteor.startup(function () {
  // init items collection
Meteor.absoluteUrl.defaultOptions.rootUrl = "http://52.34.229.35:4000";
process.env.ROOT_URL = "http://52.34.229.35:4000";
process.env.MOBILE_ROOT_URL = "http://52.34.229.35:4000";
process.env.MOBILE_DDP_URL = "http://52.34.229.35:4000";

  if(Meteor.isServer) {
    BrowserPolicy.content.allowOriginForAll("http://meteor.local");
  }
  UploadServer.init({
    tmpDir: process.env.PWD + 'client/uploads/tmp',
    uploadDir: process.env.PWD + 'client/uploads/',
    checkCreateDirectories: true,
    // acceptFileTypes:'[^\s]+(\.(?i)(jpg|png|gif|bmp))$',
    getDirectory: function(fileInfo, formData) {
      if (formData && formData.directoryName != null) {
        return formData.directoryName;
      }
      return "";
    },
    getFileName: function(fileInfo, formData) {
      if (formData && formData.prefix != null) {
        return formData.prefix + '_' + fileInfo.name;
      }
      return fileInfo.name;
    },
    finished: function(fileInfo, formData) {
      if (formData && formData._id != null) {
        Items.update({_id: formData._id}, { $push: { uploads: fileInfo }});
      }
    }
  });
});

Push.debug = true;
