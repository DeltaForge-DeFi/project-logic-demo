import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  const signerAddr = await signer.getAddress();

  //Making Factories
  const DSProxyFactoryHelperF = await ethers.getContractFactory(
    "DSProxyFactoryHelper",
    signer
  );

  const AuthHelperF = await ethers.getContractFactory("AuthHelper", signer);

  const DSAuthF = await ethers.getContractFactory("DSAuth", signer);

  const ActionsUtilHelperF = await ethers.getContractFactory(
    "ActionsUtilHelper",
    signer
  );

  const SafeERC20F = await ethers.getContractFactory("SafeERC20", signer);

  const AaveHelperF = await ethers.getContractFactory("AaveHelper", signer);

  //Deploing
  const DSProxyFactoryHelperContract = await DSProxyFactoryHelperF.deploy({
    from: signerAddr,
  });
  await DSProxyFactoryHelperContract.waitForDeployment();

  const AuthHelperContract = await AuthHelperF.deploy({ from: signerAddr });
  await AuthHelperContract.waitForDeployment();

  const DSAuthContract = await DSAuthF.deploy({ from: signerAddr });
  await DSAuthContract.waitForDeployment();

  const ActionsUtilHelperContract = await ActionsUtilHelperF.deploy({
    from: signerAddr,
  });
  await ActionsUtilHelperContract.waitForDeployment();

  const SafeERC20Contract = await SafeERC20F.deploy({ from: signerAddr });
  await SafeERC20Contract.waitForDeployment();

  const AaveHelperContract = await AaveHelperF.deploy({ from: signerAddr });
  await AaveHelperContract.waitForDeployment();

  //logging addresses
  console.log(
    `DEPLOED DSProxyFactoryHelperContract: ${await DSProxyFactoryHelperContract.getAddress()}`
  );

  console.log(
    `DEPLOED AuthHelperContract: ${await AuthHelperContract.getAddress()}`
  );

  console.log(`DEPLOED DSAuthContract: ${await DSAuthContract.getAddress()}`);

  console.log(
    `DEPLOED ActionsUtilHelperContract: ${await ActionsUtilHelperContract.getAddress()}`
  );

  console.log(
    `DEPLOED SafeERC20Contract: ${await SafeERC20Contract.getAddress()}`
  );

  console.log(
    `DEPLOED AaveHelperContract: ${await AaveHelperContract.getAddress()}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
