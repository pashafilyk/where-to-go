import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load();
  });
}

Template.map.onCreated(function() {
  console.log(Template.instance());
  var instance = Template.instance();
  instance.venues = new ReactiveVar([]);
    
  GoogleMaps.ready('map', function(map) {
    var markers = {};
    var params = {};
    
    params.query = 'cafe';
    params.near = 'San Francisco, CA';

    Foursquare.find(params, function(error, result) {
      console.log(result);
      var venues = instance.venues.get();

      result.response.venues.forEach(function(venue){
        const { lat, lng } = venue.location;

        var marker = new google.maps.Marker({
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(lat, lng),
          map: map.instance,
        });
        
        venues.push({
          name: venue.name,
          lat,
          lng,
        });
        
        });

        instance.venues.set(venues);
      });
    });
  });

Template.map.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(37.773972, -122.431297),
        zoom: 10
      };
    }
  },
  venues() {
    console.log(Template.instance())
    return Template.instance().venues.get();
  },
});