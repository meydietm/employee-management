angular.module("employeeApp").config(function($routeProvider) {
  $routeProvider
    .when("/employees", {
      templateUrl: "./app/views/employees.html",
      controller: "EmployeeListController"
    })
    .otherwise({ redirectTo: "/employees" });
});