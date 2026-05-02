/**
 * @desc    Standardized API response wrapper
 */
class ApiResponse {
  constructor(data = null, message = 'Success', statusCode = 200) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static send(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json(new ApiResponse(data, message, statusCode));
  }
}

module.exports = ApiResponse;
