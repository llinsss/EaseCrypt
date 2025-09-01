// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "lib/openzeppelin-contracts/contracts/access/Ownable.sol";


contract EaseCrypt is Ownable {
    uint256 public totalTransactions;
    uint256 public successfulTransactions;
    uint256 public failedTransactions;
    mapping(address => uint256) public userTransactionCount;
    mapping(address => uint256) public userSuccessfulTransactions;
    mapping(bytes32 => TransactionMetadata) public transactions;

    enum Status { Pending, Success, Failed }
    struct TransactionMetadata {
        uint256 nairaAmount;
        uint256 cryptoAmount;
        string cryptoType;
        uint256 exchangeRate;
        Status status;
    }

    event TransactionInitiated(address indexed user, bytes32 indexed transactionId);
    event TransactionCompleted(address indexed user, bytes32 indexed transactionId, Status status);

    modifier onlyAuthorized() {
        require(msg.sender == owner(), "Not authorized");
        _;
    }

    constructor() Ownable(msg.sender){}

    function incrementTotalTransactions() public onlyAuthorized {
        totalTransactions += 1;
    }

    function recordSuccessfulTransaction(address user, bytes32 transactionId) public onlyAuthorized {
        successfulTransactions += 1;
        userSuccessfulTransactions[user] += 1;
        transactions[transactionId].status = Status.Success;
        emit TransactionCompleted(user, transactionId, Status.Success);
    }

    function recordFailedTransaction(bytes32 transactionId) public onlyAuthorized {
        failedTransactions += 1;
        transactions[transactionId].status = Status.Failed;
        emit TransactionCompleted(msg.sender, transactionId, Status.Failed);
    }

    function incrementUserTransactionCount(address user) public onlyAuthorized {
        userTransactionCount[user] += 1;
    }

    function storeTransactionMetadata(
        bytes32 transactionId,
        uint256 nairaAmount,
        uint256 cryptoAmount,
        string memory cryptoType,
        uint256 exchangeRate
    ) public onlyAuthorized {
        transactions[transactionId] = TransactionMetadata(
            nairaAmount,
            cryptoAmount,
            cryptoType,
            exchangeRate,
            Status.Pending
        );
        emit TransactionInitiated(msg.sender, transactionId);
    }

    // Getter functions
    function getTotalTransactions() public view returns (uint256) {
        return totalTransactions;
    }

    function getSuccessfulTransactions() public view returns (uint256) {
        return successfulTransactions;
    }

    function getFailedTransactions() public view returns (uint256) {
        return failedTransactions;
    }

    function getUserTransactionCount(address user) public view returns (uint256) {
        return userTransactionCount[user];
    }

    function getUserSuccessfulTransactions(address user) public view returns (uint256) {
        return userSuccessfulTransactions[user];
    }

    function getTransactionStatus(bytes32 transactionId) public view returns (Status) {
        return transactions[transactionId].status;
    }
}