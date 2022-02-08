class CustomError extends Error {


    check_input() {
      return {
        message: "Check input",
        code: 400,
      };
    }
  
    already_exists() {
      return {
        message: "Already exists",
        code: 401,
      };
    }
    invalid_parameter() {
      return {
        message: "Invalid Parameter",
        code: 419,
      };
    }

    invalid_token() {
      return {
        message: "Invaled bearer token",
        code: 404,
      };
    }

    auth_header() {
      return {
        message: "Authorization Header is required",
        code: 404,
      };
    }

  }
  
  module.exports = CustomError;