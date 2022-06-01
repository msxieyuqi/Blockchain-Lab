pragma solidity 0.6.0;

contract HashedTimeLock {
    struct  LockContract {
        address  payable sender;
        address  payable receiver;
        uint amount;
        bytes32 hashlock;
        uint timelock;
        bool withdraw;
        bool refunded;
        string preimage; //secret
    }
    uint time;
    //LockContract[] storage lockcontract;
    mapping   (bytes32 => LockContract) contracts;  //type???
    // to check if the TimeLock is pratical,it must be  >0,otherwise outputs "timeLock time must be in the future"
    modifier futureTimeLock(uint _time) {
        time = now + _time;
        require(time > now, "timeLock time must be in the future");
        _;
    }
    //to check if the transferred value >0, otheriwise outputs "msg.value must be >0"
    modifier fundsSent() {
        require(msg.value >0, "msg.value must be >0");
        _;
    }
    // to check if the contractId dose exist , otherwise outputs "contractId dose not exist"
    modifier contractExists(bytes32 _contractId){
         require(haveContract(_contractId), "contractId dose not exist");
         _;
    }
    // to check if the key given by the receiver is correct,otherwise outputs "hashlock hash dose not match"
    modifier hashlockMatches(bytes32 _contractId, string memory _x) {
        require (contracts[_contractId].hashlock == keccak256(abi.encodePacked(_x)), "hashlock hash dose not match");
        _;
    }
    //to check if the contract withdrawable is
    modifier withdrawable(bytes32 _contractId) {
        require(contracts[_contractId].receiver == msg.sender, "withdrable:  not receiver");
        require(contracts[_contractId].withdraw == false, "withdrawable: already withdrawn");
        require(contracts[_contractId].refunded == false, "refundable:already refunded");
        require(contracts[_contractId].timelock < now, "withdrawable: time is out"); //????
        _;
    }
    //to check if the contract refundable is
    modifier refundable(bytes32 _contractId) {
       require(contracts[_contractId].sender == msg.sender, "withdrable:  not receiver");
       require(contracts[_contractId].withdraw == false, "withdrawable: already withdrawn");
       require(contracts[_contractId].refunded == false, "refundable:already refunded");
       require(contracts[_contractId].timelock > now, "withdrawable: time is out"); //????
        _;
    }
    //to judge :if the congtractId of the newly created LockContract already exists
    function haveContract(bytes32 _contractId) internal view returns (bool exists) {
        exists = (contracts[_contractId].sender != address(0));//why address(0)?
    }
    // create a new LockContract with contractId
    function newContract(address payable _receiver, uint _timelock, string calldata _preimage) external payable fundsSent futureTimeLock(_timelock) returns(bytes32) {
        bytes32 contractId = keccak256(abi.encodePacked(msg.sender, _receiver, msg.value, _timelock));    //changebale,_preimage??
        if (haveContract(contractId))
           revert();
        
        bytes32 hashlock = keccak256(abi.encodePacked(_preimage));
        //ockcontract.push(LockContract(msg.sender, _receiver, msg.value, hashlock, _timelock, false, false, _preimage));
         contracts[contractId]  = LockContract(msg.sender, _receiver, msg.value, hashlock, _timelock, false, false, _preimage);
        return contractId;

    }
    // receiver withdraws the money
    function withdraw(bytes32 _contractId, string memory _preimage) public contractExists(_contractId) hashlockMatches(_contractId, _preimage) withdrawable(_contractId) returns(bool){
        LockContract storage finshed = contracts[_contractId];
        //finsched.preimage = _preimage;
        finshed.withdraw = true;
        finshed.receiver.transfer(finshed.amount);
        return true;
    }
    // sender refunds the money
    function refund(bytes32 _contractId)  external contractExists(_contractId) refundable(_contractId) returns (bool) {
        LockContract storage toBeRefunded = contracts[_contractId];
        toBeRefunded.refunded = true;
        toBeRefunded.sender.transfer(toBeRefunded.amount);
    }
}
