var shopApp = angular.module('shopApp', ['ngResource', 'ngCookies' ,'ui.router', 'ui.utils', 'angularLocalStorage']);

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
				  
		  //
		  // Now set up the states
		  $stateProvider

       // products
      .state('shop', {
        controller: 'ShopController',
        abstract: true,
        url: "/shop",
        templateUrl: "/partials/shop.html",
      }) 

      .state('shop.overview', {
        url: "/overview",
        templateUrl: "/partials/overview.html",
      })

      .state('shop.detail', {
        url: "/detail",
        templateUrl: "/partials/detail.html",
        controller : 'DetailController'
      })
		  
      .state('shop.login', {
          url: '/login',
          templateUrl: '/partials/login.html'  ,
          controller: 'LoginController'        
      })

      .state('shop.cart', {
        url: '/cart',
        templateUrl: '/partials/cart.html',
        controller: 'CartController'
      })

      .state('shop.checkout', {
        url: '/checkout',
        templateUrl: '/partials/checkout.html',
        controller: 'CheckoutController'
      })

      .state('shop.checkout.data', {
          url: '/data',
          templateUrl: '/partials/data.html',
          controller: 'MyDataController'      
      })

      .state('shop.checkout.address', {
          url: '/address',
          templateUrl: '/partials/address.html' ,
          controller: 'InvoiceAddressController'         
      })

      .state('shop.checkout.delivery', {
          url: '/delivery',
          templateUrl: '/partials/delivery.html',
          controller: 'DeliveryAddressController'       
      })

      .state('shop.checkout.payment', {
          url: '/payment',
          templateUrl: '/partials/payment.html'      
      })

      .state('shop.checkout.confirmation', {
          url: '/confirmation',
          templateUrl: '/partials/confirmation.html'      
      })

      .state('shop.checkout.done', {
          url: '/done',
          templateUrl: '/partials/done.html'      
      })
        
});

