class ApiError extends Error {
  constructor(status, message) {
    super();
    (this.status = status), (this.message = message);
  }

  static badRequest() {
    return new ApiError(401, message);
  }
  static notFound() {
    return new ApiError(404, message);
  }
  static forbidden() {
    return new ApiError(403, message);
  }
  static internal() {
    return new ApiError(500, message);
  }
}

export default ApiError;
