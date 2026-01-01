angular.module("employeeApp").controller("EmployeeFormController", function($scope, $routeParams, $location, EmployeeService) {
  $scope.employeeId = $routeParams.id;
  $scope.isEdit = !!$scope.employeeId;

  $scope.title = $scope.isEdit ? "Edit Employee" : "Add Employee";

  $scope.loading = false;
  $scope.error = null;

  $scope.model = {
    Name: "",
    Position: "",
    Salary: null
  };

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

  function loadEmployeeIfEdit() {
    if (!$scope.isEdit) return;

    $scope.loading = true;
    $scope.error = null;

    EmployeeService.get($scope.employeeId)
      .then(function(res) {
        var emp = res.data.data || {};
        $scope.model = {
          Name: emp.Name || "",
          Position: emp.Position || "",
          Salary: emp.Salary != null ? Number(emp.Salary) : null
        };
      })
      .catch(function(err) {
        $scope.error = extractErrorMessage(err, "Failed to load employee.");
      })
      .finally(function() {
        $scope.loading = false;
      });
  }

  $scope.save = function() {
    $scope.error = null;

    // simple client-side validation (backend still enforces the real rules)
    if (!$scope.model.Name || String($scope.model.Name).trim().length === 0) {
      $scope.error = "Name is required.";
      return;
    }
    var salaryNum = Number($scope.model.Salary);
    if (!isFinite(salaryNum) || salaryNum <= 0) {
      $scope.error = "Salary must be a number greater than 0.";
      return;
    }

    $scope.loading = true;

    var action = $scope.isEdit
      ? EmployeeService.update($scope.employeeId, $scope.model)
      : EmployeeService.create($scope.model);

    action
      .then(function() {
        $location.path("/employees");
      })
      .catch(function(err) {
        $scope.error = extractErrorMessage(err, "Failed to save employee.");
      })
      .finally(function() {
        $scope.loading = false;
      });
  };

  $scope.cancel = function() {
    $location.path("/employees");
  };

  loadEmployeeIfEdit();
});
