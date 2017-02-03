;(function (define) {
    'use strict';
    define([
        'gettext', 'jquery', 'underscore', 'backbone', 'js/views/fields_custom',
        'text!templates/student_profile/profile_post.underscore',
        'backbone-super'
    ], function (gettext, $, _, Backbone, FieldViews, profile_post_template) {

        var ProfilePostView = FieldViews.FieldView.extend({
            className: function () {
                return 'mentor-section-information';
            },
            fieldType: 'post',
            fieldTemplate: profile_post_template,

            initialize: function (options) {
                this._super(options);
                _.bindAll(this, 'render');
            },

            render: function () {
                var postView = this.template({
                    title: this.options.title,
                    imgTitle: this.options.imgTitle,
                    posts: this.options.data
                });
                this.$el.html(postView);
                this.delegateEvents();
                return this;
            },

        });

        return ProfilePostView;
    });
}).call(this, define || RequireJS.define);