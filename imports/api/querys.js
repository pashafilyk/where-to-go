import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Querys = new Mongo.Collection('querys');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('querys', function(){
  	if (this.userId) {
    	return Querys.find({owner: this.userId, deleted: false});	
  	}
    return this.ready();
  });
}

Meteor.methods({

	'querys.insert'(text){
	  
	  check(text, String);

	  if(! this.userId){
	  	throw new Meteor.Error('not-authorized');
	  }

	  Querys.insert({
        text,
        createdAt: new Date(),
        owner: this.userId,
        deleted: false,
      });
	},
  'querys.delete'(){
    if(! this.userId){
      throw new Meteor.Error('not-authorized');
    }

    Querys.update({ owner: this.userId }, { $set: { deleted: true } }, { multi: true });
  }

});