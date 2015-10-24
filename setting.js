Meteor.startup(function() {
if(Meteor.isServer) {

BrowserPolicy.content.allowOriginForAll("http://meteor.local");
BrowserPolicy.content.allowImageOrigin('*');
}
});