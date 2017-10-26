import { Meteor } from 'meteor/meteor';

import '/imports/api/querys.js';


Meteor.startup(() => {
  Foursquare.init({
    id: '1VEV23ZMALJP0E54FOHN2UIKOQSPMKNRY3E4LLCED4DBEBE4',
    secret: 'H4GHGN313IYXYKUZPZUXET4CMJXC5JHD5MNZPDELIB24DVMQ',
    authOnly: false // need auth for using or no?
  });
});

