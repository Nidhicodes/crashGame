pragma solidity ^0.8.7;

contract CrashBetting {
    // Struct to store bet amount and active status
    struct Bet {
        uint256 amount;
        bool active;
    }

    // Mapping of players to their bets
    mapping(address => Bet) public playerBets;
    // Mapping of players to their points
    mapping(address => uint256) public playerPoints;
    // Dynamic array to track players in the current round
    address[] public currentPlayers;
    // Flag to indicate if the round is active
    bool public roundActive = false;
    // Flag to indicate if the round has ended
    bool public roundEnded = false;
    // Admin address
    address public admin;

    // Event emitted when a new round starts
    event NewRound();
    // Event emitted when a player places a bet
    event BetPlaced(address player, uint256 amount);
    // Event emitted when a player cashes out
    event CashOut(address player, uint256 winnings);
    // Event emitted when the round ends
    event RoundEnded(uint256 finalMultiplier);
    // Event emitted when a jackpot is awarded
    event JackpotAwarded(address winner, uint256 bonusPoints);

    // Constructor to set the admin
    constructor() public {
        admin = msg.sender;
    }

    // Function to start a new round
    function startRound() public {
        require(msg.sender == admin, "Only admin can start a new round");
        roundActive = true;
        currentPlayers = new address[](0);
        emit NewRound();
    }

    // Function to place a bet
    function placeBet(uint256 amount) public {
        require(roundActive, "Round not active");
        require(playerBets[msg.sender].active == false, "Already placed a bet in this round");
        playerBets[msg.sender] = Bet(amount, true);
        currentPlayers.push(msg.sender);
        emit BetPlaced(msg.sender, amount);
    }

    // Function to cash out
    function cashOut(uint256 multiplier) public {
        require(roundActive, "Round not active");
        require(playerBets[msg.sender].active == true, "No bet placed in this round");
        uint256 winnings = playerBets[msg.sender].amount * multiplier;
        playerPoints[msg.sender] += winnings;
        playerBets[msg.sender] = Bet(0, false);
        emit CashOut(msg.sender, winnings);
    }

    // Function to end the round
    function endRound(uint256 finalMultiplier) public {
        require(roundActive, "Round not active");
        require(msg.sender == admin, "Only admin can end a round");
        roundActive = false;
        roundEnded = true;
        emit RoundEnded(finalMultiplier);
        // Award jackpots if final multiplier is >= 75, 1250, or 5000
        if (finalMultiplier >= 75) {
            address winner = currentPlayers[uint256(keccak256(abi.encodePacked(block.timestamp))) % currentPlayers.length];
            playerPoints[winner] += 100;
            emit JackpotAwarded(winner, 100);
        }
        if (finalMultiplier >= 1250) {
           address winner = currentPlayers[uint256(keccak256(abi.encodePacked(block.timestamp, uint256(1)))) % currentPlayers.length];
            playerPoints[winner] += 500;
            emit JackpotAwarded(winner, 500);
        }

        if (finalMultiplier >= 5000) {
            address winner = currentPlayers[uint256(keccak256(abi.encodePacked(block.timestamp, uint256(2)))) % currentPlayers.length];
            playerPoints[winner] += 2000;
            emit JackpotAwarded(winner, 2000);
        }

    }

    // Function to get a player's points
    function getPlayerPoints(address player) public view returns (uint256) {
        return playerPoints[player];
    }

    // Function to get the players in the current round
    function getPlayers() public view returns (address[] memory) {
        return currentPlayers;
    }

    // Function to get a player's bet
    function getPlayerBet(address player) public view returns (uint256) {
        return playerBets[player].amount;
    }
}