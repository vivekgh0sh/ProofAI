// A Hardhat script for deploying our ProofAI contract.

async function main() {
  // 1. Get the contract factory for ProofAI
  // The contract factory is an abstraction used to deploy new smart contracts.
  const ProofAI = await hre.ethers.getContractFactory("ProofAI");
  console.log("Deploying ProofAI contract...");

  // 2. Deploy the contract
  // This sends a transaction to the network to create our contract.
  const proofAI = await ProofAI.deploy();

  // 3. Wait for the deployment to be confirmed on the blockchain
  await proofAI.waitForDeployment();

  // 4. Log the address of the deployed contract
  // This address is how we will interact with our contract later.
  console.log("ProofAI contract deployed to:", proofAI.target);
}

// Standard Hardhat script runner pattern
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});