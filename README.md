# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```


## Deploy contract on Tenderly Fork

Setup hardhat
  
1. create fork on tenderly website
2. setup hardhat (install tenderly package, setup config)
	- https://docs.tenderly.co/contract-verification/hardhat
3. login tendrly via cli

Start deploy

4. npx hardhat compile
6. create scripts/deploy.js or it can exist 
7. `npx hardhat run --network virtual_arbitrum_one scripts/AAVE/deployAaveOpenPosition.ts`