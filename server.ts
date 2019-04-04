import express = require('express');

import * as config from './server_config.json';

const app = express();

app.listen(config.port, () => {
    console.log('Express server listening on port ' + config.port)
});
