const express = require('express');
const router = express.Router();
const authRouter = require('./authRoutes')
const roleRouter = require('./roleRoutes')
const stockRouter = require('./stockRoutes')
const cryptoRouter = require('./cryptoRoutes')
const adminRouter = require('./adminRoutes')

router.use("/auth", authRouter)

router.use("/roles", roleRouter)

router.use("/stocks", stockRouter)

router.use("/crypto", cryptoRouter)

router.use("/admin", adminRouter)


module.exports = router