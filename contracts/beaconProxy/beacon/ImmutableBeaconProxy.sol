// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Proxy.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IBeacon.sol";

contract ImmutableBeaconProxy is Proxy {
    address public immutable beacon;
    address public immutable owner;
    address public immutable admin; // Админ может управлять позициями, но не финансами

    event Deposited(address indexed token, address indexed from, uint256 amount);
    event Withdrawn(address indexed token, address indexed to, uint256 amount);
    event AdminActionExecuted(address indexed admin, bytes data);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not the admin");
        _;
    }

    constructor(address _beacon, address _owner, address _admin) {
        require(_beacon != address(0), "Beacon cannot be zero address");
        require(_owner != address(0), "Owner cannot be zero address");
        require(_admin != address(0), "Admin cannot be zero address");

        beacon = _beacon;
        owner = _owner;
        admin = _admin;
    }

    function _implementation() internal view override returns (address) { 
        return IBeacon(beacon).implementation();
    }

    // Депозит токенов (только владелец)
    function deposit(address token, uint256 amount) external onlyOwner {
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Deposit failed");
        emit Deposited(token, msg.sender, amount);
    }

    // Вывод токенов (только владелец)
    function withdraw(address token, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(msg.sender, amount), "Withdraw failed");
        emit Withdrawn(token, msg.sender, amount);
    }

    // Функции админа
    function executeAdminAction(bytes calldata data) external onlyAdmin {
        (bool success, ) = address(this).delegatecall(data); 
        require(success, "Admin action failed");
        emit AdminActionExecuted(msg.sender, data);
    }

    receive() external payable {}
}
