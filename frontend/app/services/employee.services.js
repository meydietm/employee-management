angular.module("employeeApp").factory("EmployeeService", function($http) {
  var API_BASE = "http://localhost:3001/api";

  function normalizeEmployeePayload(model) {
    return {
      Name: String(model && model.Name ? model.Name : "").trim(),
      Position: model && model.Position != null && String(model.Position).trim().length > 0
        ? String(model.Position).trim()
        : null,
      Salary: Number(model && model.Salary != null ? model.Salary : 0)
    };
  }

  return {
    list: function(params) {
      return $http.get(API_BASE + "/employees", { params: params || {} });
    },
    get: function(id) {
      return $http.get(API_BASE + "/employees/" + id);
    },
    create: function(model) {
      return $http.post(API_BASE + "/employees", normalizeEmployeePayload(model));
    },
    update: function(id, model) {
      return $http.put(API_BASE + "/employees/" + id, normalizeEmployeePayload(model));
    },
    remove: function(id) {
      return $http.delete(API_BASE + "/employees/" + id);
    }
  };
});
