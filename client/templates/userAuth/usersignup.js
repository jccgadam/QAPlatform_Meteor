  function validateEmail(s){

    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  	if(s=='')
  		{
  			Session.set('validateEmail','cannot be empty');
  			return false;
  		}
    else if (s!=='')
        {
            if(!re.test(s))
            {
            	Session.set('validateEmail',' is not right formated');
            	return false;
            }
            else{
            	return true;
            }
        }
  }

  function validatePw(password){
        if(password.length=='')
        {
        	Session.set('validatePw',' cannot be empty');
        	
        	return false;
        }
        else if(password.length<8)
        {
        	Session.set('validatePw',' at least 8 characters');
        	return false;
        }
        else {

        	return true;
        	
        }
  }
  function validateRePw(rpw,pw){
  	    if(rpw=='')
        {
        	Session.set('validateRePw','re-password cannot be empty');
        	return false;
        }
        else if(pw!=rpw)
        {
        	Session.set('validateRePw',' password does not match');
        	return false
        }
        else{
        	return true;
        }
  }
  function validatefname(fname){
  	     var res = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
         if(fname==='')
        { 
          Session.set('validatefname',' cannot be empty');
          return false;
        }
        else if(fname!='')
        {
          if(!res.test(fname))
          { 
            Session.set('validatefname','can only be characters');
            return false;
          }
          else  
        	{
            return true;
          }
        }
  }
  function validatelname(lname){
  	   var res = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
         if(lname==='')
        { 
          Session.set('validatelname',' cannot be empty');
          return false;
        }
        else if(lname!='')
        {
          if(!res.test(lname))
          { 
            Session.set('validatelname','can only be characters');
            return false;
          }
          else  
          {
            return true;
          }
        }
  }

  Template.usersignup.onCreated(function(){
  	Session.set('validatePw',null);
  	Session.set('validateEmail',null);
  	Session.set('validatefname',null);
  	Session.set('validatelname',null);
  	// this.errors = new ReactiveArray();
    
  })

  Template.usersignup.events({
  	'blur .email':function(e,t){
   
	   Session.set('validateEmail',null);
	   var inputEmail = e.target.value;
	   // console.log(validateEmail(inputEmail));
       return validateEmail(inputEmail);
    },

     'blur .password':function(e,t){
       
        Session.set('validatePw',null);
        var password = e.target.value;
        // console.log(validatePw(password));
        return validatePw(password);
        
     },
     'blur .re-password':function(e,t){

     	Session.set('validateRePw',null);
        var pw = t.$('.password').val();
        var rpw = e.target.value;
        // console.log(validateRePw(pw,rpw));
	    return validateRePw(pw,rpw);
     },
     'blur .fname':function(e,t){
        Session.set('validatefname',null);
        var fname = e.target.value;
        // console.log(validatefname(fname));
        return validatefname(fname);
     },
     'blur .lname':function(e,t){
        Session.set('validatelname',null)
        var lname = e.target.value;
        // console.log(validatelname(lname));
        return validatelname(lname);
        
     },
     'submit form':function(e,t){
     	e.preventDefault();
     	var email = t.$('.email').val();
     	var pw    = t.$('.password').val();
     	var rpw   = t.$('.re-password').val();
     	var fname = t.$('.fname').val();
     	var lname  = t.$('.lname').val();
     	// console.log(validateEmail(email));
     	// console.log(validatePw(pw));
     	// console.log(validateRePw(pw,rpw));
     	// console.log(validatefname(fname));
     	// console.log(validatelname(lname));
        if(!(validateEmail(email)&&validatePw(pw)&&validateRePw(pw,rpw)&&validatefname(fname)&&validatelname(lname)))
           {          
           	 
           	 //console.log(!validateEmail(email)&&validatePw(pw)&&validateRePw(pw,rpw)&&validatefname(fname)&&validatelname(lname))
             return false;
           }
     	HTTP.post("http://52.89.233.213:9000/signup",
          {
            data: {
            	email:email,password:pw,firstName:fname,lastName:lname
                  }
          },
          //server response callback
          function (error, response) {
            if (error) {
              Session.set('message','email duplicates')
                        }
            else{
              Session.set('loginUser','response')
              console.log(response);
              Router.go('main')
              
            }
          })
  	 
     }
 })




  Template.usersignup.helpers({
  	validateEmail:function(){

        return Session.get('validateEmail');
  	    
  	},
  	validatePw:function(){

  		return Session.get('validatePw');
  	},
  	validateRePw:function(){

  		return Session.get('validateRePw');
  	},
  	validatefname:function(){

  		return Session.get('validatefname');
  	},
  	validatelname:function(){

  		return Session.get('validatelname');
  	}
  
  })