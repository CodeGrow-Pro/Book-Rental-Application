const express = require('express');
const v1router = require('../api/v1/index')
const routers = express.Router();

routers.use('/v1',v1router);
module.exports = routers;