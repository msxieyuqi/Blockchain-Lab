import { WanBridge, Wallet } from 'wanchain-cross-sdk';
let BigNumber = require('bignumber.js');
let WebSocket = require("ws");
let ApiInstance = require('iwan-sdk');
let Web3 = require('web3');

$(function() {
    selectChainA();
    selectChainB();
    approval();
    detectMetaMask();
    connectWallet();
    getAccountInfo();
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
        console.log('approval', currentAccount);
        wanBridge(currentAccount);
    });
}

async function wanBridge(account) {
    // let YourApiKey = "e14c279643f6140ebb84aff95117630fc456a95469eb3b5bf6ba621c7f10c40e";
    // let YourSecretKey = "53509cc5067f314330abf6952077e0d601efbe5473d7f777724d4669a917bf2c";
    console.log(account);
    let bridge = new WanBridge("testnet"); // testnet or mainnet
    var assetPairs = [{
        assetPairId: "1",
        assetType: "ETH",
        decimals: "18",
        toChainName: "Wanchain",
        toChainType: "WAN",
        toSymbol: "wanETH",
        fromChainName: "Ethereum",
        fromChainType: "ETH",
        fromSymbol: "ETH",
    }]
    bridge.on("ready", assetPairs => {
        /* the bridge is initialized successfully and is ready for cross-chain, you can filter assetPairs by asset and chain type as needed.
          assetPairs example: [
            {
              assetPairId: "39",
              assetType: "AVAX",
              decimals: "18",
              fromChainName: "Avalanche C-Chain",
              fromChainType: "AVAX",
              fromSymbol: "AVAX",
              toChainName: "Wanchain",
              toChainType: "WAN",
              toSymbol: "wanAVAX"
            },
            ......
          ]
        */
        // assetPairs = [{
        //     assetPairId: "1",
        //     assetType: "ETH",
        //     decimals: "18",
        //     toChainName: "Wanchain",
        //     toChainType: "WAN",
        //     toSymbol: "wanETH",
        //     fromChainName: "Ethereum",
        //     fromChainType: "ETH",
        //     fromSymbol: "ETH",
        // }]
    }).on("error", info => {
        /* failed to initialize the bridge, or cross-chain task failed.
          error info structure: {
            taskId, // optional, only task error info has taskId field
            reason
          }
          a task error info may includes the following reason:
          "Invalid wallet"
          "Failed to send transaction"
          "Rejected"
          "Insufficient ERC20 token allowance"
          "Failed to generate transaction data"
          "Insufficient balance"
          "Repeated approval of erc20 tokens"
          "Failed to approve ERC20 token"
          "Failed to generate ota"
          "Transaction failed"
          "Amount is too small to pay the fee"
          "Waiting for locking asset timeout"
          "Please contact the Wanchain Foundation (techsupport@wanchain.org)"
        */
    }).on("ota", info => {
        /* the one-time-addess is generated to receive BTC, LTC or XRP.
          ota info structure: {
            taskId,
            address:, // BTC/LTC ota address, or XRP xAddress
            rAddress, // optional, XRP rAddress
            tagId     // optional, XRP tag ID
          }
        */
    }).on("lock", info => {
        /* the lock transaction hash
          lock info structure: {
            taskId,
            txHash
          }
        */
    }).on("redeem", info => {
        /* the redeem transaction hash, indicates that the cross-chain task is finished.
          redeem info structure: {
            taskId,
            txHash
          }
        */
    });
    var iwanAuth = {
        apiKey: "e14c279643f6140ebb84aff95117630fc456a95469eb3b5bf6ba621c7f10c40e",
        secretKey: "53509cc5067f314330abf6952077e0d601efbe5473d7f777724d4669a917bf2c"
    };

    let initBridge = await bridge.init(iwanAuth);
    let metaMaskWallet = window.ethereum;
    console.log('bridge init success');
    try {
        let assetPair = assetPairs[0];
        console.log(assetPair);
        // create a wallet according fromChain of assetPair, the wallet type can be "MetaMask", "WanMask", "WalletConnect", "WanWallet" or "polkadot{.js}" for browser, and "TruffleHD" for Node.js.
        // no need to create this wallet when converting assets from Bitcoin, Litecoin or XRP Ledger
        let wallet = new Wallet("MetaMask", metaMaskWallet);
        console.log(wallet);
        // check wallet network
        // failed at here!!!     13/06
        // success  13/06
        let checkWallet = await bridge.checkWallet(assetPair, "mint", wallet);
        console.log(checkWallet);

        if (checkWallet === false) {
            throw "Invalid wallet or network";
        } else {
            console.log('check wallet success --valid');
        }

        // for polkadot, you can call wallet.getAccounts(network) to get all accounts and then select one as fromAccount
        let fromAccount = "0xFe919542d70985375Aa84e4d143105255430A245";

        // input toAccount and amount manully
        let toAccount = "0x8590cbC51F1e0A6B2A7265359162b0DCEF8F0da9"; //my moblie metamask
        let amount = new BigNumber(0.01);
        console.log(fromAccount, toAccount, 'get/set account success');

        // check to-address format
        let validTo = bridge.validateToAccount(assetPair, "mint", toAccount);
        if (validTo === false) {
            throw "Invalid to-address";
        }

        // check asset balance
        // failed here!!!!
        // balance = 0 ????
        // console.log(assetPair);
        let balance = await bridge.getAccountAsset(assetPair, "mint", fromAccount).then(function(result) { console.log(result) });
        if (amount.gt(balance)) {
            throw "Insufficient balance";
        } else {
            console.log('balance:', balance);
        }

        // check storeman group quota
        let quota = await bridge.getQuota(assetPair, "mint");
        if (amount.lt(quota.minQuota)) {
            throw "Less than minQuota";
        } else if (amount.gt(quota.maxQuota)) {
            throw "Exceed maxQuota";
        }

        // if the user accepts the fee, create a task
        let fee = await bridge.estimateFee(assetPair, "mint");

        // create a task
        let task = await bridge.createTask(assetPair, "mint", amount, fromAccount, toAccount, wallet);
    } catch (err) {
        console.error(err);
        /* createTask will check the task context and may throw the following error:
          "Invalid fromAccount"
          "Missing fromAccount"
          "Invalid toAccount"
          "Missing wallet"
          "Invalid wallet"
          "Amount is too small to pay the fee"
          "Smg unavailable"
          "Less than minQuota"
          "Exceed maxQuota"
          "Amount is too small to activate smg"
          "Insufficient balance"
          "Amount is too small to activate toAccount"
          "Insufficient gas"
          "Insufficient asset"
          "Unknown error"
        */
    }

}

