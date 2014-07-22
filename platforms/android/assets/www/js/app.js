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
            if (!input[i].resolved){
                out.push(input[i]);
            }
        }
        return out;
    }
});

mod.service("debtService", function() {
    var data = [{
                subject: "Test 1",
                amount: 1500,
                owed: false,
                resolved: false
            },
            {
                subject: "Test 2",
                amount: 3000,
                owed: true,
                resolved: true
            },
            {
                subject: "Test 3",
                amount: 5000,
                owed: true,
                resolved: false
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

    return {
        load: load,
        save: save,
        push: push,
        forEach: forEach,
        get: get
    }
});

mod.controller("DebtsListController", function($scope, $ionicModal, $location, $state, debtService) {

    $scope.debts = debtService;
    $scope.debts.load();

    console.log($scope.debts);

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
        }
    ];
    
    $scope.selectMenuItem = function(item) {
        $location.path(item.url);
    }

    $scope.checkInState = function(state) {
        return state == $state.current.name;
    }

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
        $scope.debtModal.show();
    }

    $scope.createDebt = function(debt) {
        var amm = parseInt(debt.amount);
        if (amm <= 0 || amm == false) {
            // Error out
            return;
        }
        
        $scope.debts.push({
            amount: amm,
            subject: debt.subject,
            owed: false,
            resolved: false
        });

        debt.subject = "";
        debt.amount = "";
        $scope.debts.save();
        $scope.updateOwns();
        $scope.debtModal.hide();
    }

    $scope.closeNewDebt = function() {
        $scope.debtModal.hide();
    }
});
