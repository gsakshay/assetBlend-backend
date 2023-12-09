const express = require('express');
const router = express.Router();
const authRouter = require('./authRoutes')
const roleRouter = require('./roleRoutes')
const stockRouter = require('./stockRoutes')
const cryptoRouter = require('./cryptoRoutes')
const adminRouter = require('./adminRoutes')
const userRouter = require('./userRoutes')

router.use("/auth", authRouter)

router.use("/roles", roleRouter)

router.use("/stocks", stockRouter)

router.use("/crypto", cryptoRouter)

router.use("/admin", adminRouter)

router.use("/user", userRouter)

module.exports = router