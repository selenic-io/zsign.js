# zsignjs

zsignjs is a JavaScript wrapper for the zsign binary, which allows you to sign iOS packages (.ipa files) with various signing options. This module determines the correct zsign binary for your operating system and architecture and provides functions to interact with it. This means you can sign IPA files inside NodeJS, this could also be used to make an ipa-signing server.

## Support

| Support | OS Type | Arch  |
| ------- | ------- | ----- |
| ✅      | MacOS   | arm64 |
| 🚫      | MacOS   | x64   |
| 🚫      | Windows | arm64 |
| 🚫      | Windows | x64   |
| ✅      | Linux   | arm64 |
| ✅      | Linux   | x64   |

More binaries will be included in the future - dont worry :3


## Installation

1. Clone the repository:

```bash
git clone https://github.com/selenic-io/zsign.js.git
```

2. Install the necessary dependencies:

```bash
npm install
```

## Usage

### Importing the module

```javascript
import { zsign } from 'zsignjs';
```

### Checking version

```javascript
zsign.getVersion((error, result) => {
    if (error) {
        console.error('Error:', error);
    } else {
        let zsignVersion = result.split(" ")[1].trim();
        console.log('v:', zsignVersion);
    }
});
```

### Signing a package

```javascript
zsign.sign("<Path to input IPA / .app bundle>", {
    pkey: "<path to .p12 cert>",
    prov: "<path to .mobileprovision file>",
    password: "<password to .p12 cert>",
    output: '<output ipa file>'
}, (error, result) => {
    if (error) {
        console.error("Error:", error);
    } else {
        console.log(result);
    }
});
```

## API

### zsign.showHelp(callback)

Prints help information.

#### Parameters
- `callback` (Function): The callback function to execute after displaying help.

### zsign.getVersion(callback)

Prints version information of the zsign binary.

#### Parameters
- `callback` (Function): The callback function to execute after getting the version.

### zsign.sign(inputPackage, options, callback)

Signs an iOS package with the given options.

#### Parameters
- `inputPackage` (string): The path to the package to be signed.
- `options` (Object): The signing options.
  - `pkey` (string): The private key for signing. **Required**
  - `prov` (string): The provisioning profile. **Required**
  - `cert` (string): The certificate for signing. **Required**
  - `password` (string): The password for the private key. **Required**
  - `output` (string): The output path for the signed package.
  - `debug` (boolean): Enable debug mode.
  - `force` (boolean): Force sign without cache when signing a folder.
  - `bundle_id` (string): The bundle identifier.
  - `bundle_name` (string): The bundle name.
  - `bundle_version` (string): The bundle version.
  - `entitlements` (string): The entitlements file.
  - `zip_level` (number): The compression level for the zip.
  - `dylib` (string): Path to the dynamic library to inject, if any.
  - `weak` (boolean): Mark the dylib as weak.
  - `install` (boolean): Install the package after signing.
  - `quiet` (boolean): Suppress output.
- `callback` (Function): The callback function to execute after signing.

## Example

Sign testIpa.ipa with mobileprovision, p12 cert, and password, then output it as signed.ipa

```javascript
import { zsign } from 'zsignjs';

zsign.sign("./testIpa.ipa", {
    pkey: "./test.p12",
    prov: "./test.mobileprovision",
    password: "test",
    zip_level: 9,
    output: './signed.ipa'
}, (error, result) => {
    if (error) {
        console.error("Error:", error);
    } else {
        console.log(result);
    }
});
```

Print version info

```javascript
zsign.getVersion((error, result) => {
    if (error) {
        console.error('Error:', error);
    } else {
        let zsignVersion = result.split(" ")[1].trim();
        console.log('v:', zsignVersion);
    }
});
```

# TODO

## Features

### 1. Functionality to unzip IPA file before signing to speed up signing process
- **Description**: Implement a process to unzip the IPA file before signing. This can improve the speed of the signing process by allowing direct access to the app's files.
- **Steps**:
  - Add a method to unzip the IPA file to a temporary directory.
  - Modify the `sign` function to operate on the unzipped contents.
  - Rezip the contents back into an IPA file after signing.

### 2. Functionality to remove .mobileprovision from signed app
- **Description**: Implement functionality to remove the `.mobileprovision` file from inside the signed app. This can help in cases where the provisioning profile should not be included in the final signed package.
- **Steps**:
  - After signing, locate the `.mobileprovision` file within the unzipped contents.
  - Remove the `.mobileprovision` file.
  - Rezip the contents back into an IPA file.

### 3. Functionality to extract info from IPA
- **Description**: Add a feature to extract metadata from the IPA file such as app name, icon, bundle ID, etc.
- **Steps**:
  - Unzip the IPA file.
  - Read the `Info.plist` file and other relevant files.
  - Extract required information like app name, icon, bundle ID, etc.
  - Provide a method to return this information in a structured format.

## Codebase Improvement

### 4. Rewrite most of the codebase, implement classes for everything to handle data objects & structures better inside Node.js
- **Description**: Refactor the codebase to use classes, which will help in organizing the code better and managing data objects and structures more efficiently.
- **Steps**:
  - Identify and define classes for different components (e.g., `ZSign`, `IPAFile`, `ProvisioningProfile`, etc.).
  - Refactor existing functions to methods within these classes.
  - Ensure proper encapsulation and modularity.
  - Update the existing code to use the new class-based structure.

---

By implementing these features and improvements, we aim to enhance the functionality, performance, and maintainability of the zsignjs project.

## License

This project is licensed under the MIT License.

---

**Note:** Ensure that you have the appropriate zsign binary for your OS and architecture in the `./bin/` directory. If the binary is not found, the module will throw an error.