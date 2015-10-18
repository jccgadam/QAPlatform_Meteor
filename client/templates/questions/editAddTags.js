Template.editAddTags.onRendered(function(){
   
  $('body').css('height',700);

})

Template.editAddTags.helpers({
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
   editAddTags:function(){
   	console.log(Session.get('checkedTags'));
   	return Session.get('checkedTags');
   },
   uncheckedTags:function(){
   	var checkedTags = [];
   	_.each(Session.get('checkedTags'),function(k,v){
   	 
          checkedTags.push(parseInt(k.cId));                 
   	})
  
   	var uncheckedTags = [];
   	var tmpTags = Session.get('questionTmpTags');
   	
      for (var j=0;j<tmpTags.length;j++)
      {  
      	//console.log(checkedTags.indexOf(tmpTags[j].cName));
      	if(!(checkedTags.indexOf(tmpTags[j].cId)>-1))
	      	{
               uncheckedTags.push(tmpTags[j])
	      	}
      }
   
      return uncheckedTags;
	   	
   
    },
    tagsError:function(){
    	return Session.get('tagsError');
    }

})

Template.editAddTags.events({
	'click .submitEditTags':function(e,t){
    	e.preventDefault();
    	var tmpArray = [];
    	t.$("input:checked").each(function(k,v) {
             tmpArray.push({'cName':v.name,'cId':v.value});
          });
    	
    	if(tmpArray.length!=0)
    	{
    		Session.set('checkedTags',tmpArray);
    		Router.go('/questionsPost');
    	}
    	else
    	{
    		Session.set('tagsError','Please select at least one tag');
    	}
    },
    'change .tagCheck':function(e,t){
        e.preventDefault();
        console.log(e.target);
        if(typeof Session.set('tagsError')!='undefined'&&Session.get('checkedTags').length>0)
        {
        	Session.set('tagsError',null);
        }
    }
})