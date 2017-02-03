define([
    'gettext', 'jquery', 'underscore', 'backbone', 'logger',
    'googlemaps','gmaps',
    'search/views/search_view',
    'search/collections/results_c',
    'search/collections/users_c',
    'search/models/filter_m',
    'search/views/search_fields',
    'search/views/search_results',
    ],

    function(gettext, $, _, Backbone, Logger, googleMaps, GMaps, SearchView,
        ResultsCollection, UsersCollection, FilterModel, FieldViews, ResultsView) {

        return function (fieldsData) {

            /*
            appElement Elemento principal de la app, en edx se llamaba como la aplicacion ejemplo: (searchElement),
            pense en un nombre mas generico para no renombrarlo cuando se use de nuevo :)
            */

            var appElement = $('.main-search');
            var mapElement = '.search-results-map';

            /* TRIGGERED BY LUL SPAM */
            var lulz = 'lul'; // Si se elimina esta variable todo el programa colapsa, se autodestuye y te instala Windows. (a veces te deja un hijo)

            /* courses api y users api tiene que refactorizarse y llamarse desde contexto hacia aqui desde la funcion main */

            var courses_api= 'http://echarli2.dilosung.com/api/_search/course/?page_size=10&page=1';
            var users_api= 'http://echarli2.dilosung.com/api/_search/user/';

            /* Iniciamos nuestros modelos y colections */

            var resultsCollection = new ResultsCollection();
            var usersCollection = new UsersCollection();

            var resultsCollectionM = new ResultsCollection();

            resultsCollectionM.url = courses_api ;
            usersCollection.url = users_api;
            var lat_inicial = 19.344124;
            var lng_inicial = -99.174017;

            /* Modelo para guardar los filtros */



            var filterModel = new FilterModel({ });


            /* La variable de los filtros que se aplicaran a las colections */
                /*

                course_name: 'qwe', //
                location_address: '', //
                date_start: 'qwe', //
                date_end: 'qwe',
                category: 'qwe', //
                course_type: 'qwe',
                course_level: 1, //
                price_program: 'qwe', //
                course_level: 'qwe', //
                number_apprentices: 'qwe',
                language: 'qwes', //

                */
            var sectionsData = [
                {
                    fields_hidden: 1,
                    class: 'class_name',
                        fields: [
                            {
                                el: '.search-input-big',
                                imamap: true,
                                view: new FieldViews.TextFieldTopView({
                                    model: filterModel,
                                    tagName: 'span',
                                    placeholder: gettext("¿Qué quieres aprender?"),
                                    collection: {
                                      usersCollection : usersCollection,
                                      resultsCollection: resultsCollection,
                                    },
                                    course_api: courses_api,
                                    valueAttribute: "course_name", // Importante, nombre con el que se gaurdara y actualizara el filtro
                                    persistChanges: true,
                                    title: gettext("Search for..."),
                                })

                            },

                            {
                                el: '.search-field-location-address',
                                imamap: true,
                                view: new FieldViews.LocationFieldView({
                                    model: filterModel,
                                    placeholder: gettext("Tlacoqumecatl"),
                                    collection: {
                                      usersCollection : usersCollection,
                                      resultsCollection: resultsCollection,
                                    },
                                    course_api: courses_api,
                                    valueAttribute: {
                                      0: "from",
                                      1: "km",
                                    },
                                    km_to_search: 2,
                                    zoom_in_map_change: 14,
                                    // Importante, nombre con el que se gaurdara y actualizara el filtro
                                    persistChanges: true,
                                    title: gettext("Where"),
                                })

                            },

                            {
                                el: '.search-field-date',
                                imamap: true,
                                view: new FieldViews.DateRangeFieldView({
                                    model: filterModel,
                                    placeholder: gettext("10/05/2016"),
                                    collection: {
                                      usersCollection : usersCollection,
                                      resultsCollection: resultsCollection,
                                    },
                                    course_api: courses_api,
                                    valueAttribute: {
                                      0: "date_start__gte",
                                      1: "date_end__lte",
                                    }, // Importante, nombre con el que se gaurdara y actualizara el filtro
                                    persistChanges: true,
                                    title: gettext("Date"),
                                })

                            },

                            {
                                el: '.search-field-categories',
                                imamap: true,
                                view: new FieldViews.RadioCategoriesFieldView({
                                    model: filterModel,
                                    collection: {
                                      usersCollection : usersCollection,
                                      resultsCollection: resultsCollection,
                                    },
                                    aling_inputs: "checkbox-inline",
                                    options: fieldsData.categories.options,
                                    course_api: courses_api,
                                    valueAttribute: 'category_id', // Importante, nombre con el que se gaurdara y actualizara el filtro
                                    persistChanges: true,
                                    title: gettext("Category"),
                                })

                            },

                            {
                                el: '.search-field-course-type',
                                imamap: true,
                                view: new FieldViews.RadioTypeFieldView({
                                    model: filterModel,
                                    collection: {
                                      usersCollection : usersCollection,
                                      resultsCollection: resultsCollection,
                                    },
                                    aling_inputs: "checkbox-inline",
                                    course_api: courses_api,
                                    valueAttribute: 'course_type', // Importante, nombre con el que se gaurdara y actualizara el filtro
                                    persistChanges: true,
                                    title: gettext("Course type"),
                                    options: fieldsData.course_type.options,
                                    iconOptions: ['fa-user','fa-users','fa-desktop','fa-film'],
                                    classOptions: ['course-type-individual', 'course-type-collective', 'course-type-remote', 'course-type-online'],
                                })

                            },

                            {
                                el: '.search-field-price-range',
                                imamap: true,
                                view: new FieldViews.SliderRangeFieldView({
                                    model: filterModel,
                                    collection: {
                                      usersCollection : usersCollection,
                                      resultsCollection: resultsCollection,
                                    },
                                    course_api: courses_api,
                                    valueAttribute: {
                                      0: "price_program__gte",
                                      1: "price_program__lte",
                                      2: "price-range"
                                    }, // Importante, nombre con el que se gaurdara y actualizara el filtro
                                    min: 180,
                                    max: 8000,
                                    persistChanges: true,
                                    title: gettext("Rango de precio"),
                                })

                            },

                        ],
                },

                {
                    fields_hidden: 0,
                    class: 'lol',
                        fields: [
                            {
                                el: '.search-field-difficulty-level',
                                imamap: true,
                                view: new FieldViews.RadioNeutralFieldView({
                                    model: filterModel,
                                    placeholder: gettext("Novato"),
                                    collection: {
                                      usersCollection : usersCollection,
                                      resultsCollection: resultsCollection,
                                    },
                                    aling_inputs: "checkbox-inline",
                                    options: fieldsData.course_level.options,
                                    course_api: courses_api,
                                    valueAttribute: "course_level", // Importante, nombre con el que se gaurdara y actualizara el filtro
                                    persistChanges: true,
                                    title: gettext("Difficulty level"),
                                })

                            },

                            {
                                el: '.search-field-language',
                                imamap: true,
                                view: new FieldViews.RadioNeutralFieldView({
                                    model: filterModel,
                                    placeholder: gettext("Inglés"),
                                    collection: {
                                      usersCollection : usersCollection,
                                      resultsCollection: resultsCollection,
                                    },
                                    aling_inputs: "checkbox-inline",
                                    options: fieldsData.course_language.options,
                                    course_api: courses_api,
                                    valueAttribute: "course_language", // Importante, nombre con el que se gaurdara y actualizara el filtro
                                    persistChanges: true,
                                    title: gettext("Language"),
                                })

                            },
                        ],
                }


            ];
            var searchView = new SearchView({
                el: appElement,
                collection: {
                  usersCollection : usersCollection,
                  resultsCollection: resultsCollectionM,
                },
                sectionsData: sectionsData,
                mapElement: mapElement,
                lat_init: lat_inicial,
                lng_init: lng_inicial,

            });
            searchView.render();
            $.when(

              usersCollection.fetch(),
              resultsCollectionM.fetch()
            ).then(function(){

              searchView.renderFields();

            });

            return {
                filterModel: filterModel,
                usersCollection : usersCollection,
                resultsCollection: resultsCollection,
                searchView: searchView
            };

        };

});
