$(function() {
    detectMetaMask();
    connectWallet();
    getAccountInfo();
});

// 检测MetaMask
function detectMetaMask() {
    if (window.ethereum && window.ethereum.isMetaMask) {
        web3 = new Web3(web3.currentProvider);
        console.log(web3);
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
    web3 = new Web3(web3.currentProvider);
    //getAccounts
    var addr = await web3.eth.getAccounts().then(function(accounts) { return accounts });
    fromAddr = addr[0];
    $('#connectSuccessful').on('click', function() {
        $('#accountAddress').val(fromAddr);
    });
    // getBalance
    var balance = await web3.eth.getBalance(fromAddr, function(balanaces) { return balanaces });
    console.log(balance, typeof(balance));

    // Select Token# selectTokenA 按钮
    // 添加余额信息
    // $('#selectTokenA').on('click', function() {
    //     $('#walletBalance').find('tbody').append('<tr><td>' + 'ETH' + '</td><td>' +
    //         balance + '</td><td>' + '<button type="button " id="selectTokenBtn " class="btn btn-default ">' +
    //         'Select' + '</button></td></tr>');
    // });

}