const express = require("express");
const apiRoutes = require("./src/routes/routes");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3005;
const cors = require('cors');
const userMiddleware = require('./src/middleware/userMiddleware');

app.use(
    bodyParser.json()
);

app.use(
	cors({
		origin: '*',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		allowedHeaders: '*',
	})
);

app.use(userMiddleware.tokenAuthenticator);

app.use("/api/v1", apiRoutes);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
