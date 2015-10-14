Router.configure({
	layoutTemplate:"layout",
	});

Router.route('/login',{name:'userlogin'});
Router.route('/main',{name:'main'})
Router.route('/signup',{name:'usersignup'});