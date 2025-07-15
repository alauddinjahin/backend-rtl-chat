class HttpStatusCode {
  // Success
  static OK = 200;
  static CREATED = 201;
  static ACCEPTED = 202;
  static NO_CONTENT = 204;

  // Redirection
  static MOVED_PERMANENTLY = 301;
  static FOUND = 302;
  static NOT_MODIFIED = 304;

  // Client Error
  static BAD_REQUEST = 400;
  static UNAUTHORIZED = 401;
  static FORBIDDEN = 403;
  static NOT_FOUND = 404;
  static METHOD_NOT_ALLOWED = 405;
  static CONFLICT = 409;
  static UNPROCESSABLE_ENTITY = 422;
  static TOO_MANY_REQUESTS = 429;

  // Server Error
  static INTERNAL_SERVER_ERROR = 500;
  static NOT_IMPLEMENTED = 501;
  static BAD_GATEWAY = 502;
  static SERVICE_UNAVAILABLE = 503;
  static GATEWAY_TIMEOUT = 504;

  // Helper methods
  static isSuccess(code) {
    return code >= 200 && code < 300;
  }

  static isError(code) {
    return code >= 400;
  }

  static isClientError(code) {
    return code >= 400 && code < 500;
  }

  static isServerError(code) {
    return code >= 500;
  }
}

const HTTPStatusCode = Object.freeze(HttpStatusCode);
module.exports = HTTPStatusCode;
