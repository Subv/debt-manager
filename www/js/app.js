var mod = angular.module('starter', ['ionic']);

mod.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('outstanding', {
            url: '/',
            templateUrl: 'partials/outstanding.html',
            controller: 'DebtsListController'
        })
        .state('all', {
            url: '/all',
            templateUrl: 'partials/all.html',
            controller: 'DebtsListController'
        })
        .state('search', {
            url: '/search',
            templateUrl: 'partials/search.html',
            controller: 'SearchController'
        })
        .state('details', {
            url: '/details/{debtId:[0-9]{1,8}}',
            templateUrl: 'partials/details.html',
            controller: 'DebtDetailsController'
        })
        .state('update', {
            url: '/update/{debtId:[0-9]{1,8}}',
            templateUrl: 'partials/update.html',
            controller: 'UpdateDebtController'
        });

    $urlRouterProvider.otherwise("/");
});

mod.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

mod.filter('outstanding', function() {
    return function(input, uppercase) {
        var out = [];
        for (var i = 0; i < input.length; i++) {
            if (input[i].resolved === false) {
                out.push(input[i]);
            }
        }
        return out;
    }
});

mod.service("debtService", function() {
    var data = [{
                id: 1,
                subject: "Test 1",
                amount: 1500,
                owed: false,
                resolved: false,
                payments: []
            },
            {
                id: 2,
                subject: "Test 2",
                amount: 3000,
                owed: true,
                resolved: true,
                payments: []
            },
            {
                id: 3,
                subject: "Test 3",
                amount: 5000,
                owed: true,
                resolved: false,
                payments: []
            }
        ];

    var loaded = false;

    function load() {
        if (loaded)
            return;
        data = JSON.parse(window.localStorage['debts'] || '[]');
        loaded = true;
    }

    function save() {
        window.localStorage['debts'] = JSON.stringify(data);
    }

    function push(debt) {
        data.push(debt);
    }

    function forEach(pred) {
        data.forEach(pred);
    }

    function get() {
        return data;
    }

    function remove(elem) {
        var index = data.indexOf(elem);
        if (index > -1)
            data.splice(index, 1);
    }

    function getNewId() {
        if (data.length == 0)
            return 1;

        var last = data[data.length - 1];
        return last.id + 1;
    }

    function getDebt(id) {

        for (var i = 0; i < data.length; ++i)
            if (data[i].id == id)
                return data[i];

        return undefined;
    }

    return {
        load: load,
        save: save,
        push: push,
        forEach: forEach,
        get: get,
        remove: remove,
        getNewId: getNewId,
        getDebt: getDebt
    }
});

mod.controller("GeneralController", function($scope, debtService, $ionicModal) {
    $scope.debts = debtService;
    $scope.debts.load();

    $scope.totalOwed = 0;
    $scope.totalOwn = 0;

    $scope.updateOwns = function() {

        $scope.totalOwed = 0;
        $scope.totalOwn = 0;

    }

    $scope.updateOwns(); // Update the labels based on the existing info

    // Create and load the Modal
    $ionicModal.fromTemplateUrl('partials/new-debt.html', function(modal) {
        $scope.debtModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

    $scope.newDebt = function() {
        console.log("Opening " + $scope.debtModal);
        $scope.debtModal.show();
    }

    $scope.createDebt = function(debt) {
        var amm = parseInt(debt.amount);
        if (amm <= 0 || amm == false) {
            // Error out
            return;
        }

        // Add the new debt
        $scope.debts.push({
            id: $scope.debts.getNewId(),
            amount: amm,
            subject: debt.subject,
            owed: debt.owed,
            resolved: false,
            payments: []
        });

        // Reset the modal
        debt.subject = "";
        debt.amount = "";
        debt.owed = true;

        // Save the debts to LocalStorage
        $scope.debts.save();

        $scope.updateOwns();

        // Hide the modal
        $scope.debtModal.hide();
    }

    $scope.closeNewDebt = function() {
        $scope.debtModal.hide();
    }
});