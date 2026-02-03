// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    struct Poll {
        uint id;
        string title;
        bool isActive;
    }

    // pollId => candidateId => voteCount
    mapping(uint => mapping(uint => uint)) public pollVotes;
    
    // pollId => voterAddress => hasVoted
    mapping(uint => mapping(address => bool)) public hasVotedInPoll;
    
    mapping(address => bool) public isVoter;

    Poll[] public polls;
    uint public nextPollId;
    address public admin;

    event PollCreated(uint pollId, string title);
    event Voted(uint pollId, uint candidateId, address voter);

    constructor() {
        admin = msg.sender;
    }

    function registerVoter(address voter) external {
        require(msg.sender == admin, "Only admin");
        isVoter[voter] = true;
    }

    function createPoll(string memory title) external {
        require(msg.sender == admin, "Only admin");
        polls.push(Poll(nextPollId, title, true));
        emit PollCreated(nextPollId, title);
        nextPollId++;
    }

    function vote(uint pollId, uint candidateId) external {
        require(isVoter[msg.sender], "Not registered");
        require(pollId < nextPollId, "Poll does not exist");
        require(polls[pollId].isActive, "Poll is not active");
        require(!hasVotedInPoll[pollId][msg.sender], "Already voted in this poll");

        pollVotes[pollId][candidateId]++;
        hasVotedInPoll[pollId][msg.sender] = true;
        
        emit Voted(pollId, candidateId, msg.sender);
    }

    function getPollVotes(uint pollId, uint candidateId) external view returns (uint) {
        return pollVotes[pollId][candidateId];
    }
}
