shopApp.config(function($stateProvider) {
      
          
      
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
        controller: "OverviewController"

      })

      .state('shop.categories', {
        url: "/categories/:id",
        templateUrl: "/partials/categories.html",
        controller: "CategoryController"

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

shopApp.controller('ShopController', function($scope, storage, Categories) {

  Categories.query().$promise.then(function(result) {
    $scope.categories = result;
  });

  storage.bind($scope,'order');

});

shopApp.controller('OverviewController', function($scope, storage, Inventory, Categories) {

  Inventory.query().$promise.then(function(result) {
    $scope.inventory = result;
  });

  

});

shopApp.controller('CategoryController', function($scope, storage, Inventory, Categories, $stateParams) {

  Inventory.query({ category : $stateParams.id}).$promise.then(function(result) {
    $scope.inventory = result;
  });


});