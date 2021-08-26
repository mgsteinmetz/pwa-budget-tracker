const config = {
    entry: "./src/app.js",
    output: {
        path: __dirname + "/dist",
        filename: "newBudgetTracker.js"
    },
    mode: "development"
};

module.exports = config;