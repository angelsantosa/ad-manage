;(function (define) {
    'use strict';
    define([
        'gettext', 'jquery', 'underscore', 'backbone', 'js/views/fields_custom',
        'text!templates/student_profile/activity_post.underscore',
        'backbone-super'
    ], function (gettext, $, _, Backbone, FieldViews, activity_post_template) {

        var ActivityPostView = FieldViews.FieldView.extend({
            className: function () {
                return 'container-clear activity-section-container';
            },
            fieldType: 'post',
            fieldTemplate: activity_post_template,
            events: {
                'click .public-activity-add-comment-button': 'addComment',
            },

            initialize: function (options) {
                this._super(options);
                _.bindAll(this, 'render', 'addComment');
            },

            render: function () {
                var view = this;
                _.each(view.options.data, function (post) {
                    _.each(post['activities'], function (activity) {
                        var postView = view.template({
                            author: post['author'],
                            has_image: post['author_profile_image']['has_image'],
                            author_profile_image: post['author_profile_image']['image_url_full'],
                            text: activity['text'],
                            title: activity['title'],
                            created_date: view.dateFormatter(activity['created_date']),
                            type: activity['type'],
                            comments: activity['comments'],
                        });
                        view.$el.append(postView);
                    });
                });
                this.delegateEvents();
                return this;
            },

            addComment: function (event) {
                console.log(this.$('.public-activity-add-comment-input').val());
            },

            dateFormatter: function (date) {
                var date_split = date.split("T");
                var fecha = date_split[0];
                var horario = date_split[1].slice(0, -1);
                var fecha_split = fecha.split("-");
                var year = fecha_split[0];
                var month = fecha_split[1];
                var day = fecha_split[2];

                switch(month){
                  case "01":
                    month = "Enero";
                    break;
                  case "02":
                    month = "Febrero";
                    break;
                  case "03":
                    month = "Marzo";
                    break;
                  case "04":
                    month = "Abril";
                    break;
                  case "05":
                    month = "Mayo";
                    break;
                  case "06":
                    month = "Junio";
                    break;
                  case "07":
                    month = "Julio";
                    break;
                  case "08":
                    month = "Agosto";
                    break;
                  case "09":
                    month = "Septiembre";
                    break;
                  case "10":
                    month = "Octubre";
                    break;
                  case "11":
                    month = "Noviembre";
                    break;
                  case "12":
                    month = "Diciembre";
                    break;
                }
                  
                var horario_split = horario.split(":");
                var hour = horario_split[0];
                var minute = horario_split[1];
                var second = horario_split[2];
                var date_formatted = day + " " + month + ", a las " + hour + ":" + minute;
                return date_formatted;
            },
        });

        return ActivityPostView;
    });
}).call(this, define || RequireJS.define);