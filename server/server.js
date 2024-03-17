const {
    sequelize
} = require('./models');
const env = process.env.NODE_ENV || "development"
let port = 3000;
const app = require("./app")
//change ports for different environments
if (env === "test") port = 8080;
else if (env === 'production') port = 5000;
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
    if (env === "production") {
        try {
            await sequelize.authenticate();
            console.log("Connection with RDS successfully established!")
        } catch (error) {
            console.error("Unable to establish connection with RDS:", error)
            process.exit(1)
        }
    } else {
        try {
            await connectToDB();
            console.log("Local connection to DB successful.")
        } catch {
            console.log("Unable to connect locally.")
            process.exit(1)
        }
    }

})();
app.listen(port, (err) => {
    if (err) {
        throw err;
    }
    console.log(`Listening on port ${port}`);
});