const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
    entry: "./src/app.js",
    output: {
        path: __dirname + "/dist",
        filename: "newBudgetTracker.js"
    },
    mode: "production",
    plugins: [
        new WebpackPwaManifest({
            filename: 'manifest.json',
            inject: false,
            fingerprints: false,
            name: "Budget Tracker App",
            short_name: "Budget app",
            background_color: "#fffff",
            start_url: "/",
            display: "standalone",
            icons: [
                {
                src: path.resolve(__dirname, 'public/icons/icon-192x192.png'),
                sizes: [192, 512]
                }
            ]
        })
    ]
};

module.exports = config;