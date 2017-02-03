define([
    'gettext', 'jquery', 'underscore', 'backbone', 'logger',
    'bootstrap','iCheck',
    ],
    function(gettext, $, _, Backbone, Logger) {
      var runCustomCheck = function() {
          if ($.fn.iCheck) {
              if ($('input[type="checkbox"]').length || $('input[type="radio"]').length) {
                  $('input[type="checkbox"].grey, input[type="radio"].grey').iCheck({
                      checkboxClass: 'icheckbox_minimal-grey',
                      radioClass: 'iradio_minimal-grey',
                      increaseArea: '10%' // optional
                  });
                  $('input[type="checkbox"].red, input[type="radio"].red').iCheck({
                      checkboxClass: 'icheckbox_minimal-red',
                      radioClass: 'iradio_minimal-red',
                      increaseArea: '10%' // optional
                  });
                  $('input[type="checkbox"].green, input[type="radio"].green').iCheck({
                      checkboxClass: 'icheckbox_minimal-green',
                      radioClass: 'iradio_minimal-green',
                      increaseArea: '10%' // optional
                  });
                  $('input[type="checkbox"].teal, input[type="radio"].teal').iCheck({
                      checkboxClass: 'icheckbox_minimal-aero',
                      radioClass: 'iradio_minimal-aero',
                      increaseArea: '10%' // optional
                  });
                  $('input[type="checkbox"].orange, input[type="radio"].orange').iCheck({
                      checkboxClass: 'icheckbox_minimal-orange',
                      radioClass: 'iradio_minimal-orange',
                      increaseArea: '10%' // optional
                  });
                  $('input[type="checkbox"].purple, input[type="radio"].purple').iCheck({
                      checkboxClass: 'icheckbox_minimal-purple',
                      radioClass: 'iradio_minimal-purple',
                      increaseArea: '10%' // optional
                  });
                  $('input[type="checkbox"].yellow, input[type="radio"].yellow').iCheck({
                      checkboxClass: 'icheckbox_minimal-yellow',
                      radioClass: 'iradio_minimal-yellow',
                      increaseArea: '10%' // optional
                  });
                  $('input[type="checkbox"].square-black, input[type="radio"].square-black').iCheck({
                      checkboxClass: 'icheckbox_square',
                      radioClass: 'iradio_square',
                      increaseArea: '10%' // optional
                  });
                  $('input[type="checkbox"].square-grey, input[type="radio"].square-grey').iCheck({
                      checkboxClass: 'icheckbox_square-grey',
                      radioClass: 'iradio_square-grey',
                      increaseArea: '10%' // optional
                  });
                  $('input[type="checkbox"].square-red, input[type="radio"].square-red').iCheck({
                      checkboxClass: 'icheckbox_square-red',
                      radioClass: 'iradio_square-red',
                      increaseArea: '10%' // optional
                  });
                  $('input[type="checkbox"].square-green, input[type="radio"].square-green').iCheck({
                      checkboxClass: 'icheckbox_square-green',
                      radioClass: 'iradio_square-green',
                      increaseArea: '10%' // optional
                  });
                  $('input[type="checkbox"].square-teal, input[type="radio"].square-teal').iCheck({
                      checkboxClass: 'icheckbox_square-aero',
                      radioClass: 'iradio_square-aero',
                      increaseArea: '10%' // optional
                  });
                  $('input[type="checkbox"].square-orange, input[type="radio"].square-orange').iCheck({
                      checkboxClass: 'icheckbox_square-orange',
                      radioClass: 'iradio_square-orange',
                      increaseArea: '10%' // optional
                  });
                  $('input[type="checkbox"].square-purple, input[type="radio"].square-purple').iCheck({
                      checkboxClass: 'icheckbox_square-purple',
                      radioClass: 'iradio_square-purple',
                      increaseArea: '10%' // optional
                  });
                  $('input[type="checkbox"].square-yellow, input[type="radio"].square-yellow').iCheck({
                      checkboxClass: 'icheckbox_square-yellow',
                      radioClass: 'iradio_square-yellow',
                      increaseArea: '10%' // optional
                  });
                  $('input[type="checkbox"].flat-black, input[type="radio"].flat-black').iCheck({
                      checkboxClass: 'icheckbox_flat',
                      radioClass: 'iradio_flat',
                      increaseArea: '10%' // optional
                  });
                  $('input[type="checkbox"].flat-grey, input[type="radio"].flat-grey').iCheck({
                      checkboxClass: 'icheckbox_flat-grey',
                      radioClass: 'iradio_flat-grey',
                      increaseArea: '10%' // optional
                  });
                  $('input[type="checkbox"].flat-red, input[type="radio"].flat-red').iCheck({
                      checkboxClass: 'icheckbox_flat-red',
                      radioClass: 'iradio_flat-red',
                      increaseArea: '10%' // optional
                  });
                  $('input[type="checkbox"].flat-green, input[type="radio"].flat-green').iCheck({
                      checkboxClass: 'icheckbox_flat-green',
                      radioClass: 'iradio_flat-green',
                      increaseArea: '10%' // optional
                  });
                  $('input[type="checkbox"].flat-teal, input[type="radio"].flat-teal').iCheck({
                      checkboxClass: 'icheckbox_flat-aero',
                      radioClass: 'iradio_flat-aero',
                      increaseArea: '10%' // optional
                  });
                  $('input[type="checkbox"].flat-orange, input[type="radio"].flat-orange').iCheck({
                      checkboxClass: 'icheckbox_flat-orange',
                      radioClass: 'iradio_flat-orange',
                      increaseArea: '10%' // optional
                  });
                  $('input[type="checkbox"].flat-purple, input[type="radio"].flat-purple').iCheck({
                      checkboxClass: 'icheckbox_flat-purple',
                      radioClass: 'iradio_flat-purple',
                      increaseArea: '10%' // optional
                  });
                  $('input[type="checkbox"].flat-yellow, input[type="radio"].flat-yellow').iCheck({
                      checkboxClass: 'icheckbox_flat-yellow',
                      radioClass: 'iradio_flat-yellow',
                      increaseArea: '10%' // optional
                  });
              };
          }
      };
    return runCustomCheck;

});
