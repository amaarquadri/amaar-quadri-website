const outputPath = require('path').resolve(__dirname, "static", "frontend");

module.exports = ["index", "aquadrone_mechanical", "games", "play"].map(name => ({
    name: name,
    entry: "./src/" + name + ".jsx",
    output: {
        path: outputPath,
        filename: name + ".js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    }
}))
