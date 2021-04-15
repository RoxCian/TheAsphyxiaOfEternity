$version = (Select-String -Path README.md -Pattern "(?<=Plugin Version: \*\*v)\d+\.\d+\.\d+(-.*)?(?=\*\*)").Matches.Value
if ((Select-String -Path handlers\utility\initialize.ts -Pattern "(?<=currentVersion *: *string = "")\d+\.\d+\.\d+").Matches.Value -ne $version.Split("-")[0]) {
    throw "The versions of readme and initializer are inconsistent."
}
Get-ChildItem dist\rb | Remove-Item -Recurse
$conditions = [System.Collections.ArrayList]@()
[System.IO.File]::ReadLines(".pack") | ForEach-Object {
    if ((!$_.StartsWith("#")) -and ($_.Trim() -ne "")) {
        $conditions.Add($_)
    }
}
Get-ChildItem -Exclude $conditions | ForEach-Object {
    if ($_.Name.Trim() -eq "") {
        continue
    }
    $path = Resolve-Path $_.FullName -Relative
    Copy-Item $_ "dist\rb\$path" -Force -Recurse
}
((Get-Content -Path README.md -Raw) -replace "src="".+""", "src=""icon.svg""") | Set-Content -Path README.md     
((Get-Content -Path package.json -Raw) -replace "(?<=""version"": ""v)\d+\.\d+\.\d+(-.+)?(?="")", "$version") | Set-Content -Path package.json

$compress = @{
    Path             = "dist\rb"
    CompressionLevel = "Optimal"
    DestinationPath  = "the-asphyxia-of-eternity-$version.zip"
}
Compress-Archive @compress -Force
