// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    mapping(address => bool) public isVoter;
    mapping(address => bool) public hasVoted;
    mapping(uint => uint) public votes;

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    function registerVoter(address voter) external {
        require(msg.sender == admin, "Only admin");
        isVoter[voter] = true;
    }

    function vote(uint candidateId) external {
        require(isVoter[msg.sender], "Not registered");
        require(!hasVoted[msg.sender], "Already voted");

        votes[candidateId]++;
        hasVoted[msg.sender] = true;
    }
}
