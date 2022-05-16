$(function() {
    detectMetaMask();
    connectWallet();
    connectedAccount();
});

// 检测MetaMask
function detectMetaMask() {
    if (window.ethereum && window.ethereum.isMetaMask) {
        console.log('install')
    } else {
        console.log('Please install MetaMask!');
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

// 连接成功后查看账户地址modal
function connectedAccount() {
    $('#connectSuccessful').on('click', function() {
        console.log(currentAccount);
        $('#accountAddress').val(currentAccount);
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