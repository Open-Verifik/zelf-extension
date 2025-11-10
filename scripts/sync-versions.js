const fs = require("fs");
const path = require("path");

const syncVersions = () => {
    const packagePath = path.join(__dirname, "../package.json");
    const manifestChromePath = path.join(__dirname, "../configurations/manifest.json");

    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    const newVersion = packageJson.version;

    console.log(`Syncing version ${newVersion} across all files`);

    const manifestChrome = JSON.parse(fs.readFileSync(manifestChromePath, "utf8"));

    manifestChrome.version = newVersion;

    fs.writeFileSync(manifestChromePath, JSON.stringify(manifestChrome, null, 4));

    console.log(`Versions synced to ${newVersion}`);
};

syncVersions();
