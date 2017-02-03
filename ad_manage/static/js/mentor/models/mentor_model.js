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

        var UserMentorModel = Backbone.Model.extend({
            idAttribute: 'username',
            defaults: {
                username: '',
                name: '',
                email: '',
                password: '',
                language: null,
                country: null,
                date_joined: "",
                gender: null,
                goals: "",
                level_of_education: null,
                mailing_address: "",
                year_of_birth: null,
                bio: null,
                language_proficiencies: [],
                requires_parental_consent: true,
                profile_image: null,
                default_public_account_fields: [],
                phone: '',
                educational_name: '',
                work_name: '',
                emergency_contact_name: '',
                emergency_contact_email: '',
                emergency_contact_relationship: '',
                emergency_contact_phone: '',
                state_name: '',
                address_field_one: '',
                address_field_two: '',
                postal_code: '',
                outdoor_number: '',
                internal_number: '',
                receipt_documents: null
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

            hasProfileImage: function () {
                var profile_image = this.get('profile_image');
                return (_.isObject(profile_image) && profile_image['has_image'] === true);
            },

            profileImageUrl: function () {
                return this.get('profile_image')['image_url_large'];
            },

            hasReceiptDocumentProperty: function (property) {
                var receipt_document = this.get('receipt_documents');
                return (_.isObject(receipt_document) && receipt_document[property] === true);
            },

            receiptDocumentUrlProperty: function (property) {
                return this.get('receipt_documents')[property];
            },

            getReceiptDocumentStatusProperty: function (property) {
                return this.get('receipt_documents')[property];
            },

            isAboveMinimumAge: function() {
                var isBirthDefined = !(_.isUndefined(this.get('year_of_birth')) || _.isNull(this.get('year_of_birth')));
                return isBirthDefined && !(this.get("requires_parental_consent"));
            }
        });
        return UserMentorModel;
    });
}).call(this, define || RequireJS.define);
