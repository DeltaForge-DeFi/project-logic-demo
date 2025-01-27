import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  const signerAddr = await signer.getAddress();

  //Making Factories
  const ArbitrumProxyFactoryAddressesF = await ethers.getContractFactory(
    "ArbitrumProxyFactoryAddresses",
    signer
  );

  const ArbitrumAuthAddressesF = await ethers.getContractFactory(
    "ArbitrumAuthAddresses",
    signer
  );

  const DSNoteF = await ethers.getContractFactory("DSNote", signer);

  const DefisaverLoggerF = await ethers.getContractFactory(
    "DefisaverLogger",
    signer
  );

  const ArbitrumActionsUtilAddressesF = await ethers.getContractFactory(
    "ArbitrumActionsUtilAddresses",
    signer
  );

  const AddressF = await ethers.getContractFactory("Address", signer);

  const DataTypesF = await ethers.getContractFactory("DataTypes", signer);

  const ArbitrumAaveAddressesF = await ethers.getContractFactory(
    "ArbitrumAaveAddresses",
    signer
  );

  //Deploing
  const ArbitrumProxyFactoryAddressesContract =
    await ArbitrumProxyFactoryAddressesF.deploy({ from: signerAddr });
  await ArbitrumProxyFactoryAddressesContract.waitForDeployment();

  const ArbitrumAuthAddressesContract = await ArbitrumAuthAddressesF.deploy({
    from: signerAddr,
  });
  await ArbitrumAuthAddressesContract.waitForDeployment();

  const DSNoteContract = await DSNoteF.deploy({ from: signerAddr });
  await DSNoteContract.waitForDeployment();

  const DefisaverLoggerContract = await DefisaverLoggerF.deploy({
    from: signerAddr,
  });
  await DefisaverLoggerContract.waitForDeployment();

  const ArbitrumActionsUtilAddressesContract =
    await ArbitrumActionsUtilAddressesF.deploy({ from: signerAddr });
  await ArbitrumActionsUtilAddressesContract.waitForDeployment();

  const AddressContract = await AddressF.deploy({ from: signerAddr });
  await AddressContract.waitForDeployment();

  const DataTypesContract = await DataTypesF.deploy({ from: signerAddr });
  await DataTypesContract.waitForDeployment();

  const ArbitrumAaveAddressesContract = await ArbitrumAaveAddressesF.deploy({
    from: signerAddr,
  });
  await ArbitrumAaveAddressesContract.waitForDeployment();

  //logging addresses
  console.log(
    `DEPLOED ArbitrumProxyFactoryAddressesContract: ${await ArbitrumProxyFactoryAddressesContract.getAddress()}`
  );

  console.log(
    `DEPLOED ArbitrumAuthAddressesContract: ${await ArbitrumAuthAddressesContract.getAddress()}`
  );

  console.log(`DEPLOED DSNoteContract: ${await DSNoteContract.getAddress()}`);

  console.log(
    `DEPLOED DefisaverLoggerContract: ${await DefisaverLoggerContract.getAddress()}`
  );

  console.log(
    `DEPLOED ArbitrumActionsUtilAddressesContract: ${await ArbitrumActionsUtilAddressesContract.getAddress()}`
  );

  console.log(`DEPLOED AddressContract: ${await AddressContract.getAddress()}`);

  console.log(
    `DEPLOED DataTypesContract: ${await DataTypesContract.getAddress()}`
  );

  console.log(
    `DEPLOED ArbitrumAaveAddressesContract: ${await ArbitrumAaveAddressesContract.getAddress()}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
