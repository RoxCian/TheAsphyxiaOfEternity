import { readFileSync, writeFileSync } from "node:fs"
import "node:process"

const log = console.log

log("🔵 悠久のアスフィクシア -The Asphyxia of Eternity-")
log("🔵 Version updating.")

const version = readFileSync("./dev/version", { encoding: "utf8" })
const versionParts = version.split("-")
const versionNumeric = versionParts[0].split(".").map(c => parseInt(c))
let versionLabel = undefined

let ai = 0
let maxLevel = "no"
while (ai < process.argv.length) {
    const arg = process.argv[ai]
    if (!arg.startsWith("-") && !arg.startsWith("/") && !arg.startsWith("\\")) {
        ai++
        continue
    }
    switch (arg.substring(1)) {
        case "M":
        case "maj":
        case "MAJ":
        case "-major":
        case "-MAJOR":
            if (maxLevel !== "major") maxLevel = "major"
            break
        case "m":
        case "min":
        case "MIN":
        case "-minor":
        case "-MINOR":
            if (maxLevel !== "major" && maxLevel !== "minor") maxLevel = "minor"
            break
        case "p":
        case "P":
        case "-patch":
        case "-PATCH":
            if (maxLevel === "no") maxLevel = "patch"
            break
        case "l":
        case "L":
        case "-label":
        case "-LABEL":
            ai++
            versionLabel = process.argv[ai]
            break
    }
    ai++
}
switch (maxLevel) {
    case "major":
        versionNumeric[0]++
        versionNumeric[1] = 0
        versionNumeric[2] = 0
        break
    case "minor":
        versionNumeric[1]++
        versionNumeric[2] = 0
        break
    case "patch":
        versionNumeric[2]++
        break
    default:
        log("😕 Invalid arguments, please check your input.")
        process.exit(-1)
}
const newVersion = versionNumeric.join(".") + (versionLabel ? "-" + versionLabel : "")
log(`👌 ${version} -> ${newVersion}`)

const restoreOperations = []

try {
    // update version of all related files
    //   ./dev/version
    writeFileSync("./dev/version", newVersion, { encoding: "utf8" })
    restoreOperations.push(() => writeFileSync("./dev/version", version, { encoding: "utf8" }))
    //   ./package.json
    const packageConfig = JSON.parse(readFileSync("./package.json"))
    packageConfig.version = "v" + newVersion
    writeFileSync("./package.json", JSON.stringify(packageConfig, undefined, 4))
    restoreOperations.push(() => {
        packageConfig.version = "v" + version
        writeFileSync("./package.json", JSON.stringify(packageConfig, undefined, 4))
    })
    //   ./package-lock.json
    const packageLockConfig = JSON.parse(readFileSync("./package-lock.json"))
    packageLockConfig.version = "v" + newVersion
    packageLockConfig.packages[""].version = "v" + newVersion
    writeFileSync("./package-lock.json", JSON.stringify(packageLockConfig, undefined, 4))
    restoreOperations.push(() => {
        packageLockConfig.version = "v" + version
        packageLockConfig.packages[""].version = "v" + version
        writeFileSync("./package-lock.json", JSON.stringify(packageLockConfig, undefined, 4))
    })
    //   ./client/package.json
    const clientPackageConfig = JSON.parse(readFileSync("./client/package.json"))
    clientPackageConfig.version = "v" + newVersion
    writeFileSync("./client/package.json", JSON.stringify(clientPackageConfig, undefined, 4))
    restoreOperations.push(() => {
        clientPackageConfig.version = "v" + version
        writeFileSync("./client/package.json", JSON.stringify(clientPackageConfig, undefined, 4))
    })
    //   ./client/package-lock.json
    const clientPackageLockConfig = JSON.parse(readFileSync("./client/package-lock.json"))
    clientPackageLockConfig.version = "v" + newVersion
    clientPackageLockConfig.packages[""].version = "v" + newVersion
    writeFileSync("./client/package-lock.json", JSON.stringify(clientPackageLockConfig, undefined, 4))
    restoreOperations.push(() => {
        clientPackageLockConfig.version = "v" + version
        clientPackageLockConfig.packages[""].version = "v" + version
        writeFileSync("./client/package-lock.json", JSON.stringify(clientPackageLockConfig, undefined, 4))
    })
    //   ./server/system/const.ts
    const constFile = readFileSync("./server/system/const.ts", { encoding: "utf8" })
    writeFileSync("./server/system/const.ts", constFile.replace(/(?<=pluginVersion = ")[^"]+/, versionNumeric.join(".")), { encoding: "utf8" })
    restoreOperations.push(() => writeFileSync("./server/system/const.ts", constFile, { encoding: "utf8" }))
    //   ./README.md
    const readme = readFileSync("./README.md", { encoding: "utf8" })
    writeFileSync("./README.md", readme.replaceAll(/(?<=Plugin Version: \*\*v)[^\*]+/g, newVersion), { encoding: "utf8" })
    restoreOperations.push(() => writeFileSync("./README.md", readme, { encoding: "utf8" }))
    //   ./CHANGELOG.md
    const changelog = readFileSync("./CHANGELOG.md", { encoding: "utf8" })
    writeFileSync("./CHANGELOG.md", "- v" + newVersion + "\r\n\r\n" + "  _TODO: Discription to be added._\r\n\r\n" + changelog, { encoding: "utf8" })

    log(`👌 Repository was updated to match the new version.`)
} catch {
    log("😕 Update project failed, please try update again.")
    for (const op of restoreOperations) op()
    log("🔵 All modified files restored.")
    process.exit(-1)
}