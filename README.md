# DEMO
[![Watch the DEMO](https://img.youtube.com/vi/uNvTD_X4lP0/0.jpg)](https://www.youtube.com/watch?v=uNvTD_X4lP0)


https://name.zelf.world


# Zelf Wallet (Web Extension)

The **Zelf Wallet** is a secure, privacy-focused web extension designed for seamless interaction with cryptocurrencies. The standout feature of the Zelf Wallet is its **ZelfProofs** technology, which ensures user privacy and security while enabling cryptographic functions such as proof of personhood, encryption, and passwordless login.

## Documentation
For extensive documentation, check the following url https://docs.zelf.world

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

## IPFS Integration: Upload and Query

In addition to ZelfProofs, the **Zelf Wallet** integrates with **IPFS** (InterPlanetary File System) for decentralized file storage. Below are the details on how to upload files and query them using IPFS.

### Uploading Files to IPFS

You can upload files (e.g., images) to IPFS via a POST request. The process also supports attaching metadata such as Ethereum and Solana addresses, email, and zelfName.

#### Example Request (Upload to IPFS)

Here’s a sample POST request for uploading files to IPFS, including metadata:

```json
POST https://api.zelf.world/api/ipfs

{
  "base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...", 
  "name": "johan.zelf",
  "metadata": {
    "ethAddress": "0x3308f60b92915a8764b60342938a9D8406d288BE",
    "solanaAddress": "JA6WkAYuA5FZb9nkFrBSprRMF6suMQvBEepQFFWV",
    "email": "johan@verifik.co",
    "zelfName": "johan.zelf"
  },
  "pinIt": true
}
```

In this request:
- The **base64** field contains the image file encoded in base64 format.
- The **metadata** includes Ethereum and Solana addresses, email, and a zelfName.
- The **pinIt** field ensures the file is pinned to IPFS, keeping it available long-term.

#### Response

The response will contain the following information, including the IPFS URL and metadata:

```json
{
  "data": {
    "url": "https://blush-selective-earwig-920.mypinata.cloud/ipfs/<IPFS_HASH>",
    "IpfsHash": "<IPFS_HASH>",
    "PinSize": 16241,
    "Timestamp": "2024-10-03T21:07:19.212Z",
    "pinned": true,
    "web3": true,
    "name": "johan.zelf",
    "metadata": {
      "ethAddress": "0x3308f60b92915a8764b60342938a9D8406d288BE",
      "solanaAddress": "JA6WkAYuA5FZb9nkFrBSprRMF6suMQvBEepQFFWV",
      "email": "johan@verifik.co",
      "zelfName": "johan.zelf"
    }
  }
}
```

### Querying Files from IPFS

You can retrieve files and metadata stored in IPFS using the **GET** method. Below is an example query to search for a file by zelfName.

#### Example Request (Query by zelfName)

```json
GET https://api.zelf.world/api/ipfs?key=zelfName&value=johan.zelf
```

#### Response

The response will return details of the pinned file, including metadata:

```json
{
  "data": [
    {
      "id": "5631d85b-e86-4558-82de-373caa76475b",
      "ipfs_pin_hash": "<IPFS_HASH>",
      "size": 16241,
      "user_id": "622f63b9-c03d-4702-9679-5d1409ae5e20",
      "date_pinned": "2024-10-03T21:07:19.212Z",
      "metadata": {
        "name": "johan.zelf",
        "keyvalues": {
          "email": "johan@verifik.co",
          "zelfName": "johan.zelf",
          "ethAddress": "0x3308f60b92915a8764b60342938a9D8406d288BE",
          "solanaAddress": "JA6WkAYuA5FZb9nkFrBSprRMF6suMQvBEepQFFWV"
        }
      }
    }
  ]
}
```

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
