angular.module("starter")
.controller("UpdateDebtController", function($scope, $stateParams, debtService) {
    $scope.debt = debtService.getDebt($stateParams.debtId);

    $scope.toggleDebt = function(debt) {
        debt.resolved = !debt.resolved;
        debtService.save();
    }
});