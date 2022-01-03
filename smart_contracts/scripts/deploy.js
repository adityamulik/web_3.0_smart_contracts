
const hre = require("hardhat");

const main = async () => {

  // We get the contract to deploy
  const Transactions = await hre.ethers.getContractFactory("Transactions");
  const transactions = await Transactions.deploy();

  await transactions.deployed();

  console.log("Transactions deployed to:", transactions.address);
}

const runmain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log("Error ", error);
    process.exit(1);
  }
}

runmain();
