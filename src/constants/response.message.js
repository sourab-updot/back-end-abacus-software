// Generic responses
exports.API_ENDPOINT_NOT_FOUND_ERR = "API ENDPOINT NOT FOUND";

// User route responses
exports.USERNAME_NOT_FOUND_ERR = "No user found with this username. Try again.";
exports.USER_NOT_FOUND_ERR = "No user found with this employee Id. Try again.";
exports.PASSWORD_NOT_VALID_ERR = "Password is invalid. Try again.";
exports.USER_ACCESS_GRANTED = "Access Granted.";
exports.USER_REGISTERED = "User created successfully.";
exports.USER_UPDATED = "User updated successfully.";
exports.NOT_UNIQUE_EMAIL_ERR = "Email already exists.";
exports.MAIL_FAILED_ERR = "Something went wrong in sending verficatiom mail.";
exports.MAIL_SENT_SUCCESS = "Verification mail sent to registerd email.";
exports.VERIFICATION_FAILED_ERR = "Verification code is invalid.";
exports.TOKEN_VERIFY_SUCCESS = "Token verified successfully";
exports.UNAUTHORIZED_ERR = "You are not authorized.";
exports.USERS_NOT_FOUND = "Users not found";

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
exports.PRODUCT_ID_REQUIRED = "Product ID is required";
exports.PRODUCT_CAT_REQUIRED = "Product category is required";
exports.NO_PRODUCTS_FOUND = "Inventory is empty.";
exports.NO_PRODUCT_FOUND_ID = "Cannot find any product with this id.";
exports.NO_PRODUCTS_FOUND_CAT = "Cannot find any product under this category.";
exports.UPDATED_PRODUCT_DETAILS = "Product updated successfully";
exports.REMOVED_PRODUCT = "Product removed from inventory successfully";

// Category
exports.CATEGORY_CREATED = "Category created successfully.";
exports.CATEGORY_ID_REQUIRED = "Category ID is required";
exports.CATEGORY_BY_ID_NOT_FOUND = "No category found with this ID";
exports.CATEGORY_NOT_FOUND = "No category found.";
exports.CATEGORY_UPDATED = "Category updated successfully.";
exports.CATEGORY_DELETED = "Category deleted successfully.";

// Payment
exports.PAYMENT_CREATED = "Payment record created successfully.";
exports.PAYMENT_UPDATED = "Payment record updated successfully";
exports.PAYMENT_DELETED = "Payment record deleted successfully.";
exports.PAYMENT_NOT_FOUND = "No payment record found.";
exports.PAYMENT_ID_NOT_FOUND = "Payment Id is required.";
