// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract VendingMachine {


    // Declare state variables of the contract

    address public owner;
    mapping (address => uint) public coffeeBalances;

    // When 'VendingMachine' contract is deployed:
    // 1. set the deploying address as the owner of the contract
    // 2. set the deployed smart contract's coffee balance to 100
    constructor() {
        owner = msg.sender;
        coffeeBalances[address(this)] = 100;

    }


  


    // Allow anyone to purchase coffee
    function purchase(uint amount) public payable {
        require(msg.value >= amount * 10**18 wei, "You must pay at least 1 Celo per coffee");
        require(coffeeBalances[address(this)] >= amount, "Not enough coffee in stock to complete this purchase");
        coffeeBalances[address(this)] -= amount;
        coffeeBalances[msg.sender] += amount;
    }

    // Get balance of coffee
    function getMachineBalance() public view returns (uint) {
       return coffeeBalances[address(this)];
    }

      // Allow the owner to increase the smart contract's cupcake balance
    function refill(uint amount) public {
        require(msg.sender == owner, "Only the owner can refill.");
        coffeeBalances[address(this)] += amount;
    }

}
