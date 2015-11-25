Meteor.startup(function() {
if(Meteor.isServer) {
var constructedCsp = BrowserPolicy.content._constructCsp();
BrowserPolicy.content.setPolicy(constructedCsp +" media-src blob:;");
BrowserPolicy.content.allowOriginForAll('http://meteor.local');
BrowserPolicy.content.allowImageOrigin('http://meteor.local');
BrowserPolicy.content.allowImageOrigin('http://localhost');
BrowserPolicy.content.allowImageOrigin('http://52.34.229.35:3000/');


}
});