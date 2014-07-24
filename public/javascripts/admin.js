
// inventory
shopApp.factory("Inventory", function ($resource) {
    return $resource("/api/inventory/:slug");
});

shopApp.controller('InventoryListController', function($scope, Inventory) {
	Inventory.query().$promise.then(function(result) {
		$scope.inventory = result;
	})
});

shopApp.controller('InventoryDetailController', function($scope, Inventory) {

});
