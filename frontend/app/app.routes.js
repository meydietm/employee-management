angular.module("employeeApp").config(function($routeProvider) {
  $routeProvider
    .when("/employees", {
      templateUrl: "./app/views/employees.html",
      controller: "EmployeeListController"
    })
    .when("/employees/new", {
      templateUrl: "./app/views/employee-form.html",
      controller: "EmployeeFormController"
    })
    .when("/employees/:id/edit", {
      templateUrl: "./app/views/employee-form.html",
      controller: "EmployeeFormController"
    })
    .otherwise({ redirectTo: "/employees" });
});
