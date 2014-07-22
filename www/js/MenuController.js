angular.module('starter')
.controller('MenuController', function($scope, $location, $state) {
    $scope.menu = [
        {
            title: "Outstanding Debts",
            url: "/",
            state: "outstanding"
        },
        {
            title: "All Debts",
            url: "/all",
            state: "all"
        },
        {
            title: "Search",
            url: "/search",
            state: "search"
        }
    ];

    $scope.selectMenuItem = function(item) {
        $location.path(item.url);
    }

    $scope.checkInState = function(state) {
        return state == $state.current.name;
    }
});