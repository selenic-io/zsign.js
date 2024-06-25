import { exec } from 'child_process'
import { arch, type } from 'os'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'

// funny debug variable
let debug = true;

// Get os type & arch to find out which binary to use.
let bin = "./bin/zsign_"

switch (type()) {
    case "Linux":
        bin += "linux_"
        break;
    case "Darwin":
        bin += "macos_"
        break;
    case "Windows_NT" || "Windows":
        bin += "win_"
        break;
    default:
        throw new Error("OS Type not supported: We don't have a binary for zsign for your OS.")
}

switch (arch()) {
    case "arm64":
        bin += "arm64"
        break;
    case "x64":
        bin += "x64"
        break;
    default:
        throw new Error("Arch not supported: We don't have a binary for zsign for your arch.")
}

// If we don't have a binary for the current os/arch combination, throw an error.
if(!existsSync(bin)) throw new Error("Binary not found: We don't have a binary for zsign for your OS/arch combination.")

// Handles running the zsign binary.
const runCommand = (args, callback) => {
    // if debug, print out the bin string.
    if(debug) console.log("[zsignjs] Binary:", bin)

    // construct and run the command, and then pass the output to the provided callback function.
    const cmd = `${bin} ${args.join(' ')}`;
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            callback(error, null);
            return;
        }
        callback(null, stdout || stderr);
    });
};

// zsign object
export const zsign = {
    /**
     * Prints help, Not really useful except for CLI usage cases.
     * @param {Function} callback 
     */
    showHelp: (callback) => {
        runCommand(['--help'], callback);
    },
    /**
     * Prints out version information
     * @param {Function} callback 
     */
    getVersion: (callback) => {
        runCommand(['-v'], callback);
    },
    /**
     * Signs a package with the given options.
     *
     * @param {string} inputPackage - The package to be signed.
     * @param {Object} [options={}] - The signing options. REQUIRED
     * @param {string} [options.pkey] - The private key for signing. REQUIRED
     * @param {string} [options.prov] - The provisioning profile. REQUIRED
     * @param {string} [options.cert] - The certificate for signing. REQUIRED
     * @param {boolean} [options.debug] - Enable debug mode.
     * @param {boolean} [options.force] - Force sign without cache when signing folder.
     * @param {string} [options.output] - The output path for the signed package.
     * @param {string} [options.password] - The password for the private key. REQUIRED
     * @param {string} [options.bundle_id] - The bundle identifier.
     * @param {string} [options.bundle_name] - The bundle name.
     * @param {string} [options.bundle_version] - The bundle version.
     * @param {string} [options.entitlements] - The entitlements file.
     * @param {number} [options.zip_level] - The compression level for the zip.
     * @param {string} [options.dylib] - Path to the dynamic library to inject if any.
     * @param {boolean} [options.weak] - Mark the dylib as weak.
     * @param {boolean} [options.install] - Install the package after signing.
     * @param {boolean} [options.quiet] - Suppress output.
     * @param {Function} callback - The callback function to execute after signing.
     */
    sign: (inputPackage, options = {}, callback) => {
        const args = []
        if (options.pkey) args.push('--pkey', options.pkey);
        if (options.prov) args.push('--prov', options.prov);
        if (options.cert) args.push('--cert', options.cert);
        if (options.debug) args.push('--debug');
        if (options.force) args.push('--force');
        if (options.output) args.push('--output', options.output);
        if (options.password) args.push('--password', options.password);
        if (options.bundle_id) args.push('--bundle_id', options.bundle_id);
        if (options.bundle_name) args.push('--bundle_name', options.bundle_name);
        if (options.bundle_version) args.push('--bundle_version', options.bundle_version);
        if (options.entitlements) args.push('--entitlements', options.entitlements);
        if (options.zip_level !== undefined) args.push('--zip_level', options.zip_level);
        if (options.dylib) args.push('--dylib', options.dylib);
        if (options.weak) args.push('--weak');
        if (options.install) args.push('--install');
        if (options.quiet) args.push('--quiet');

        args.push(inputPackage)
        runCommand(args, callback);
    }
}

/* Example usage

Sign testIpa.ipa with mobileprovision, p12 cert, and password - and output it as signed.ipa
zsign.sign("./testIpa.ipa", {
    pkey: "./test.p12",
    prov: "./test.mobileprovision",
    password: "test",
    zip_level: 9,
    output: './signed.ipa'
}, (error, result) => {
    if (error) {
        console.error("Error:", error)
    } else {
        console.log(result)
    }
})

Print version info :)
zsign.getVersion((error, result) => {
    if (error) {
        console.error('Error:', error);
    } else {
        let zsignVersion = result.split(" ")[1].trim()
        console.log('v:', zsignVersion);
    }
})
    */