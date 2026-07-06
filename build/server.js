"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const start = async () => {
    const app = await (0, app_1.buildApp)();
    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    try {
        await app.listen({ port: PORT, host: '0.0.0.0' });
        app.log.info(`Server running on port ${PORT}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
