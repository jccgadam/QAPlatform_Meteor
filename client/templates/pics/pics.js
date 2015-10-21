Template.home.onRendered(function(){
  $('body').css('heigh',700);
})
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
      return  this.path;
    } else return 'file_icon.png';
  }
});

Template['uploadedInfo'].events({
  'click [data-action="showConfirm"]': function(e, t) {
    var id=this._id;
    console.log('delete')
    IonPopup.confirm({
      title: 'Are you sure?',
      template: 'Remove this picture?',
      onOk: function() {
        Meteor.call('deleteFile', id);
        var pics = SessionAmplify.get('pics')
        var index =-1;
        for(var i=0;i<pics.length;i++)
          {
            if(pics[i].id===id)
            {
              index = i;
            }
          }
        if (index > -1) {
         pics.splice(index, 1);
        }
        SessionAmplify.set('pics',pics);
      },
      onCancel: function() {
       
      }
   })
   },
  }) 

//   var id = this._id;
//     bootbox.confirm('Are you sure?',function(result) {
//       if(result==true)
//       {
//         Meteor.call('deleteFile', id);
//         var pics = SessionAmplify.get('pics')
//         var index = pics.indexOf(id);
//         if (index > -1) {
//          pics.splice(index, 1);
//         }
//         SessionAmplify.set('pics',pics);
//       }
//     })
//   } 
// })