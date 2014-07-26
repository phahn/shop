
shopApp.controller('CheckoutController', function($scope) {

});

shopApp.controller('MyDataController', function($scope) {

});

shopApp.controller('DeliveryAddressController', function($scope) {
	$scope.type = 'invoice';
});

shopApp.controller('InvoiceAddressController', function($scope) {
	$scope.type = 'new';
});



shopApp.controller('CartController', function($scope,$state) {

	$scope.removeArticle = function(article) {
		$scope.order.cart.articles.splice($scope.order.cart.articles.indexOf(article), 1);
	}

	$scope.clear = function() {
		$scope.order.cart.articles = [];
		$state.go("shop.overview");
	}

});

shopApp.controller('DetailController', function($scope,$state) {

	$scope.addToCart = function(article) {

		if (!$scope.order.cart.articles) {
			$scope.order.cart.articles = [ $scope.inventory[0] ];
		} else {
			$scope.order.cart.articles.push($scope.inventory[$scope.order.cart.articles.length]);
		}

		$state.go("shop.overview");
	}

});