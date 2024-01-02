const router = require("./router");
const {sequelize} = require('./models');
const env = process.env.NODE_ENV || "development"
const port = env === "test" ? 8080 : 3000
const app = require("./app")

const connectToDB = async () => {
    console.log("connectToDB called")
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
}

(async () => {
    await connectToDB();
})();
app.listen(port, (err) => {
    if(err) {
        throw err;
    }
    console.log(`Listening on port ${port}`);
});


