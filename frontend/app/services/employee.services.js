angular.module("employeeApp").factory("EmployeeService", function($http) {
  var API_BASE = "http://localhost:3001/api";
  return {
    list: function() {
      return $http.get(API_BASE + "/employees"); // Sprint 1
    }
  };
});