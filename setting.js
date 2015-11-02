Meteor.startup(function() {
if(Meteor.isServer) {
var constructedCsp = BrowserPolicy.content._constructCsp();
BrowserPolicy.content.setPolicy(constructedCsp +" media-src blob:;");
BrowserPolicy.content.allowOriginForAll('http://meteor.local');
BrowserPolicy.content.allowImageOrigin('http://meteor.local');
BrowserPolicy.content.allowImageOrigin('http://localhost');
BrowserPolicy.content.allowImageOrigin('http://54.191.134.26:3000/');


}
});