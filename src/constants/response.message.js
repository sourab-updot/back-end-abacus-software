// Generic responses
exports.API_ENDPOINT_NOT_FOUND_ERR = "API ENDPOINT NOT FOUND";

// User route responses
exports.USERNAME_NOT_FOUND_ERR = "No user found with this username. Try again.";
exports.USER_NOT_FOUND_ERR = "No user found with this employee Id. Try again.";
exports.PASSWORD_NOT_VALID_ERR = "Password is invalid. Try again.";
exports.USER_ACCESS_GRANTED = "Access Granted.";
exports.USER_REGISTERED = "User created successfully.";
exports.NOT_UNIQUE_EMAIL_ERR = "Email already exists.";
exports.MAIL_FAILED_ERR = "Something went wrong in sending verficatiom mail.";
exports.MAIL_SENT_SUCCESS = "Verification mail sent to registerd email.";
exports.VERIFICATION_FAILED_ERR = "Verification code is invalid.";
exports.TOKEN_VERIFY_SUCCESS = "Token verified successfully";
exports.UNAUTHORIZED_ERR = "You are not authorized.";

// Business routes responses
exports.BUSINESS_DETAILS_ADDED = "Successfully added business details.";
exports.BUSINESS_DETAILS_USER_NOT_FOUND =
  "Business details for this user was not found.";
exports.BUSINESS_DETAILS_ALREADY_EXISTS =
  "Business details for this user already exists";
exports.BUSINESS_DETAILS_UPDATED = "Business details are updated by the user.";
exports.BUSINESS_DETAILS_DELETED =
  "Business details deleted by the user successfully.";

// Products route responses
exports.PRODUCT_CREATED = "Product created successfully";
exports.PRODUCT_IMAGES_COUNT_LIMIT_EXCEEDED =
  "Cannot upload more than 5 images for a product.";
