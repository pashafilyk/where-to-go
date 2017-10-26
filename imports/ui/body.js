import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';
import { Querys } from '../api/querys.js';


import './body.html';


Meteor.startup(function() {
   GoogleMaps.load();
});


Template.map.onCreated(function() {
  const instance = Template.instance();
  instance.markers = []; 
  instance.showHistory = new ReactiveVar();
  instance.venues = new ReactiveVar([]);
  Meteor.subscribe('querys');

  GoogleMaps.ready('map', function(map) {
    instance.map = map;
  });

  instance.find = function($txt) {
    if (!$txt.val().trim()) {
        return;
      }

      const markers = {};
      const params = {
        near: 'Ternopil, Ukraine',
        query: $txt.val().trim(),
      };

      Foursquare.find(params, function(error, result) {
        if (error) {
          console.log(error)
        } else {
          const venues = [];

          result.response.venues.forEach(function(venue) {
            const { lat, lng } = venue.location;

            const marker = new google.maps.Marker({
              animation: google.maps.Animation.DROP,
              position: new google.maps.LatLng(lat, lng),
              map: instance.map.instance,
            });
            
            instance.markers.push(marker);

            venues.push({
              name: venue.name,
              lat,
              lng,
            });  
          });

          instance.venues.set(venues);
          $txt.val('').focus();
        }
      });
  }

});

Template.map.events({
  'keyup #txt'(event, instance) {
    event.preventDefault();
    if (event.which === 13) {
      const $txt = instance.$('#txt');
      instance.find($txt);
      Meteor.call('querys.insert', $txt.val());
    }
  },
  'click .submit'(event, instance) {
    const $txt = instance.$('#txt');
    instance.find($txt);
    Meteor.call('querys.insert', $txt.val());
  },

    'click .clear'(event, instance) { 
      for (var i = 0; i < instance.markers.length; i++) {
        instance.markers[i].setMap(null);
        instance.venues.set(null);
    }
    },
    'click .querys'(event, instance){
    const showHistory = instance.showHistory.get(); 
      instance.showHistory.set(!showHistory);
    },
    'click .deleteHistory'(event, instance){
      Meteor.call('querys.delete');
    }
});


Template.map.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(49.5558900, 25.6055600),
        zoom: 10
      };
    }
  },
  venues() {
    return Template.instance().venues.get();
  },
 history(){
  return Querys.find();
 },
 showHistory(){
  return Template.instance().showHistory.get(); 
 }
});
