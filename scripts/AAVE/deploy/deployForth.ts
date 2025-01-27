import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  const signerAddr = await signer.getAddress();

  //Making Factories
  // const AaveBorrowF = await ethers.getContractFactory("AaveBorrow", signer);

  // const AavePaybackF = await ethers.getContractFactory("AavePayback", signer);

  // const AaveSupplyF = await ethers.getContractFactory("AaveSupply", signer);

  const AaveWithdrawF = await ethers.getContractFactory("AaveWithdraw", signer);

  //Deploing
  // const AaveBorrowContract = await AaveBorrowF.deploy({ from: signerAddr });
  // await AaveBorrowContract.waitForDeployment();

  // const AavePaybackContract = await AavePaybackF.deploy({ from: signerAddr });
  // await AavePaybackContract.waitForDeployment();

  // const AaveSupplyContract = await AaveSupplyF.deploy({ from: signerAddr });
  // await AaveSupplyContract.waitForDeployment();

  const AaveWithdrawContract = await AaveWithdrawF.deploy({ from: signerAddr });
  await AaveWithdrawContract.waitForDeployment();

  //logging addresses
  // console.log(
  // `DEPLOED AaveBorrowContract: ${await AaveBorrowContract.getAddress()}`
  // );
  // console.log(
  // `DEPLOED AavePaybackContract: ${await AavePaybackContract.getAddress()}`
  // );
  // console.log(
  // `DEPLOED AaveSupplyContract: ${await AaveSupplyContract.getAddress()}`
  // );
  console.log(
    `DEPLOED AaveWithdrawContract: ${await AaveWithdrawContract.getAddress()}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
