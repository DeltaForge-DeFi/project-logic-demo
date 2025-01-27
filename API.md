# API Документация

## GMX

### Расположение файлов

1. **Контракты**

    - Контракты **GMX** находятся в директории `hardhat/contracts/GMX`. Эта директория содержит два подкаталога:

      - _GMXShort_ :

        - `CreateShort.sol` - контракт для создания шортовой позиции в GMX

        - Подкаталог `Mock` содержит контракты для тестирования

      - _GMXLong_ :

        - В процессе разработки

      - Так же там находится файл `Deposit.sol` - контракт для депозита в **GMX**

2. **Скрипты**

    - Основные скрипты **GMX** находятся в директории `hardhat/scripts/GMX`. Эта директория содержит четыре подкаталога:

      - _deposit_ :
        
        - `deposit.ts` - скрипт для депозита в **GMX**
    
      - _GMXLong_ :

        - Здесь будут находиться скрипты для лонговой позиции в **GMX**

      - _GMXShort_ содержит в себе два подкаталога:

        - _deploy_ - здесь находится скрипт `deployCreateShort.ts` для деплоя контракта `createShort.sol`

        - _shortScripts_ - здесь находятся все скрипты, связанные с шортовой позицией на **GMX**.

          - `createShortMain.ts` - скрипт для создания шортовой позиции на **GMX** (без контракта) на mainnet

          - `interactWithCreateShort.ts` - скрипт для взаимодействия с контрактом `createShort.sol` для создания и снятия шортовой позиции на **GMX**

          - `readPositionCreateShort.ts` - скрипт для взаимодействия с контрактом `createShort.sol` для чтения шортовой позиции на **GMX**

          - `stopLossMain.ts` - пробный скрипт попытки своевременного снятия позиции воизбежание ликвидации

3. **Ресурсы**

    - Ресурсы для **GMX** находятся в директории `hardhat/source/GMX`. В этой директории находится подкаталог:
      
      - _deploymentsGMX_ - тут находятся все необходимые деплойменты для **GMX** в сетях arbitrum, arbitrumGoerli, arbitrumSepolia, avalanche, avalancheFuji.

4. **Тесты**

    - Тесты для **GMX** расположены в директории `hardhat/test/GMX`. Эта директория содержит два подкаталога:

      - _GMXLong_ - здесь будут находиться тесты для лонговой позиции в **GMX**

      - _GMXShort_ - здесь находятся тесты для шортовой позиции в **GMX**:

        - `createShort.test.ts` - тест для контракта `createShort.sol`, находится в доработке


## AAVE

1. **Контракты**

    - Контракты **AAVE** находятся в директории `hardhat/contracts/AAVE`. Эта директория содержит три подкаталога:

      - _AAVEInterfaces_ :

        - `IAaveProtocolDataProvider.sol`

        - `IL2Pool.sol`

        - `IPool.sol`

        - `IPoolAddressesProvider.sol`

      - _AAVEProtocol_ содержит поддиректорию и контракты:

        - _helpers_ :

          - `AaveHelper.sol`

          - `ArbitrumAaveAddresses.sol` - контракт с адресами контрактов **AAVE** на сети arbitrum

        - `AaveATokenPayback.sol`

        - `AaveBorrow.sol` - контракт для заема средств на **AAVE**

        - `AavePayback.sol`

        - `AaveSupply.sol` - контракт для одалживания средств на **AAVE**

        - `AaveWithdraw.sol` - контракт для снятия средств с **AAVE**

        - `looping.sol` - контракт, реализующий лупинг на **AAVE**

        - `Repay.sol`

        - `UniswapSwap.sol` - контракт для обмена средств на Uniswap перед тем как реализовать логику лупинга

        - `Withdraw.sol` - снятие средств

        - `WithdrawMiniV2.sol`

      - _type_ - здесь нахлодится контракт `DataTypes.sol` с типами данных для **AAVE**