// 检测MetaMask
function detectMetaMask() {
    var web3 = window.web3;
    if (window.ethereum && window.ethereum.isMetaMask) {
        web3 = new Web3(web3.currentProvider);
        console.log(web3.currentProvider);
    } else {
        console.log('Please install MetaMask!');
        // web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    }
}

//监测钱包 isConnected
function isConnected() {
    $('#connectWallet').attr('style', 'display: none');
    $('#connectSuccessful').attr('style', 'display: block');
}

//监测钱包 is disConnected
function disConnected() {
    $('#connectSuccessful').attr('style', 'display: none');
    $('#connectWallet').attr('style', 'display: block');
}

// 监听chain切换
ethereum.on('chainChanged', handleChainChanged);

function handleChainChanged(_chainId) {
    window.location.reload();
}

let currentAccount = null;
ethereum
    .request({ method: 'eth_accounts' })
    .then(handleAccountsChanged)
    .catch((err) => {
        console.error(err);
    });
// 监听Account切换
ethereum.on('accountsChanged', handleAccountsChanged);

// 点击连接MetaMask按钮
function connectWallet() {
    $('#connectWallet').on('click', function() {
        ethereum
            .request({ method: 'eth_requestAccounts' })
            .then(handleAccountsChanged)
            .catch((err) => {
                if (err.code === 4001) {
                    alert('You have rejected the request.');
                    console.log('You have rejected the request.');
                } else {
                    console.error('There was a unexpected problem happens : ' + err);
                }
            });
    });
}

// 监测Account改动 & 获取账号地址
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        console.log('Please connect to MetaMask.');
        disConnected()
    } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0];
        console.log(accounts);
        isConnected();
    }
}

// 获取账户信息 address,balanace
async function getAccountInfo() {
    console.log('getAccount');
    var web3 = window.web3;
    web3 = new Web3(Web3.currentProvider);
    //getAccounts
    // var addr = await web3.eth.getAccounts().then(function(accounts) { return accounts });
    var addr = await ethereum.request({ method: 'eth_accounts' }).then(function(accounts) { return accounts });
    var fromAddr = addr[0];
    console.log('account', fromAddr);
    $('#connectSuccessful').on('click', function() {
        $('#accountAddress').val(fromAddr);
    });
    // getBalance
    // var balance = await web3.eth.get_balance(fromAddr, function(balanaces) { return balanaces });
    var balance = await ethereum.request({ method: 'eth_getBalance', params: [fromAddr, 'latest'], "id": 1 });
    console.log('balance', balance);

    // Select Token# selectTokenA 按钮
    // 添加余额信息
    // $('#selectTokenA').on('click', function() {
    //     $('#walletBalance').find('tbody').append('<tr><td>' + 'ETH' + '</td><td>' +
    //         balance + '</td><td>' + '<button type="button " id="selectTokenBtn " class="btn btn-default ">' +
    //         'Select' + '</button></td></tr>');
    // });

}