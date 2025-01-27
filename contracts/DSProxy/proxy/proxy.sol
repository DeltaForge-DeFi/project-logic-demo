// proxy.sol - выполнение действий атомарно через идентичность прокси

// Copyright (C) 2017 DappHub, LLC

// Эта программа является свободным программным обеспечением: вы можете распространять и/или изменять
// ее в соответствии с условиями GNU General Public License, опубликованной
// Free Software Foundation, либо версии 3 лицензии, либо (по вашему выбору) любой более поздней версии.

// Эта программа распространяется в надежде, что она будет полезной,
// но БЕЗ КАКИХ-ЛИБО ГАРАНТИЙ; без даже подразумеваемой гарантии
// КОММЕРЧЕСКОЙ ПРИГОДНОСТИ или ПРИГОДНОСТИ ДЛЯ ОПРЕДЕЛЕННОЙ ЦЕЛИ. См.
// GNU General Public License для получения более подробной информации.

// Вы должны были получить копию GNU General Public License
// вместе с этой программой. Если нет, см. <http://www.gnu.org/licenses/>.

pragma solidity ^0.8.10;

import "../authority/DSAuth.sol";
import "../note/DSNote.sol";
import "../../common/interfaces/IERC20.sol";


// DSProxy
// Proxy implementation that deploys and executes code
contract DSProxy is DSAuth, DSNote {
    DSProxyCache public cache;  // global cache for contracts

    constructor(address _cacheAddr) {
        setCache(_cacheAddr);
    }

    function execute(address _target, bytes memory _data)
        public
        payable
        auth
        note
        returns (bytes32 response)
    {
        require(_target != address(0), "ds-proxy-target-address-required");

        // call contract in current context
        assembly {
            let succeeded := delegatecall(sub(gas(), 5000), _target, add(_data, 0x20), mload(_data), 0, 32)
            response := mload(0)      // load delegatecall output
            switch iszero(succeeded)
            case 1 {
                revert(0, 0)
            }
        }
    }


    function setCache(address _cacheAddr)
        internal
        auth
        note
        returns (bool)
    {
        require(_cacheAddr != address(0), "DSProxy: cache address is required");
        cache = DSProxyCache(_cacheAddr);
        return true;
    }

    // Функция для вывода ETH
    function withdrawETH() public auth {
        uint256 balance = address(this).balance;
        require(balance > 0, "DSProxy: no ETH balance");
        
        (bool success, ) = owner.call{value: balance}("");
        require(success, "DSProxy: ETH transfer failed");
    }

    // Функция для вывода токенов
    function withdrawToken(address token) public auth {
        require(token != address(0), "DSProxy: token address is required");
        
        IERC20 tokenContract = IERC20(token);
        uint256 balance = tokenContract.balanceOf(address(this));
        require(balance > 0, "DSProxy: no token balance");
        
        require(tokenContract.transfer(owner, balance), "DSProxy: token transfer failed");
    }

    receive() external payable {}
}

contract DSProxyCache {
    mapping(bytes32 => address) public cache;

    function read(bytes memory _code) public view returns (address) {
        bytes32 hash = keccak256(_code);
        return cache[hash];
    }

    function write(bytes memory _code) public returns (address target) {
        assembly {
            target := create(0, add(_code, 0x20), mload(_code))
            if iszero(extcodesize(target)) {
                revert(0, 0)
            }
        }
        bytes32 hash = keccak256(_code);
        cache[hash] = target;
    }
}

contract DSProxyFactory {
    event Created(address indexed sender, address indexed owner, address proxy, address cache);
    
    mapping(address => bool) public isProxy;

    mapping(address => address) public ownerToProxy;
    
    function build() public returns (DSProxy proxy) {
        proxy = build(msg.sender);
    }
    
    function build(address owner) public returns (DSProxy proxy) {
        address cache = address(new DSProxyCache());
        proxy = new DSProxy(cache);

        ownerToProxy[owner] = address(proxy);

        emit Created(msg.sender, owner, address(proxy), cache);
        proxy.setOwner(owner);
        isProxy[address(proxy)] = true;
    }

    function getProxyByOwner(address owner) public view returns(address proxy){
        return ownerToProxy[owner];
    }
}
