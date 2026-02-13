import { createReadStream, existsSync, readdirSync, readFileSync } from "node:fs"
import * as rl from "node:readline"

const env = JSON.parse(readFileSync("../dev/config/env.conf.json"))
const ngConf = JSON.parse(readFileSync("./angular.json"))
let port = 8083
const asphyxiaConfigPath = `${env.asphyxiaDirectory}/config.ini`
if (existsSync(asphyxiaConfigPath)) {
    const asphyxiaConfigStream = createReadStream(asphyxiaConfigPath)
    const lines = rl.createInterface({
        input: asphyxiaConfigStream,
        crlfDelay: Infinity
    })
    for await (const line of lines) {
        if (line.startsWith("[") && line.endsWith("]")) continue
        const kv = line.split("=")
        if (kv[0].toLowerCase() === "port") {
            port = parseInt(kv[1])
            break
        }
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
        // intercept the jackets API since webui may not existed in dev plugin folder
        context: ["/emit/rbGetJackets"],
        target: `http://localhost:${port}`,
        secure: false,
        logLevel: "debug",
        bypass: (req, res, options) => {
            const jackets = readdirSync("./src/assets/jackets").map(n => n.match(/^(?<filename>\d[a-z][a-z\d]\d(_[0123]?))\..+$/)?.groups.filename).filter(n => n)
            res.end(JSON.stringify(jackets))
            return true
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