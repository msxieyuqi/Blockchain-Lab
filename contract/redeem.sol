pragma solidity 0.6.0;
import "./hashtimelock.sol";
contract Redeem is HashedTimeLock {

    function redeem(bytes32 _contractId, bytes32 _key) public payable returns(bool) {
        withdraw(_contractId, _key);
    }
}   
