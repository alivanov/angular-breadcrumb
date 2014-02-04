'use strict'

angular.module('ncy-sample', ['ui.router.state', 'ncy-angular-breadcrumb'])
    .config(function($breadcrumbProvider) {
        $breadcrumbProvider.setPrefixState('home');
    })
  .config(function($stateProvider, $urlRouterProvider) {

    // Some hardcoded data ;
    var rooms = [
      {roomId: 1, roomNumber: 101, type: 'Double'},
      {roomId: 2, roomNumber: 102, type: 'Double'},
      {roomId: 3, roomNumber: 103, type: 'Single'},
      {roomId: 4, roomNumber: 104, type: 'Double'}
    ];

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        data: {
          breadcrumbLabel: 'Home'
        }
      })
      .state('booking', {
        url: '/booking',
        templateUrl: 'views/booking_list.html',
        controller: 'BookingListCtrl',
        data: {
          breadcrumbLabel: 'Reservations'
        }
      })
      .state('room', {
        url: '/room',
        resolve: {
          rooms: function() {
            return {'value': rooms};
          }
        },
        templateUrl: 'views/room_list.html',
        controller: 'RoomListCtrl',
        data: {
          breadcrumbLabel: 'Rooms'
        }
      })
      .state('room.detail', {
        url: '/{roomId}',
        views: {
          "@" : {
            templateUrl: 'views/room_detail.html',
            controller: 'RoomDetailCtrl'
          }
        },
        data: {
          breadcrumbLabel: 'Room TODO'
        }
      })
      .state('room.detail.edit', {
        url: '/edit',
        views: {
          "@" : {
            templateUrl: 'views/room_form.html',
            controller: 'RoomDetailCtrl'
          }
        },
        data: {
          breadcrumbLabel: 'Editing'
        }
      });

    $urlRouterProvider.otherwise('/home');

  });
