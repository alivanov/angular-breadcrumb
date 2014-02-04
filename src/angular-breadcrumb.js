angular.module('ncy-angular-breadcrumb', ['ui.router.state'])
    .provider('$breadcrumb', function() {

        var options = {};

        this.setPrefixState = function(prefixStateName) {
            options.prefixStateName = prefixStateName;
        };

        var _pushNonexistentState = function(array, state) {
            var stateAlreadyInArray = false;
            angular.forEach(array, function(value) {
                if(!stateAlreadyInArray && angular.equals(value, state)) {
                    stateAlreadyInArray = true;
                }
            });
            if(!stateAlreadyInArray) {
                array.push(state);
            }
            return stateAlreadyInArray;
        };

        this.$get = ['$state', function($state) {

            return {
                getStatesChain : function() {
                    var chain = [];

                    // Prefix state
                    if(options.prefixStateName) {
                        var prefixState = $state.get(options.prefixStateName);
                        if(prefixState) {
                            _pushNonexistentState(chain, prefixState);
                        } else {
                            throw 'Bad configuration : prefixState "' + options.prefixStateName + '" unknown';
                        }
                    }

                    angular.forEach($state.$current.path, function(value) {
                        _pushNonexistentState(chain, value.self);
                    });

                    return chain;
                }
            };
        }];

    })
    .directive('ncyBreadcrumb', function($state, $breadcrumb) {

        var getBreadcrumbString = function (breadcrumb) {
            if(typeof breadcrumb === 'function') {
                return breadcrumb($state.params);
            } else {
                return breadcrumb;
            }
        };

        var getBreadcrumbSeparator = function (separator) {
            if(typeof separator === 'undefined') {
                return ' / ';
            } else {
                return separator;
            }
        };

        return function(scope, element) {
            var handler = function() {
                var chain = $breadcrumb.getStatesChain();
                var breadcrumbHTML = "";
                var stateObj = {};
                var breadcrumbSeparator;

                for (var i = 0; i < chain.length ; i++) {
                    stateObj = chain[i];

                    if (!stateObj.data) {
                        stateObj.breadcrumbString = stateObj.name;
                        breadcrumbSeparator = ' / ';
                    } else {
                        stateObj.breadcrumbString = getBreadcrumbString(stateObj.data.breadcrumbLabel);
                        breadcrumbSeparator = getBreadcrumbSeparator(stateObj.data.separator);
                    }

                    if (i === chain.length-1) {
                        breadcrumbHTML += '<span>' + stateObj.breadcrumbString + '</span>';
                    } else {
                        breadcrumbHTML += '<a href="#!' + stateObj.url + '">' + stateObj.breadcrumbString + '</a><span> ' + breadcrumbSeparator  + ' </span>';
                    }
                }
                element.html(breadcrumbHTML);
            };
            scope.$watch(function() { return $state.current; }, handler, true);
            scope.$watch(function() { return $state.params; }, handler, true);
        };
    });
