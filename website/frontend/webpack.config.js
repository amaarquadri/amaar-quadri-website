const outputPath = require('path').resolve(__dirname, "static", "frontend");
const pageNames = require('fs').readdirSync("src/")
    .filter(file => file.endsWith('.jsx'))
    .map(file => file.substring(0, file.length - 4))  // trim off file extension

module.exports = pageNames.map(name => ({
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
