Template.editUserTags.helpers({
	checkedTags:function(){
		var searchTagsField = Session.get('searchTagsField');
                if(searchTagsField==null)
                	{
                		return UserTags.find({'checked':'1'}).fetch();
                	}
        		else
        		    {
                        return UserTags.find({'checked':'1',"cName":{$regex : ".*"+searchTagsField+".*"}});
        			}
	},
	uncheckedTags:function(){
		var searchTagsField = Session.get('searchTagsField');
                if(searchTagsField==null)
                	{
                		return UserTags.find({'checked':'0'}).fetch();
                	}
        		else{
                      return UserTags.find({'checked':'0',"cName":{$regex : ".*"+searchTagsField+".*"}});
        			}
	},
	tagsError:function(){
		return Session.get('tagsError');
	},
	uId:function(){
		return SessionAmplify.get('loginUser').uId
	}
})

Template.editUserTags.events({
     'click .button-clear':function(e,t){
        e.preventDefault();
        document.getElementById("searchTagsField").value ='';
        Session.set("searchTagsField", null);

        },
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

	'change .tagCheck':function(e,t){
        e.preventDefault();
        Session.set('tagsError',null);
        var checkedTag = parseInt(e.target.value);
        var checked = UserTags.findOne({'cId':checkedTag}).checked;
        if(checked =='0')
        {
        	UserTags.update({'cId':checkedTag},{$set:{'checked':'1'}});       	
        }
        else if(checked=='1')
        {
        	UserTags.update({'cId':checkedTag},{$set:{'checked':'0'}});
        }
    },
    'click .saveTags':function(e,t){
    	e.preventDefault();
    	var uId = SessionAmplify.get('loginUser').data.uId;
    	var cIds = UserTags.find({'checked':'1'},{fields:{cId:1}}).fetch();
        var url = "http://52.34.229.35:9000/users/"+uId;
        var res = [];
        if(cIds.length===0)
	        {   
	        	Session.set('tagsError','Please at least select one tag');
	        	return false;
	        }
        _.each(cIds,function(k,v){
            res.push(k.cId);  
        })
    	HTTP.put(url, 
    	{
    	data:{
         cIds:res
    	}
        },
    	function (error, response) {
        if (error) {

           console.log(error)

        }
        else{
        	Router.go('/userProfile')

        }

    })
    }
})