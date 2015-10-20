Template['home'].helpers({
  myFormData: function() {
    return { directoryName: 'images', prefix: this._id, _id: this._id }
  },
  filesToUpload: function() {
    return Uploader.info.get();
  }
  
});

Template['uploadedInfo'].helpers({
  src: function() {
    console.log(this)
    if (this.type.indexOf('image') >= 0) {
      return 'upload/' + this.path;
    } else return 'file_icon.png';
  }
});

Template['uploadedInfo'].events({
  'click .deleteUpload':function() {
    if (confirm('Are you sure?')) {
      Meteor.call('deleteFile', this._id);
      var pics = SessionAmplify.get('pics')
      var index = pics.indexOf(this._id);
      if (index > -1) {
       pics.splice(index, 1);
      }
      SessionAmplify.set('pics',pics);
    }
  }
})