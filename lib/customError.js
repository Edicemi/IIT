class CustomError extends Error {


    INVALID_TOKEN() {
      return {
        message: "Invalid code",
        code: 400,
      };
    }
  
    MONGO_ERROR() {
      return {
        message: "server error",
        code: 400,
      };
    }
  }
  
  module.exports = CustomError;