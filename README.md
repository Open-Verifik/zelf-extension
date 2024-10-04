# Zelf Wallet (Web Extension)

The **Zelf Wallet** is a secure, privacy-focused web extension designed for seamless interaction with cryptocurrencies. The standout feature of the Zelf Wallet is its **ZelfProofs** technology, which ensures user privacy and security while enabling cryptographic functions such as proof of personhood, encryption, and passwordless login.

## What are ZelfProofs?

**ZelfProofs** are unique, privacy-preserving digital signatures that ensure secure, non-biometric verification of user identity. Here's how they work:

1. **Face-Based Data Generation:**
   - ZelfProofs utilize a user's face to create a unique digital signature. Unlike traditional biometric systems, ZelfProofs do **not store any biometric data** such as facial images or patterns.
   - Instead, they convert face data into a **privacy-preserving, non-biometric binary representation** called a **ZelfProof**. This ensures that no personal biometric information is stored or shared.

2. **Optional Metadata and Password Integration:**
   - Users have the option to enhance security by adding metadata or a password during the creation of a ZelfProof. This optional layer adds additional entropy to the digital signature, making it even more resistant to tampering or unauthorized access.
  
3. **Public Key Generation for Cryptographic Use:**
   - During the creation of a ZelfProof, the system generates a **public key** that can be used for various cryptographic functions, including encryption and decryption of information, digital signatures, and secure document management.
   - The public key is linked to the ZelfProof, making it uniquely verifiable and ensuring that sensitive data is handled securely.

4. **Proof of Personhood:**
   - One of the most powerful applications of ZelfProofs is **proof of personhood**, which allows users to verify their identity without exposing any personal data.
   - This is crucial for privacy-sensitive applications like decentralized finance (DeFi) platforms, online voting systems, or any other scenario where proving identity is required without compromising privacy.

5. **Passwordless Authentication:**
   - ZelfProofs support **passwordless login**, offering users the convenience of signing into apps or websites without needing to remember traditional passwords. By leveraging the generated ZelfProof, users can authenticate securely and privately.

6. **Offline and Online Usability:**
   - ZelfProofs can be generated and used in both **online** and **offline** scenarios. Users can create **QR codes** based on their ZelfProof, which can be scanned and validated even without internet connectivity.
   - This functionality makes Zelf Wallet incredibly versatile, as it enables users to manage their identity and access services regardless of network availability.

7. **Cross-Platform Integration:**
   - The **Zelf Wallet** and **ZelfProofs** are designed to work across various platforms, including **Android**, **iOS**, and **Web Extensions**, ensuring a seamless and consistent experience for all users.
   - Since ZelfProofs do not rely on centralized databases or cloud storage, users retain full control over their identity and private data, making this solution highly secure and scalable.

8. **No Centralized Databases:**
   - ZelfProofs eliminate the need for centralized databases, thus removing a common point of vulnerability. All critical information is either encrypted or handled locally on the user’s device, with no external server ever storing sensitive data.

By utilizing cutting-edge cryptographic techniques, ZelfProofs create a trustless, decentralized verification system that gives users full control over their digital identity while ensuring maximum privacy and security.

---

## Getting Started

Follow the instructions below to set up and run the project locally.

### Development Server

To start a local development server:

1. Install dependencies:
    ```bash
    npm install
    ```

2. Run the development server:
    ```bash
    ng serve
    ```

3. Open your browser and navigate to `http://localhost:4200/`.  
   The application will automatically reload whenever source files are changed.

### Node.js Version Switching for macOS Users

If you're using macOS and need to switch to **Node.js v20**, follow these steps:

1. Source your bash profile:
    ```bash
    source ~/.bashrc
    ```

2. Load NVM (Node Version Manager):
    ```bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    ```

3. Switch to Node.js version 20:
    ```bash
    nvm use 20
    ```

### Build the Project

To create a production build of the Zelf Wallet extension:

1. Run the build command:
    ```bash
    ng build --output-path=dist
    ```

2. After the build completes, the artifacts will be located in the `dist/` directory.

3. **Post-Build Step**:  
   To finalize the build, update the `index.html` file in the `dist/` folder to include the necessary CSS files for proper styling.
