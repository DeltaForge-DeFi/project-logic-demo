// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
/*
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Looping is ReentrancyGuard {
    IERC20 public token;

    struct User {
        uint256 deposit;
        uint256 debt;
    }

    mapping(address => User) public users;
    uint256 public interestRate = 10; // Годовая процентная ставка
    uint256 public loopLimit = 5; // Максимальное количество зацикливания
    uint256 public collateralFactor = 50; // Коэффициент обеспечения

    constructor(address _token) {
        token = IERC20(_token);
    }

    modifier onlyDeposited() {
        require(users[msg.sender].deposit > 0, "No deposit found");
        _;
    }

    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Deposit amount should be greater than 0");
        
        token.transferFrom(msg.sender, address(this), amount);
        users[msg.sender].deposit += amount;
    }

    function borrow(uint256 amount) external nonReentrant onlyDeposited {
        User storage user = users[msg.sender];

        uint256 maxBorrow = (user.deposit * collateralFactor) / 100;
        require(user.debt + amount <= maxBorrow, "Exceeds borrow limit");

        user.debt += amount;
        token.transfer(msg.sender, amount);
    }

    function repay(uint256 amount) external nonReentrant onlyDeposited {
        User storage user = users[msg.sender];
        
        require(user.debt >= amount, "Repay amount exceeds debt");

        token.transferFrom(msg.sender, address(this), amount);
        user.debt -= amount;
    }

    function loopBorrow(uint256 amount, uint8 loops) external nonReentrant onlyDeposited {
        require(loops <= loopLimit, "Loop limit exceeded");
        
        for (uint8 i = 0; i < loops; i++) {
            uint256 maxBorrow = (users[msg.sender].deposit * collateralFactor) / 100;
            require(users[msg.sender].debt + amount <= maxBorrow, "Exceeds borrow limit");

            users[msg.sender].debt += amount;
            token.transfer(msg.sender, amount);

            // Реинвестируем сумму, чтобы поддерживать зацикливание
            token.transferFrom(msg.sender, address(this), amount);
            users[msg.sender].deposit += amount;
        }
    }

    function withdraw(uint256 amount) external nonReentrant onlyDeposited {
        User storage user = users[msg.sender];
        require(user.deposit >= amount, "Not enough deposit");

        uint256 maxWithdraw = (user.deposit * collateralFactor) / 100;
        require(user.deposit - amount >= maxWithdraw, "Exceeds withdraw limit");

        user.deposit -= amount;
        token.transfer(msg.sender, amount);
    }

    function getDeposit() external view returns (uint256) {
        return users[msg.sender].deposit;
    }

    function getDebt() external view returns (uint256) {
        return users[msg.sender].debt;
    }
}
*/