;(function (define) {
    'use strict';
    define([
        'gettext', 'jquery', 'underscore', 'backbone', 'js/views/fields_custom',
        'text!templates/fields_custom/field_grid.underscore',
        'backbone-super', 'jquery.mixitup', 'lightbox'
    ], function (gettext, $, _, Backbone, FieldViews, field_grid_template) {

        var GridFieldView = FieldViews.FieldView.extend({
            tagName: 'ul',
            className: function () {
                return 'list-unstyled';
            },
            id: 'Grid',
            fieldType: 'grid',
            fieldTemplate: field_grid_template,

            initialize: function (options) {
                this._super(options);
                _.bindAll(this, 'render', 'loadGrid');
                /*
                 * Invocar funcion loadGrid al hacer el render de la página
                 */
                this.render = _.wrap(this.render, function(render) {
                  render.apply(this);
                  this.loadGrid();
                  return this;
                });
            },

            render: function () {
                var view = this;
                _.each(view.options.data, function (photo) {
                    var photoView = view.template({
                        imageUrl: photo['url'],
                        title: gettext(photo['title']),
                        toolbarVisible: _.result(view, 'toolbarVisible'),
                        titleVisible: _.result(view, 'titleVisible')
                    });
                    view.$el.append(photoView);
                });
                this.delegateEvents();
                return this;
            },

            toolbarVisible: function () {
                return false;
            },

            titleVisible: function () {
                return false;
            },

            loadGrid: function () {
                this.$('#Grid').mixItUp();
                this.$('.portfolio-item .chkbox').bind('click', function () {
                    if ($(this).parent().hasClass('selected')) {
                        $(this).parent().removeClass('selected').children('a').children('img').removeClass('selected');
                    } else {
                        $(this).parent().addClass('selected').children('a').children('img').addClass('selected');
                    }
                });
            },

        });

        return GridFieldView;
    });
}).call(this, define || RequireJS.define);