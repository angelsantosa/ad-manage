define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.modal',
  // Using the Require.js text! plugin, we are loaded raw text
  // which will be used as our views primary template
  // 'text!../templates/index/_login_modal.html'
], function($, _, Backbone){

    var AccountModel = Backbone.Model.extend({
        // These should be the same length limits enforced by the server
        EMAIL_MIN_LENGTH: 3,
        EMAIL_MAX_LENGTH: 254,
        PASSWORD_MIN_LENGTH: 2,
        PASSWORD_MAX_LENGTH: 75,

        // This is the same regex used to validate email addresses in Django 1.4
        EMAIL_REGEX: new RegExp(
            "(^[-!#$%&'*+/=?^_`{}|~0-9A-Z]+(\\.[-!#$%&'*+/=?^_`{}|~0-9A-Z]+)*" +
            '|^"([\\001-\\010\\013\\014\\016-\\037!#-\\[\\]-\\177]|\\\\[\\001-\\011\\013\\014\\016-\\177])*"' +
            ')@((?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\\.)+[A-Z]{2,6}\\.?$)' +
            '|\\[(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)(\\.(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)){3}\\]$',
            'i'
        ),

        defaults: {
            email: '',
            password: ''
        },

        urlRoot: 'email',

        sync: function(method, model) {
            var headers = {
                'X-CSRFToken': $.cookie('csrftoken')
            };

            $.ajax({
                url: model.urlRoot,
                type: 'POST',
                data: model.attributes,
                headers: headers
            })
            .done(function() {
                model.trigger('sync');
            })
            .fail(function() {
                var error = gettext("The data could not be saved.");
                model.trigger('error', error);
            });
        },

        validate: function(attrs) {
            var errors = {};

            if (attrs.email.length < this.EMAIL_MIN_LENGTH ||
                attrs.email.length > this.EMAIL_MAX_LENGTH ||
                !this.EMAIL_REGEX.test(attrs.email)
            ) { errors.email = gettext("Please enter a valid email address"); }

            if (attrs.password.length < this.PASSWORD_MIN_LENGTH || attrs.password.length > this.PASSWORD_MAX_LENGTH) {
                errors.password = gettext("Please enter a valid password");
            }

            if (!$.isEmptyObject(errors)) {
                return errors;
            }
        }
    });

    return AccountModel;
});
