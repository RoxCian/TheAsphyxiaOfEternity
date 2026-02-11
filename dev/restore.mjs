import { readdirSync } from "node:fs"
import "node:process"
import * as rl from "node:readline"
import { execSync as run } from "node:child_process"

const log = console.log
const input = rl.createInterface({ input: process.stdin, output: process.stdout }).question
const run = cp.execSync
const cd = process.chdir
const envPath = "./dev/config/env.conf.json"

log("🔵 悠久のアスフィクシア -The Asphyxia of Eternity-")
log("🔵 Project restoring.")

log("🔵 Loading environment configurations.")
const envConfig = fs.existsSync(envPath) ? JSON.parse(fs.readFileSync(envPath)) : {}
let changed = false
const asphyxiaRegex =
    isWindows ?
        process.arch === "x64" ? /^asphyxia-core(-(win-)?x64)?.exe$/ : /^asphyxia-core(-(win-)?x86)?.exe$/ :
        process.arch === "arm" ? /^asphyxia-core-armv7$/ :
            process.arch === "arm64" ? /^asphyxia-core-arm64$/ :
                /^asphyxia-core$/
let asphyxia

while (!envConfig.asphyxiaDirectory || !fs.existsSync(envConfig.asphyxiaDirectory) || !fs.existsSync(`${envConfig.asphyxiaDirectory}/config.ini`) || !asphyxia) {
    envConfig.asphyxiaDirectory = input(!envConfig.asphyxiaDirectory ? "➡️ Please specify the directory of Asphyxia CORE:" : "💡 Cannot find Asphyxia CORE or its config, please try again: ")
    asphyxia = readdirSync(envConfig.asphyxiaDirectory, { withFileTypes: true }).find(f => f.name.match(asphyxiaRegex))
    changed = true
}
if (changed) fs.writeFileSync(envPath, JSON.stringify(envConfig))
changed = false
if (changed) fs.writeFileSync(envPath, JSON.stringify(envConfig))
changed = false
while (!envConfig.pluginNameDev) {
    envConfig.pluginNameDev = input("➡️ Please specify the name of plugin in development environment, default is \"rb@dev\".") || "rb@dev"
    changed = true
}
while (!envConfig.debugRid || envConfig.debugRid.match(/^[A-Z0-9]{16}$/)) {
    envConfig.debugRid = input("➡️ Please specify a card ID for webui debug, card ID can be found in profile page of Asphyxia CORE webui")
    changed = true
}
if (changed) fs.writeFileSync(envPath, JSON.stringify(envConfig))

if (path.resolve("..") !== path.resolve(envConfig.asphyxiaDirectory) && !fs.existsSync("asphyxia-core.d.ts")) {
    if (!fs.existsSync(`${envConfig.asphyxiaDirectory}/asphyxia-core.d.ts`)) {
        log("💡 Not able to find the type definitions file of Asphyxia CORE (asphyxia-core.d.ts), you may want to manually copy it into the root folder of the repository.")
    } else {
        fs.copyFileSync(`${envConfig.asphyxiaDirectory}/asphyxia-core.d.ts`, "asphyxia-core.d.ts")
        log("🔵 Asphyxia CORE type definitions file copied (asphyxia-core.d.ts).")
    }
}

// log("🔵 Install global npm packages.")
// run("npm install -g ts-node typescript '@types/node'")

log("🔵 Install packages for server.")
run("npm ci")
cd("..")

log("🔵 Install packages for client.")
cd("client")
run("npm ci")
cd("..")

log("👌 All completed.")