// scripts/deploy.js

const fs = require('fs'); // Node.js File System module

const path = require('path');


async function main() {

  console.log("Deploying the ProofAI smart contract...");

  const proofAI = await hre.ethers.deployContract("ProofAI");

  await proofAI.waitForDeployment();


  const contractAddress = proofAI.target;

  console.log(`✅ ProofAI contract deployed to: ${contractAddress}`);


  // --- Auto-update the config file ---

  console.log("Updating the configuration file with the new contract address...");

  const configPath = path.join(__dirname, '../config.js');

  let configContent = fs.readFileSync(configPath, 'utf8');


  // Use a regular expression to replace the old address with the new one

  const addressRegex = /contractAddress: "0x[a-fA-F0-9]{40}"/g;

  configContent = configContent.replace(addressRegex, `contractAddress: "${contractAddress}"`);


  fs.writeFileSync(configPath, configContent, 'utf8');

  console.log("✅ Configuration file updated successfully.");

}


main().catch((error) => {

  console.error(error);

  process.exitCode = 1;

});

