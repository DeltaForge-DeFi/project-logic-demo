import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  const signerAddr = await signer.getAddress();

  //Making Factories
  const CheckWalletTypeF = await ethers.getContractFactory(
    "CheckWalletType",
    signer
  );

  const AdminDataF = await ethers.getContractFactory("AdminData", signer);

  const TokenUtilsF = await ethers.getContractFactory("TokenUtils", signer);

  //Deploing
  const CheckWalletTypeContract = await CheckWalletTypeF.deploy({
    from: signerAddr,
  });
  await CheckWalletTypeContract.waitForDeployment();

  const AdminDataContract = await AdminDataF.deploy({ from: signerAddr });
  await AdminDataContract.waitForDeployment();

  const TokenUtilsContract = await TokenUtilsF.deploy({ from: signerAddr });
  await TokenUtilsContract.waitForDeployment();

  //logging addresses
  console.log(
    `DEPLOED CheckWalletTypeContract: ${await CheckWalletTypeContract.getAddress()}`
  );

  console.log(
    `DEPLOED AdminDataContract: ${await CheckWalletTypeContract.getAddress()}`
  );

  console.log(
    `DEPLOED TokenUtilsContract: ${await TokenUtilsContract.getAddress()}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
