angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    
  

      .state('tabsController.unicorns', {
    url: '/unicorns',
    views: {
      'tab1': {
        templateUrl: 'templates/unicorns.html',
        controller: 'unicornsCtrl'
      }
    }
  })

  .state('tabsController.trending', {
    url: '/trending',
    views: {
      'tab2': {
        templateUrl: 'templates/trending.html',
        controller: 'unicornsCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

$urlRouterProvider.otherwise('/page1/unicorns')

  

});