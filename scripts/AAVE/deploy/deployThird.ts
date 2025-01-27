import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  const signerAddr = await signer.getAddress();

  //Making Factories
  const AdminAuthF = await ethers.getContractFactory("AdminAuth", signer);

  const DFSRegistryF = await ethers.getContractFactory("DFSRegistry", signer);

  //const ActionBaseF = await ethers.getContractFactory("ActionBase", signer);

  //Deploing
  const AdminAuthContract = await AdminAuthF.deploy({ from: signerAddr });
  await AdminAuthContract.waitForDeployment();

  const DFSRegistryContract = await DFSRegistryF.deploy({ from: signerAddr });
  await DFSRegistryContract.waitForDeployment();

  //const ActionBaseContract = await ActionBaseF.deploy({ from: signerAddr });
  //await ActionBaseContract.waitForDeployment();

  //logging addresses
  console.log(
    `DEPLOED AdminAuthContract: ${await AdminAuthContract.getAddress()}`
  );
  console.log(
    `DEPLOED DFSRegistryContract: ${await DFSRegistryContract.getAddress()}`
  );
  //console.log(
  //  `DEPLOED ActionBaseContract: ${await ActionBaseContract.getAddress()}`
  //);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
