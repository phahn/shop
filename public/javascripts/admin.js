shopApp.config(function($stateProvider) {
	  	
				  
		  //
		  // Now set up the states
		  $stateProvider

      .state('admin', {
        url: '/admin',
        templateUrl: "/partials/admin.html"
      })

      .state('admin.articles', {
        url: '/articles',
        templateUrl: "/partials/admin/article/inventory-list.html",
        controller : 'InventoryListController'
      })

      .state('admin.article-detail', {
        url: '/articles/detail/:id',
        templateUrl: "/partials/admin/article/inventory-detail.html",
        controller : 'InventoryDetailController'
      })

      .state('admin.article-new', {
        url: '/articles/create',
        templateUrl: "/partials/admin/article/inventory-new.html",
        controller : 'InventoryNewController'
      })

      // categories

       .state('admin.categories', {
        url: '/categories',
        templateUrl: "/partials/admin/category/category-list.html",
        controller : 'CategoryListController'
      })

      .state('admin.category-detail', {
        url: '/categories/detail/:id',
        templateUrl: "/partials/admin/category/category-detail.html",
        controller : 'CategoryDetailController'
      })

      .state('admin.category-new', {
        url: '/categories/create',
        templateUrl: "/partials/admin/category/category-new.html",
        controller : 'CategoryNewController'
      })
  });



// inventory
shopApp.factory("Inventory", function ($resource) {
    return $resource("/api/inventory/articles/:id", {}, {
    	update : {
    		method : 'PUT'
    	}
    });
});

shopApp.factory("Categories", function ($resource) {
    return $resource("/api/inventory/categories/:id", {}, {
    	update : {
    		method : 'PUT'
    	}
    });
});

shopApp.controller('InventoryListController', function($scope, Inventory) {
	Inventory.query().$promise.then(function(result) {
		$scope.articles = result;
	})
});

shopApp.controller('InventoryDetailController', function($scope, Inventory, $stateParams, $state, Categories) {

	Categories.query().$promise.then(function(result) {
		$scope.categories = result;
	});

	Inventory.get({ id : $stateParams.id}).$promise.then(function(result) {
		$scope.article = result;
	});

	$scope.update = function(article) {
		Inventory.update({ id: $stateParams.id }, article).$promise.then(function(result) {
			$state.go("admin.articles");
		});
	};

	$scope.delete = function(article) {
		Inventory.delete({ id: $stateParams.id }).$promise.then(function(result) {
			$state.go("admin.articles");
		});
	};

});

shopApp.controller('InventoryNewController', function($scope, Inventory, $state, Categories) {

	Categories.query().$promise.then(function(result) {
		$scope.categories = result;
	});

	$scope.article = {};

	$scope.create = function(article) {
		Inventory.save(article).$promise.then(function(result) {
			$state.go("admin.articles");
		});
	};

});

shopApp.controller('CategoryListController', function($scope, Categories) {
	Categories.query().$promise.then(function(result) {
		$scope.categories = result;
	})
});

shopApp.controller('CategoryDetailController', function($scope, Categories, $stateParams, $state) {

	Categories.get({ id : $stateParams.id}).$promise.then(function(result) {
		$scope.category = result;
	});

	$scope.update = function(category) {
		Categories.update({ id: $stateParams.id }, category).$promise.then(function(result) {
			$state.go("admin.categories");
		});
	};

	$scope.delete = function(category) {
		Categories.delete({ id: $stateParams.id }).$promise.then(function(result) {
			$state.go("admin.categories");
		});
	};

});

shopApp.controller('CategoryNewController', function($scope, Categories, $state) {

	$scope.category = {};

	$scope.create = function(category) {
		Categories.save(category).$promise.then(function(result) {
			$state.go("admin.categories");
		});
	};

});
