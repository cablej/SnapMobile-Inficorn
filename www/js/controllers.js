angular.module('app.controllers', ['ionic'])
  
.controller('unicornsCtrl', function($scope, $http, $ionicModal, $ionicScrollDelegate) {

	$scope.bottomPageOffset = 300; //how close the user has to be to the end of the page for more gif's to load

	$scope.gifs = [];
	$scope.searchTerm = "unicorn";
	$scope.searchOffset = 0;
	$scope.searchLimit = 100;

	$scope.doneSearching = false; //all the search results have been fetched
	$scope.isLoadingGifs = false;

	$scope.searchURL = "http://api.giphy.com/v1/gifs/search"
	$scope.trendingURL = "http://api.giphy.com/v1/gifs/trending"

    $scope.loadGifs = function(queryURL) {
		$scope.isLoadingGifs = true; //ensures that we don't try loading the same gif's multiple times
		$http({
			method: 'GET',
			url: queryURL,
			params: {q: $scope.searchTerm, api_key: "dc6zaTOxFJmzC", rating: "pg", offset: $scope.searchOffset, limit: $scope.searchLimit}
		}).then(function successCallback(response) {
			responseJSON = response.data;
			if(responseJSON.pagination.total_count > $scope.offset) { //we've hit the end of the search results
				$scope.doneSearching = true;
				return;
			}
			gifArray = responseJSON.data;
			//add the fetched gif's to the array of gifs
			gifArray.forEach(function(gif) {
				$scope.gifs.push({url: gif.images.fixed_height.url})
			});
			//increase the search offset, so the next request loads the next gifs
			$scope.searchOffset += $scope.searchLimit;
			$scope.isLoadingGifs = false;
		}, function errorCallback(response) {
			//something went wrong...
			console.log("error");
			$scope.isLoadingGifs = false;
		});
    }

    //prepare the enlarged image modal
	$ionicModal.fromTemplateUrl('imageModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    
    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.presentLarge = function(url) {
    	$scope.url = url;
    	$scope.openModal();
    }

    //called when the user searches a term
    $scope.search = function(term) {
    	$scope.searchTerm = term;
    	//reset the gifs loaded:
    	$scope.gifs = [];
    	$scope.searchOffset = 0;
    	$scope.loadGifs($scope.searchURL);
    	cordova.plugins.Keyboard.close();
    }

    //called whenever the user scrolls
    //checks if the user has reached the bottom of the page
    $scope.checkBottomOfPage = function(giphyEndpoint) {
    	if($scope.isLoadingGifs || $scope.doneSearching) return; //we don't want to try loading more if we're already loading gifs.
    	var scrollPosition = $ionicScrollDelegate.$getByHandle('scroll').getScrollPosition().top;
    	var totalHeight = $ionicScrollDelegate.$getByHandle('scroll').getScrollView().__maxScrollTop;
    	if(scrollPosition > totalHeight - $scope.bottomPageOffset) {
    		$scope.loadGifs(giphyEndpoint);
    	}
    }
})