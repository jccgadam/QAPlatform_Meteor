Template.addTags.onCreated(function(){
    $('body').css('height',700);
})

Template.addTags.events({
	'keyup .searchTagsField' : function(event,template){
		//console.log(Session.get('questionTags'));
        if(event.target.id == "searchTagsField"){
            if(document.getElementById("searchTagsField").value == ""){
                Session.set("searchTagsField",null);
            } else {
                var input = document.getElementById("searchTagsField").value;
                Session.set("searchTagsField", input);
            }
        }
    },
    'click .submitTags':function(e,t){
    	e.preventDefault();
        Session.set('tagsError',null);
    	var tagCount = AllTags.find({'checked':'1'}).count();    	
    	if(tagCount!=0)
    	{
    		Router.go('/questionsPost');
    	}
    	else
    	{
    		Session.set('tagsError','Please select at least one tag');
    	}
    },
    'change .tagCheck':function(e,t){
        e.preventDefault();
        Session.set('tagsError',null);
        var checkedTag = parseInt(e.target.value);
        var checked = AllTags.findOne({'cId':checkedTag}).checked;
        if(checked =='0')
        {
        	AllTags.update({'cId':checkedTag},{$set:{'checked':'1'}});
        	
        }
        else if(checked=='1')
        {
        	AllTags.update({'cId':checkedTag},{$set:{'checked':'0'}});
        	

        }
    },
  
    })

Template.addTags.helpers({
	tags:function(){
        // AllTags.clear();
		HTTP.get("http://54.191.134.26:9000/categories", function (error, response) {
		    if (error) {
		       console.log(error);
		    }
		    else{
		    	if(AllTags.find().fetch().length==0)
		        {
		        	var obj = JSON.parse(response.content).results;
			        
		        _.each(obj,function(k,v){
		        	AllTags.insert({'cName':k.cName,'cId':k.cId,'checked':'0'})
		        })
		        }
		       
		    }
			})
		
        

    },
    checkedTags:function(){
    	var searchTagsField = Session.get('searchTagsField');
        if(searchTagsField==null)
        	{
        		return AllTags.find({'checked':'1'}).fetch();
        	}	
		else
		    {			
                return AllTags.find({'checked':'1',"cName":{$regex : ".*"+searchTagsField+".*"}});			
			}
        
    },
    uncheckedTags:function(){
    	var searchTagsField = Session.get('searchTagsField');
        if(searchTagsField==null)
        	{
        		return AllTags.find({'checked':'0'}).fetch();
        	}	
		else{			
              return AllTags.find({'checked':'0',"cName":{$regex : ".*"+searchTagsField+".*"}});			
			}
        
    },
    tagsError:function(){
    	
    	return Session.get('tagsError');
    }
})