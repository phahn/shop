var shopApp = angular.module('shopApp', ['ngResource', 'ngCookies' ,'ui.router', 'ui.utils', 'angularLocalStorage', 'mm.foundation']);

/*shopApp.run(function($rootScope, $urlRouter) {
    $rootScope.$on('$locationChangeSuccess', function(evt) {
      // Halt state change from even starting
      evt.preventDefault();

      // we are already logged in
      if ($rootScope.user) {

      }

      console.log("stopping route change");
      // Perform custom logic
      //var meetsRequirement = ...
      // Continue with the update and state transition if logic allows
      if (true) $urlRouter.sync();
    });
  });*/

shopApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	  		  
		  $locationProvider.html5Mode(true);
		   
       // when there is an empty route, redirect to /index   
      $urlRouterProvider.otherwise('/shop/overview');
				  
		  
        
});

