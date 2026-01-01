angular.module("employeeApp").controller("EmployeeListController", function($scope, $location, EmployeeService) {
  $scope.title = "Employees";

  $scope.loading = false;
  $scope.error = null;

  $scope.items = [];
  $scope.limitOptions = [10, 20, 50];

  $scope.meta = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    search: ""
  };

  $scope.searchTerm = "";

  function extractErrorMessage(err, fallback) {
    if (err && err.data && err.data.error) {
      var msg = err.data.error.message || fallback;
      var details = err.data.error.details;
      if (details && details.length) {
        msg += " " + details.map(function(d) {
          return d.field + ": " + d.message;
        }).join(" | ");
      }
      return msg;
    }
    return fallback;
  }

  $scope.load = function(page) {
    var targetPage = page || $scope.meta.page || 1;

    $scope.loading = true;
    $scope.error = null;

    EmployeeService.list({
      page: targetPage,
      limit: $scope.meta.limit,
      search: $scope.searchTerm
    })
      .then(function(res) {
        var payload = res.data;

        // Support both {data, meta} and plain array responses
        if (Array.isArray(payload)) {
          $scope.items = payload;
          $scope.meta.total = payload.length;
          $scope.meta.totalPages = 1;
          $scope.meta.page = 1;
        } else {
          $scope.items = payload.data || [];
          $scope.meta = payload.meta || $scope.meta;
          // Keep local UI value in sync
          $scope.searchTerm = $scope.searchTerm || $scope.meta.search || "";
        }
      })
      .catch(function(err) {
        $scope.error = extractErrorMessage(err, "Failed to load employees.");
      })
      .finally(function() {
        $scope.loading = false;
      });
  };

  $scope.onSearch = function() {
    $scope.load(1);
  };

  $scope.changeLimit = function() {
    $scope.load(1);
  };

  $scope.goToNew = function() {
    $location.path("/employees/new");
  };

  $scope.edit = function(id) {
    $location.path("/employees/" + id + "/edit");
  };

  $scope.delete = function(item) {
    if (!item) return;
    var ok = confirm('Delete employee "' + item.Name + '"?');
    if (!ok) return;

    $scope.loading = true;
    $scope.error = null;

    EmployeeService.remove(item.EmployeeID)
      .then(function() {
        $scope.load($scope.meta.page);
      })
      .catch(function(err) {
        $scope.error = extractErrorMessage(err, "Failed to delete employee.");
      })
      .finally(function() {
        $scope.loading = false;
      });
  };

  $scope.prevPage = function() {
    if ($scope.meta.page > 1) $scope.load($scope.meta.page - 1);
  };

  $scope.nextPage = function() {
    if ($scope.meta.page < $scope.meta.totalPages) $scope.load($scope.meta.page + 1);
  };

  // initial load
  $scope.load(1);
});
