const express = require("express");
const router = express.Router();
const { verifyUser } = require("../../middlewares/verifyUser");
const { hasUserRole } = require("../../middlewares/hasUserRole");
const FetchUser = require("../queries/users/fetchUser");
const FetchUserHandler = require("../queryHandlers/users/fetchUserHandler");
const UpdateUserCommand = require("../commands/users/updateUserCommand");
const UpdateUserHandler = require('../commandHandlers/users/updateUserHandler');
const customError = require('../../utils/errors/customError');
const commonUtils = require('../../utils/helpers/commonUtils');

router.get("/", verifyUser, async (req, res, next) => {
  try {
    const user = req.body.user;
    const userDetails = commonUtils.formatUserDetails(user, "unrestricted");
    res.status(200).json({ userDetails });
  } catch (error) {
    next(new customError("Failed to fetch user details", 500, "error"));
  }
});

router.get("/:userId", verifyUser, async (req, res, next) => {
  try {
    const { userId } = req.params;

    const fetchUser = new FetchUser({ _id: userId });
    const fetchUserHandler = new FetchUserHandler();
    const user = await fetchUserHandler.handle(fetchUser);

    const userDetails = commonUtils.formatUserDetails(user, "restricted");
    res.status(200).json({ userDetails });
  } catch (error) {
    next(
      new customError(
        "Failed to fetch user details for given user id",
        500,
        "error"
      )
    );
  }
});

router.post("/editDetails", verifyUser, hasUserRole, async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, address } = req.body;
    const { username } = req.body.user;
    
    const user = {};
    user.username = username;
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phone = phone;
    user.address = address;

    //update user details in DB
    const updateUserCommand = new UpdateUserCommand(user);
    const updateUserHandler = new UpdateUserHandler();
    await updateUserHandler.handle(updateUserCommand);

    //fetch & return updated data
    const { _id } = req.body.user;
    const fetchUser = new FetchUser({ _id: _id });
    const fetchUserHandler = new FetchUserHandler();
    const userData = await fetchUserHandler.handle(fetchUser);
    const userDetails = commonUtils.formatUserDetails(userData, "unrestricted");
    res.status(200).json({ userDetails });
  } catch (error) {
    throw new customError("Failed to update user details", 500, 'error')
  }
});

module.exports = router;
