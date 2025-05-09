const secp256k1 = require("@bitcoinerlab/secp256k1");
const { BIP32Factory } = require("bip32");
const bip39 = require("bip39");
const bitcoin = require("bitcoinjs-lib");
const { ECPairFactory } = require("ecpair");

const ECPair = ECPairFactory(secp256k1);

const _getAddressType = (address) => {
    if (address.startsWith("bc1")) {
        return "segwit";
    } else if (address.startsWith("tb1")) {
        return "testnet";
    } else if (address.startsWith("1")) {
        return "legacy";
    }

    throw new Error("Unsupported address type");
};

const _getPrivateKey = (seed, path) => {
    const root = BIP32Factory(secp256k1).fromSeed(seed);
    const child = root.derivePath(path);

    return ECPair.fromPrivateKey(child.privateKey);
};

const createBitcoinTransaction = async (sourceAddress, mnemonic, targetAddress) => {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const quicknodeUrl = "https://little-old-model.btc-testnet.quiknode.pro/bc869f0ab39ee934fa4369cb0c83254639c08ae7/";
    const addressType = _getAddressType(sourceAddress);

    let path;

    switch (addressType) {
        case "segwit":
            path = "m/84'/0'/0'/0/0";
            break;
        case "testnet":
            path = "m/84'/1'/0'/0/0";
            break;
        case "legacy":
            path = "m/44'/0'/0'/0/0";
            break;
        default:
            throw new Error("Unsupported address type");
    }

    const keyPair = _getPrivateKey(seed, path);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "blockchain.address.listunspent",
        params: [sourceAddress],
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
        maxBodyLength: Infinity,
    };

    const response = await fetch(quicknodeUrl, requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error("error", error));

    // const txb = new bitcoin.Psbt({ network: bitcoin.networks.testnet });

    // txb.setVersion(2);
    // txb.setLocktime(0);

    // // Add inputs from UTXOs
    // let totalAmount = 0;

    // utxos.forEach((utxo) => {
    //     txb.addInput({
    //         hash: utxo.txid,
    //         index: utxo.vout,
    //     });

    //     totalAmount += utxo.value;
    // });

    // // Calculate fee (example fee rate: 10 sat/byte)
    // const feeRate = 10;
    // const estimatedSize = utxos.length * 180 + 34 * 2 + 10;
    // const fee = estimatedSize * feeRate;

    // // Add outputs
    // const amountToSend = totalAmount - fee;

    // txb.addOutput({
    //     address: targetAddress,
    //     value: amountToSend,
    // });

    // // Sign inputs
    // utxos.forEach((utxo, index) => {
    //     const signer = {
    //         publicKey: keyPair.publicKey,
    //         sign: (hash) => keyPair.sign(hash),
    //     };

    //     txb.signInput(index, signer, [utxo.value]);
    // });

    // // Build and get raw transaction
    // const rawTx = txb.finalizeAllInputs().extractTransaction().toHex();

    // // Broadcast transaction
    // const broadcastResponse = await fetch(quicknodeUrl, {
    //     jsonrpc: "2.0",
    //     id: 1,
    //     method: "blockchain.transaction.broadcast",
    //     params: [rawTx],
    // });

    // broadcastResponse.data;
    // console.log(` createBitcoinTransaction ~ broadcastResponse.data:`, broadcastResponse.data);
};

createBitcoinTransaction(
    "tb1phkg7rlfp8d6zkk699rlacnwyuc9g2jh02ehscztncuew4c4y5mkstxw2c9",
    "denial awful modify approve slow live arctic melt during render tomato bubble",
    "tb1qlj64u6fqutr0xue85kl55fx0gt4m4urun25p7q"
);
