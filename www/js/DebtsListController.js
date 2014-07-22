angular.module('starter')
.controller("DebtsListController", function($scope, debtService, $ionicPopup, $ionicListDelegate, $location) {

    $scope.debts = debtService;
    $scope.debts.load();

    $scope.confirmDeleteDebt = function(debt) {
        var confirm = $ionicPopup.confirm({
            title: 'Delete',
            template: 'Are you sure you want to delete that debt?'
        });

        confirm.then(function(res) {
            if (res) {
                $ionicListDelegate.closeOptionButtons();
                $scope.debts.remove(debt);
                $scope.debts.save();
            }
        });
    }

    $scope.showDetails = function(debt) {
        $location.path("/details/" + debt.id);
    }

    $scope.showUpdate = function(debt) {
        $location.path("/update/" + debt.id);
    }
});