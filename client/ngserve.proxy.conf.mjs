import { createReadStream, readFileSync } from "node:fs"
import * as rl from "node:readline"

const env = JSON.parse(readFileSync("../dev/config/env.conf.json"))
const ngConf = JSON.parse(readFileSync("./angular.json"))
const asphyxiaConfigStream = createReadStream(`${env.asphyxiaDirectory}/config.ini`)
const readline = rl.createInterface({
    input: asphyxiaConfigStream,
    crlfDelay: Infinity
})
let port = 8083
for await (const line of readline) {
    if (line.startsWith("[") && line.endsWith("]")) break
    const kv = line.split("=")
    if (kv[0].toLowerCase() === "port") {
        port = parseInt(kv[1])
        break
    }
}
const ngPort = ngConf.projects[Object.keys(ngConf.projects)[0]].architect.serve.configurations.development.port

export default [
    {
        context: ["/static/"],
        target: `http://localhost:${ngPort}`,
        pathRewrite: {
            "^/static": ""
        }
    },
    {
        context: ["/emit/"],
        target: `http://localhost:${port}`,
        secure: false,
        logLevel: "debug",
        changeOrigin: true,
        configure: proxy => {
            proxy.on("proxyReq", req => {
                req.setHeader("referer", `/plugin/${env.pluginNameDev}/`)
            })
        }
    },
    {
        context: ["/dev/debug-rid"],
        target: `http://localhost:${ngPort}`,
        secure: false,
        bypass: (req, res, options) => {
            res.end(env.debugRid)
            return true
        }
    }
]