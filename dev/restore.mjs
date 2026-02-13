import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import "node:process"
import * as rl from "node:readline/promises"
import { spawn } from "node:child_process"
import { resolve } from "node:path"

const log = console.log
const input = async query => {
    const rlInst = rl.createInterface({ input: process.stdin, output: process.stdout })
    const result = await rlInst.question(query)
    rlInst.close()
    return result
}
const run = async (cmd, errInfo) => {
    let cmdProcess = spawn(cmd, {
        stdio: "pipe",
        shell: true,
        windowsHide: false,
    })
    cmdProcess.stdout.pipe(process.stdout)
    cmdProcess.stderr.pipe(process.stderr)
    let cmdResolver
    let cmdPromise = new Promise(res => cmdResolver = res)
    cmdProcess.on("close", cmdResolver)
    cmdProcess.on("exit", cmdResolver)
    cmdProcess.on("error", cmdResolver)
    try {
        await cmdPromise
    } catch (ex) {
        log(errInfo)
        process.exit(1)
    }
}
const cd = process.chdir
const envPath = "./dev/config/env.conf.json"

const isWindows = process.platform === "win32"

log("🔵 悠久のアスフィクシア -The Asphyxia of Eternity-")
log("🔵 Project restoring.")

log("🔵 Loading environment configurations.")
const envConfig = existsSync(envPath) ? JSON.parse(readFileSync(envPath)) : {}
let changed = false
const asphyxiaRegex =
    isWindows ?
        process.arch === "x64" ? /^asphyxia-core(-(win-)?x64)?\.exe$/ : /^asphyxia-core(-(win-)?x86)?\.exe$/ :
        process.arch === "arm" ? /^asphyxia-core-armv7$/ :
            process.arch === "arm64" ? /^asphyxia-core-arm64$/ :
                /^asphyxia-core$/
let asphyxia = existsSync(envConfig.asphyxiaDirectory) ? readdirSync(envConfig.asphyxiaDirectory, { withFileTypes: true }).find(f => f.name.match(asphyxiaRegex)) : undefined

if (!existsSync("./dev/config/")) mkdirSync("./dev/config/")
while (!envConfig.asphyxiaDirectory || !existsSync(envConfig.asphyxiaDirectory) || !asphyxia) {
    envConfig.asphyxiaDirectory = await input(!envConfig.asphyxiaDirectory ? "➡️ Please specify the directory of Asphyxia CORE: " : "💡 Cannot find Asphyxia CORE or its config, please specify the directory of Asphyxia CORE again: ")
    asphyxia = existsSync(envConfig.asphyxiaDirectory) ? readdirSync(envConfig.asphyxiaDirectory, { withFileTypes: true }).find(f => f.name.match(asphyxiaRegex)) : undefined
    changed = true
}
if (changed) writeFileSync(envPath, JSON.stringify(envConfig))
changed = false
while (!envConfig.pluginNameDev) {
    envConfig.pluginNameDev = (await input("➡️ Please specify the name of plugin in development environment, default is \"rb@dev\": ")) || "rb@dev"
    changed = true
}
if (changed) writeFileSync(envPath, JSON.stringify(envConfig))
changed = false
while (!envConfig.debugRid || !envConfig.debugRid.match(/^[A-Z0-9]{16}$/)) {
    envConfig.debugRid = (await input("➡️ Please specify a card ID for webui debug, card ID can be found in profile page of Asphyxia CORE webui: ")).trim()
    changed = true
}
if (changed) writeFileSync(envPath, JSON.stringify(envConfig))

if (resolve("..") !== resolve(envConfig.asphyxiaDirectory) && !existsSync("asphyxia-core.d.ts")) {
    if (!existsSync(`${envConfig.asphyxiaDirectory}/asphyxia-core.d.ts`)) {
        log("💡 Not able to find the type definitions file of Asphyxia CORE (asphyxia-core.d.ts), you may want to manually copy it into the root folder of the repository.")
    } else {
        copyFileSync(`${envConfig.asphyxiaDirectory}/asphyxia-core.d.ts`, "asphyxia-core.d.ts")
        log("🔵 Asphyxia CORE type definitions file copied (asphyxia-core.d.ts).")
    }
}

// log("🔵 Install global npm packages.")
// run("npm install -g ts-node typescript '@types/node'")

log("🔵 Install packages for server.")
await run("npm install", "😟 Failed to install packages.")

log("🔵 Install packages for client.")
cd("client")
await run("npm install", "😟 Failed to install packages.")
cd("..")

log("🔵 Install packages in Asphyxia CORE plugin directory.")
const home = resolve("./")
cd(`${envConfig.asphyxiaDirectory}/plugins`)
await run("npm install", "😟 Failed to install packages.")
try {
    const tsConfig = JSON.parse(readFileSync(`${envConfig.asphyxiaDirectory}/plugins/tsconfig.json`))
    tsConfig.compilerOptions.experimentalDecorators = true
    writeFileSync(JSON.stringify(tsConfig), `${envConfig.asphyxiaDirectory}/plugins/tsconfig.json`)
} catch { }
cd(home)

log("👌 All completed.")