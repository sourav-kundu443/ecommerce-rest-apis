class CustomErrorHandler extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }

  static alreadyExist(message) {
    return new CustomErrorHandler(409, message);
  }

  static wrongCredentials(message = "Username or password is wrong!") {
    return new CustomErrorHandler(401, message);
  }

  static unAuthorized(message = "unathorized!") {
    return new CustomErrorHandler(401, message);
  }

  static notFound(message = "Not found!!") {
    return new CustomErrorHandler(404, message);
  }

  static serverError(message = "Internal server errror") {
    return new CustomErrorHandler(500, message);
  }
}

export default CustomErrorHandler;
