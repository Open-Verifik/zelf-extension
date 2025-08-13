const fs = require("fs");
const path = require("path");

const syncVersions = () => {
    const packagePath = path.join(__dirname, "../package.json");
    const manifestChromePath = path.join(__dirname, "../configurations/extension/chrome/manifest.json");
    const manifestFirefoxPath = path.join(__dirname, "../configurations/extension/firefox/manifest.json");

    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    const newVersion = packageJson.version;

    console.log(`Syncing version ${newVersion} across all files`);

    const manifestChrome = JSON.parse(fs.readFileSync(manifestChromePath, "utf8"));
    const manifestFirefox = JSON.parse(fs.readFileSync(manifestFirefoxPath, "utf8"));

    manifestChrome.version = newVersion;
    manifestFirefox.version = newVersion;

    fs.writeFileSync(manifestChromePath, JSON.stringify(manifestChrome, null, 4));
    fs.writeFileSync(manifestFirefoxPath, JSON.stringify(manifestFirefox, null, 4));

    console.log(`Versions synced to ${newVersion}`);
};

syncVersions();
