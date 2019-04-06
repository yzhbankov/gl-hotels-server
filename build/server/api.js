const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
router.use(bodyParser.json({ limit: '100mb' }));
router.use('/auth', require('./auth/router'));
router.use('/users', require('./users/router'));
router.use('/hotels', require('./hotels/router'));
module.exports = router;
//# sourceMappingURL=api.js.map