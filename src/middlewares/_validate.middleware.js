async function _validateUser(req, userModel) {
  // Check for authorized user
  if (!req.user._id) {
    return false;
  } else {
    //  Check if user exists in db
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return false;
    }
  }
  return true;
}

exports._validateUser = _validateUser;
