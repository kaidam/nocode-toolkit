class AuthenticationError extends Error {
  constructor(message) {
    super(message)
    this.name = "AuthenticationError"
  }
}

class AuthorizationError extends Error {
  constructor(message) {
    super(message)
    this.name = "AuthorizationError"
  }
}

module.exports = {
  AuthenticationError,
  AuthorizationError,
}
