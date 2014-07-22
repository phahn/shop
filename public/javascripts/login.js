 shopApp.factory('Login', ['$resource', function($resource) {
   return $resource('/api/login/', null,
       {
           'sendPassword': { method:'POST', url:'/api/login/sendPassword' }
       });
    }]);


shopApp.controller('LoginController', function($scope, Login, $state) {

	$scope.sendPassword = function(email) {
		Login.sendPassword(email).$promise.then(function(result) {
			console.log("password sent");
		})
	};

	$scope.checkoutAsNewCustomer = function() {
		$scope.order.customer = {
			newcustomer : true
		};
		$state.go("shop.checkout.data");
	}

	$scope.checkoutAsExistingCustomer = function(email, password) {
		// load user from database

		$scope.order.customer = {
			newcustomer: false,
			firstname: 'Pascal',
			name: 'Hahn',
			email: 'hahnpascal@gmail.com'
		};

		$scope.order.invoiceAddress = {
			address1: 'Pascal Hahn',
			address3: 'Wendelinusstr. 39',
			zip: 76646,
			city: 'Bruchsal',
			country: 'Germany'
		};
		$scope.order.deliveryAddress = {
			address1: 'Pascal Hahn',
			address3: 'Wendelinusstr. 39',
			zip: 76646,
			city: 'Bruchsal',
			country: 'Germany'
		};
		$scope.order.payment = 'VISA';
		

		$state.go("shop.checkout.confirmation");

	}

});