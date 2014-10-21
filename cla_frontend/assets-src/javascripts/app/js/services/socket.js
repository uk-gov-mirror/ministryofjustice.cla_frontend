/* jshint unused: false */
(function(){
  'use strict';

  angular.module('cla.services')
    .factory('cla.bus', ['postal', '$rootScope', '_', 'appUtils', function (postal, $rootScope, _, appUtils) {

      function init(user) {
        // io is global reference to socket.io
        var host = $('head').data('socketioServer');
        host = host.replace(/^https?:/, window.location.protocol);
        var socket = io.connect(host);

        // USER IDENTIFICATION

        socket.on('connect', function() {
          socket.emit('identify', {
            'username': user.username,
            'usertype': appUtils.appName,
            'appVersion': appUtils.getVersion()
          });
        });

        // VIEWING CASE

        postal.subscribe({
          channel: 'system',
          topic: 'case.startViewing',
          callback: function(data) {
            socket.emit('startViewingCase', data.reference);
          }
        });

        postal.subscribe({
          channel: 'system',
          topic: 'case.stopViewing',
          callback: function(data) {
            socket.emit('stopViewingCase', data.reference);
          }
        });

        socket.on('peopleViewing', function(data) {
          $rootScope.peopleViewingCase = _.without(data, $rootScope.user.username);
          $rootScope.$apply();
          // console.log('got people viewing case: '+$rootScope.peopleViewingCase);
        });
      }

      return {
        install: function() {

          postal.subscribe({
            channel: 'system',
            topic: 'user.identified',
            callback: function(user) {
              init(user);
            }
          });

        }
      };
    }]);
})();
