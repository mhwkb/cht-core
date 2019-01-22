angular.module('controllers').controller('MainCtrl',
  function (
    $log,
    $translate,
    $window,
    $state,
    Auth,
    $scope,
    Location,
    Session
  ) {
    'ngInject';
    $translate.use('en');
    $scope.authorized = false;
    Auth('can_configure')
    .then(function() {
      $scope.authorized = true;
    })
    .catch(function() {
      $log.error('Insufficient permissions. Must be either "admin" or "nationalAdmin".');
      $window.location.href = Location.path;
    });


    $scope.webAppUrl = Location.path;
    $scope.logout = function() {
      Session.logout();
    };
    $scope.checkActive = state => $state.includes(state);
  }
);
