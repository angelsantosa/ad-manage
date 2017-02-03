define([
  'jquery',
  'underscore',
  'backbone',
  'account/views/login',
  'account/views/signup'
], function($, _, Backbone, LoginModal, SignupModal){
    console.log(SignupModal);
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      '': 'home',
      'login': 'login',
      'signup': 'signup',

      // Default
      '*actions': 'defaultAction'
    }
  });

  var initialize = function(){
    var app_router = new AppRouter;
    app_router.on('route:login', function(){
      var loginModal = new LoginModal();
      $('.login-modal').html(loginModal.render().el);
    });

    app_router.on('route:signup', function(){
      var signupModal = new SignupModal();
      $('.signup-modal').html(signupModal.render().el);
    });

    app_router.on('defaultAction', function(actions){
      // We have no matching route, lets just log what the URL was
      console.log('No route:', actions);
    });
    Backbone.history.start();

    $.ajaxSetup({
      statusCode: {
          401: function(){
              // Redirec the to the login page.
              window.location.replace('/#/login');

          },
          403: function() {
              // 403 -- Access denied
              window.location.replace('/#/denied');
          }
      }
    });
  };
  return {
    initialize: initialize
  };
});
