import { ethers } from "hardhat";

async function main() {
  // Retrieve accounts
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy DSAuth
  const DSAuth = await ethers.getContractFactory(
    "contracts/DS/auth.sol:DSAuth"
  );
  const dsAuth = await DSAuth.deploy();
  await dsAuth.waitForDeployment();
  console.log("DSAuth deployed to:", dsAuth.getAddress());

  // Deploy DSNote
  const DSNote = await ethers.getContractFactory(
    "contracts/DS/note.sol:DSNote"
  );
  const dsNote = await DSNote.deploy();
  await dsNote.waitForDeployment();
  console.log("DSNote deployed to:", dsNote.getAddress());

  // Deploy DSProxyCache
  const DSProxyCache = await ethers.getContractFactory(
    "contracts/DS/proxy.sol:DSProxyCache"
  );
  const dsProxyCache = await DSProxyCache.deploy();
  await dsProxyCache.waitForDeployment();
  console.log("DSProxyCache deployed to:", dsProxyCache.getAddress());

  // Deploy DSProxy
  const DSProxy = await ethers.getContractFactory(
    "contracts/DS/proxy.sol:DSProxy"
  );
  const dsProxy = await DSProxy.deploy(dsProxyCache.getAddress());
  await dsProxy.waitForDeployment();
  console.log("DSProxy deployed to:", dsProxy.getAddress());

  // Deploy DSProxyFactory
  const DSProxyFactory = await ethers.getContractFactory(
    "contracts/DS/proxy.sol:DSProxyFactory"
  );
  const dsProxyFactory = await DSProxyFactory.deploy();
  await dsProxyFactory.waitForDeployment();
  console.log("DSProxyFactory deployed to:", dsProxyFactory.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
