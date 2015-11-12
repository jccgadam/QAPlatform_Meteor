Template.test.events({
   'click .takePic':function(e,t){
   	var cameraOptions = {
            width: 400,
            height: 300
        };
   	// var option = {width:'200px',height:'300px'}
   	MeteorCamera.getPicture(function(err,res){
      if(res)
      { 
      	Meteor.call('addImage','123',res,function(err,res){
      		if(error){
      			alert('Duplicate Image Upload');
      		}
      	});
      }
      else{
      	console.log(err)
      	alert(err);
      }
   	})
   }
})