// import { WanBridge, Wallet } from 'wanchain-cross-sdk'

$(function() {
    selectChainA();
    selectChainB();
    approval();
    // wanBridge();
});

// chainA 下拉选择框
function selectChainA() {
    // _selected保存选择内容
    var _selected;
    _selected = $('#selectChainABtn').text();
    $('#selectChainA').on('click', '.chainA', function() {
        $(this).parent().siblings('button').text($(this).text());
        _selected = $(this).parent().siblings('button').text();
        console.log(_selected);
    });
}

// chainB 下拉选择框
function selectChainB() {
    // _selected保存选择内容
    var _selected;
    _selected = $('#selectChainBBtn').text();
    $('#selectChainB').on('click', '.chainB', function() {
        $(this).parent().siblings('button').text($(this).text());
        _selected = $(this).parent().siblings('button').text();
        console.log(_selected);
    });
}

//approval 按钮
function approval() {
    $('#approval').on('click', function() {
        console.log('approval');
        // wanBridge();
    });
}

// function wanBridge() {
//     let bridge = new WanBridge("testnet"); // testnet or mainnet
//     bridge.on("ready", assetPairs => {
//         /* the bridge is initialized successfully and is ready for cross-chain, you can filter assetPairs by asset and chain type as needed.
//           assetPairs example: [
//             {
//               assetPairId: "39",
//               assetType: "AVAX",
//               decimals: "18",
//               fromChainName: "Avalanche C-Chain",
//               fromChainType: "AVAX",
//               fromSymbol: "AVAX",
//               toChainName: "Wanchain",
//               toChainType: "WAN",
//               toSymbol: "wanAVAX"
//             },
//             ......
//           ]
//         */
//         assetPairs = [{
//             assetPairId: "39",
//             assetType: "WAN",
//             decimals: "18",
//             fromChainName: "WAN",
//             fromChainType: "Wanchain",
//             fromSymbol: "WAN",
//             toChainName: "Wanchain",
//             toChainType: "WAN",
//             toSymbol: "WAN"
//         }]
//     }).on("error", info => {
//         /* failed to initialize the bridge, or cross-chain task failed.
//           error info structure: {
//             taskId, // optional, only task error info has taskId field
//             reason
//           }
//           a task error info may includes the following reason:
//           "Invalid wallet"
//           "Failed to send transaction"
//           "Rejected"
//           "Insufficient ERC20 token allowance"
//           "Failed to generate transaction data"
//           "Insufficient balance"
//           "Repeated approval of erc20 tokens"
//           "Failed to approve ERC20 token"
//           "Failed to generate ota"
//           "Transaction failed"
//           "Amount is too small to pay the fee"
//           "Waiting for locking asset timeout"
//           "Please contact the Wanchain Foundation (techsupport@wanchain.org)"
//         */
//     }).on("ota", info => {
//         /* the one-time-addess is generated to receive BTC, LTC or XRP.
//           ota info structure: {
//             taskId,
//             address:, // BTC/LTC ota address, or XRP xAddress
//             rAddress, // optional, XRP rAddress
//             tagId     // optional, XRP tag ID
//           }
//         */
//     }).on("lock", info => {
//         /* the lock transaction hash
//           lock info structure: {
//             taskId,
//             txHash
//           }
//         */
//     }).on("redeem", info => {
//         /* the redeem transaction hash, indicates that the cross-chain task is finished.
//           redeem info structure: {
//             taskId,
//             txHash
//           }
//         */
//     });
//     let iwanAuth = {
//         apiKey: "your-api-key",
//         secretKey: "your-secret-key"
//     };

//     bridge.init(iwanAuth);
//     let metaMaskWallet = new Web3(web3.currentProvider);

//     try {
//         // select a asset pair from assetPairs, and choose "mint" or "brun" direction
//         // each asset pair contains fromChain and toChain, if the asset is converted from fromChain to toChain, the direction is "mint", otherwise, the direction is "burn"
//         let assetPair = assetPairs[0];

//         // create a wallet according fromChain of assetPair, the wallet type can be "MetaMask", "WanMask", "WalletConnect", "WanWallet" or "polkadot{.js}" for browser, and "TruffleHD" for Node.js.
//         // no need to create this wallet when converting assets from Bitcoin, Litecoin or XRP Ledger
//         let wallet = new Wallet("MetaMask", metaMaskWallet);

//         // check wallet network
//         let checkWallet = await bridge.checkWallet(assetPair, "mint", wallet);
//         if (checkWallet === false) {
//             throw "Invalid wallet or network";
//         }

//         // for polkadot, you can call wallet.getAccounts(network) to get all accounts and then select one as fromAccount
//         let fromAccount = "sender-address-on-from-chain";

//         // input toAccount and amount manully
//         let toAccount = 'receiver-address-on-to-chain';
//         let amount = new BigNumber(0.1);

//         // check to-address format
//         let validTo = bridge.validateToAccount(assetPair, "mint", toAccount);
//         if (validTo === false) {
//             throw "Invalid to-address";
//         }

//         // check asset balance
//         let balance = await bridge.getAccountAsset(assetPair, "mint", fromAccount);
//         if (amount.gt(balance)) {
//             throw "Insufficient balance";
//         }

//         // check storeman group quota
//         let quota = await bridge.getQuota(assetPair, "mint");
//         if (amount.lt(quota.minQuota)) {
//             throw "Less than minQuota";
//         } else if (amount.gt(quota.maxQuota)) {
//             throw "Exceed maxQuota";
//         }

//         // if the user accepts the fee, create a task
//         let fee = await bridge.estimateFee(assetPair, "mint");

//         // create a task
//         let task = await bridge.createTask(assetPair, 'mint', amount, fromAccount, toAccount, wallet);
//     } catch (err) {
//         console.error(err);
//         /* createTask will check the task context and may throw the following error:
//           "Invalid fromAccount"
//           "Missing fromAccount"
//           "Invalid toAccount"
//           "Missing wallet"
//           "Invalid wallet"
//           "Amount is too small to pay the fee"
//           "Smg unavailable"
//           "Less than minQuota"
//           "Exceed maxQuota"
//           "Amount is too small to activate smg"
//           "Insufficient balance"
//           "Amount is too small to activate toAccount"
//           "Insufficient gas"
//           "Insufficient asset"
//           "Unknown error"
//         */
//     }
// }