Meteor.startup(function() {
  Uploader.finished = function(index, file) {
  	if(typeof SessionAmplify.get('pics')=='undefined'||(SessionAmplify.get('pics')==null))
  	{   
  		pics = [];
  		file.uId = 1;
	    pics.push({'id':Uploads.insert(file),'name':file.name});
	    SessionAmplify.set('pics',pics);
  	}
    else{
    	pics = [];
    	pics =SessionAmplify.get('pics');
    	pics.push({'id':Uploads.insert(file),'name':file.name});
        SessionAmplify.set('pics',pics);
        
    }
  }
});