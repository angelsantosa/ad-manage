/*
 * echarli
 * 
 * 
 */
;(function (define, undefined) {
    'use strict';
    define([
        'gettext', 'underscore', 'backbone'
    ], function (gettext, _, Backbone) {

        var PublishModel = Backbone.Model.extend({
            idAttribute: 'username',
            defaults: {
                username: '',
                course_name: '',
                minimum_apprentices: null,
                maximum_apprentices: null
            },

            parse : function(response) {
                if (_.isNull(response)) {
                    return {};
                }

                // Currently when a non-staff user A access user B's profile, the only way to tell whether user B's
                // profile is public is to check if the api has returned fields other than the default public fields
                // specified in settings.ACCOUNT_VISIBILITY_CONFIGURATION.
                var responseKeys = _.filter(_.keys(response), function (key) {return key !== 'default_public_account_fields'});
                response.profile_is_public = _.size(_.difference(responseKeys, response.default_public_account_fields)) > 0;

  	            return response;
            },
        });
        return PublishModel;
    });
}).call(this, define || RequireJS.define);
