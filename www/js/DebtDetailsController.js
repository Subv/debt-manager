angular.module("starter")
.controller("DebtDetailsController", function($scope, debtService, $stateParams) {
    $scope.debt = debtService.getDebt($stateParams.debtId);
});