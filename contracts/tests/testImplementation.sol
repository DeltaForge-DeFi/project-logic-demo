// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @dev Простой контракт для тестирования Beacon Proxy
 */
contract TestImplementation {
    // Хранимое значение
    uint256 private _value;
    
    // Версия имплементации для проверки обновлений
    string private _version;
    
    // Событие при изменении значения
    event ValueChanged(uint256 newValue);
    
    /**
     * @dev Инициализирует контракт с начальной версией
     * @param initialVersion Начальная версия контракта
     */
    function initialize(string memory initialVersion) public {
        require(bytes(_version).length == 0, "Already initialized");
        _version = initialVersion;
        _value = 0;
    }
    
    /**
     * @dev Устанавливает новое значение
     * @param newValue Новое значение для хранения
     */
    function setValue(uint256 newValue) public {
        _value = newValue;
        emit ValueChanged(newValue);
    }
    
    /**
     * @dev Возвращает текущее значение
     */
    function getValue() public view returns (uint256) {
        return _value;
    }
    
    /**
     * @dev Возвращает текущую версию имплементации
     */
    function getVersion() public virtual view returns (string memory) {
        return _version;
    }
    
    /**
     * @dev Возвращает адрес этого контракта для проверки делегирования
     */
    function getImplementationAddress() public view returns (address) {
        return address(this);
    }
}

/**
 * @dev Обновленная версия контракта для тестирования обновлений через Beacon
 */
contract TestImplementationV2 is TestImplementation {
    // Дополнительное хранимое значение, доступное только в V2
    string private _additionalData;
    
    /**
     * @dev Устанавливает дополнительные данные (доступно только в V2)
     * @param data Новые дополнительные данные
     */
    function setAdditionalData(string memory data) public {
        _additionalData = data;
    }
    
    /**
     * @dev Возвращает дополнительные данные
     */
    function getAdditionalData() public view returns (string memory) {
        return _additionalData;
    }
    
    /**
     * @dev Переопределяет метод из базовой версии для демонстрации обновления
     */
    function getVersion() public pure override returns (string memory) {
        return "V2";
    }
}