2. **Скрипты**

    - Основные скрипты **AAVE** находятся в директории `hardhat/scripts/AAVE`. Эта директория содержит два подкаталога:

      - _deploy_ - здесь находятся все файлы для деплоя контрактов **AAVE**
    
      - _longScripts_ - Здесь находятся все скрипты, связанные с логикой **AAVE**. Эта директория делится на три подкаталога и содержит в себе некоторые скрипты:

        - _contractScripts_ (ранее _contract_) - содержит скрипты, связанные с контрактами **AAVE**

        - _other_ (ранее _scripts_)

        - _utils_ - содержит в себе `approve.ts`, `getDefaultProvider.ts`, `getDefaultSigner.ts`, `transaction.ts`, `wrapEth.ts`

        - Прочие скрипты (ранее не были определены в папку) - `borrow.ts`, `executeLoop.ts`, `payback.ts`, `supply.ts`, `swapEthForDai.ts`, `withdraw.ts`


3. **Ресурсы**

    - Ресурсы для **AAVE** находятся в директории `hardhat/source/AAVE`. Эта директория содержит два подкаталога:

      - _abis_ - здесь находятся abi контрактов **AAVE**

      - _config_ - содержит `assets.ts` и `networks.ts`


4. **Тесты**

    - Тесты для **AAVE** расположены в директории `hardhat/test/AAVE`. Эта директория содержит тест:

      - `test.ts` - для тестирования снятия средств на сети arbitrum через DSProxy

## DSProxy


1. **Контракты**

    - Контракты **DSProxy** находятся в директории `hardhat/contracts/DSProxy`. Эта директория содержит пять подкаталогов:

      - _authority_ - содержит контракты для авторизации `auth.sol`, `DSAuth.sol`, `DSAuthority`

      - _interfaces_ - содержит интерфейс для **DSProxy** `IDSProxyFactory.sol`

      - _note_ - содержит контракты для logNote `DSNote.sol`, `note.sol`

      - _proxy_ - основные контракты прокси `DSProxy.sol`, `proxy.sol`

      - _utils_ - вспомогательные контракты `ArbitrumProxyFactoryAddresses.sol`, `DSProxyFactoryHelper.sol`

2. **Скрипты**

    - Основные скрипты **DSProxy** находятся в директории `hardhat/scripts/proxy`. Эта директория содержит пять подкаталогов:

      - _abis_  - содержит `DSProxyAbi.ts` abi **DSProxy**
    
      - _authority_ - скрипты авторизации `athority.ts`, `checkAuthority.ts`

      - _common_ - содержит скрипты общего назначения (могут быть использованы и для GMX, и для AAVE):

        - `createProxy.ts` - скрипт создания прокси для пользователя

        - `proxyFactory.ts` 

      - _proxyAAVE_ - содержит скрипты взаимодействия с **DSProxy** для **AAVE**

      - _proxyGMX_ - содержит скрипты взаимодействия с **DSProxy** для **GMX**


## Stub

1. **Контракт**

    - Контракт **Stub** (контракт заглушка для фронта) находится в директории `hardhat/contracts/stub`. Эта директория содержит контракт `stub.sol`

2. **Скрипты**

    - Cкрипты **Stub** находятся в директории `hardhat/scripts/stub`. Эта директория содержит два скрипта:

      - `deployStub.ts` - скрипт для деплоя `stub.sol` в сеть arbitrum

      - `testAskStub.ts` - скрипт для тестирования запросов **Stub**


## Permissions

1. **Контракты**

    - Контракты **Permissions** находятся в директории `hardhat/contracts/permissions`. Эта директория содержит три подкаталога:

      - _action_ - содержит подкатегорию _helpers_ (`ActionsUtilHelper.sol`, `ArbitrumActionsUtilAddresses.sol`) и контракт `ActionBase.sol`

      - _auth_ - авторизация, содержит подкатегорию _helpers_ (`ArbitrumAuthAddresses.sol`, `AuthHelper.sol`) и контракты `AdminAuth.sol`, `AdminData.sol`

      - _registry_ - содержит контракт `DFSRegistry.sol`