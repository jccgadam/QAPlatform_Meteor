//Tasks = new Mongo.Collection("tasks");
//
//if (Meteor.isClient) {
//  // This code only runs on the client
//  Template.body.helpers({
//    questions: function () {
////      if (Session.get("hideCompleted")) {
////         // If hide completed is checked, filter tasks
////         return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
////      } else {
////         // Otherwise, return all of the tasks
////         return Tasks.find({}, {sort: {createdAt: -1}});
////      }
//
//        HTTP.get("http://localhost:9000/questions",
//           //server response
//           function (error, response) {
//              if (error) {
//                 console.log(error);
//                 Session.set('message','Email not exist or wrong password')
//                 return "";
//              }
//              else{
//                console.log(response);
//                return response;
//              }
//           })
//    },
//
//    incompleteCount: function () {
//        return Tasks.find({checked: {$ne: true}}).count();
//    },
//
//    hideCompleted: function(){
//        return Session.get("hideCompleted");
//    }
//  });
//
//  Template.body.events({
//      "submit .new-task": function (event) {
//        // Prevent default browser form submit
//        event.preventDefault();
//
//        // Get value from form element
//        var text = event.target.text.value;
//
//        // Insert a task into the collection
//        Tasks.insert({
//          text: text,
//          createdAt: new Date() // current time
//        });
//
//        // Clear form
//        event.target.text.value = "";
//      },
//
//      "change .hide-completed input": function (event) {
//          Session.set("hideCompleted", event.target.checked);
//      }
//  });
//
//  Template.task.events({
//      "click .toggle-checked": function () {
//          // Set the checked property to the opposite of its current value
//          Tasks.update(this._id, {
//              $set: {checked: ! this.checked}
//          });
//      },
//      "click .delete": function () {
//          Tasks.remove(this._id);
//      }
//  });
//
//  Accounts.ui.config({
//      passwordSignupFields: "USERNAME_ONLY"
//  });
//}

//if (Meteor.isClient) {
//  // This code only runs on the client
//  Template.body.helpers({
//    questions: [
//      { name: "Question1", credit: "1", isOpen: true},
//      { name: "Question2", credit: "2", isOpen: false},
//      { name: "Question3", credit: "3", isOpen: false}
//    ]
//  });
//}

Template.questions.helpers({
    questions: function(){
        return Session.get("tmpResult");
    }
});

HTTP.get("http://52.89.233.213:9000/questions", function (error, response) {
    if (error) {
        Template.questions.helpers({
            questions: ""
        });
    }
    else{
        obj = JSON.parse(response.content);
        Session.set("questions", obj);
        Session.set("tmpResult", obj.results);
    }
});

Template.questions.events({
    'click .item': function (event) {
    console.log(event.target.id);
        if(Number(event.target.id) >= 1){
            for(i = 0; i < Session.get("questions").results.length; i ++){
                if(Session.get("questions").results[i].qId.toString() === event.target.id){
                    Session.set("question", Session.get("questions").results[i]);
                    break;
                }
            }
            Template.questionDetail.helpers({
                q : Session.get("question").title
            });
            Router.go("questionDetail");
        } else if(event.target.id == "searchField"){

        } else if(event.target.id == "searchButton" && document.getElementById("searchField").value != ""){
            var input = document.getElementById("searchField").value;
            var tmp = [];
            for(i = 0; i < Session.get("questions").results.length; i ++){
                if(Session.get("questions").results[i].title.toString().indexOf(input) > -1){
                    console.log("Find question!");
                    tmp.push(Session.get("questions").results[i]);
                }
            }
            Session.set("tmpResult", tmp);
        }
    },

    'keyup .item' : function(event){
        if(event.target.id == "searchField"){
            if(document.getElementById("searchField").value == ""){
                Session.set("tmpResult", Session.get("questions").results);
            }
        }
    }
})

