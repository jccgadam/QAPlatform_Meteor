Template.addTags.onCreated(function(){
    $('body').css('height',700);
})

Template.addTags.events({
	'keyup .searchTagsField' : function(event,template){
		//console.log(Session.get('questionTags'));
        if(event.target.id == "searchTagsField"){
            if(document.getElementById("searchTagsField").value == ""){
                Session.set("questionTags", Session.get("questionTmpTags"));
            } else {
                var input = document.getElementById("searchTagsField").value;
                var tmp = [];
                
                for(i = 0; i < Session.get("questionTmpTags").length; i ++){
                    if(Session.get("questionTmpTags")[i].cName.toString().indexOf(input) > -1)
                    {
                    	
                        tmp.push(Session.get("questionTmpTags")[i]);
                    }
                }
                Session.set("questionTags", tmp);
            }
        }
    },
    'click .submitTags':function(e,t){
    	e.preventDefault();
    	t.$('input[type="checkbox"]').checked(function(data){
           console.log(data.value);
    	})
    }
})

Template.addTags.helpers({
	tags:function(){

		HTTP.get("http://52.89.233.213:9000/categories", function (error, response) {
		    if (error) {
		       console.log(error);
		    }
		    else{
		        var obj = JSON.parse(response.content);
		        var arr =[];
		        _.each(obj,function(k,v){
		        	arr.push({'cName':JSON.parse(k).cName,'cId':JSON.parse(k).cId})
		        })
		            Session.set('questionTmpTags',arr)
		        if(typeof Session.get('questionTags')=='undefined'){
		        	
		        	Session.set('questionTags',arr);
		        }
		    }
			})
		
		if((Session.get('questionTags').length==Session.get('questionTmpTags').length))
		{
			return Session.get('questionTmpTags')
		}  
		return Session.get('questionTags');
    }
})