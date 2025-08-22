// scripts/authorize.js

async function main() {

  // 1. Paste your NEW final contract address here

  const contractAddress = "0x5FB23E28eADE3dD32551224E9FAF7BC1c7A53D71";

  const companyNameToAuthorize = "ProofAI Demo Corp"; // You can change this name


  console.log(`Connecting to ProofAI contract at: ${contractAddress}`);

  const proofAI = await hre.ethers.getContractAt("ProofAI", contractAddress);


  // We will authorize the wallet that deployed the contract (the owner)

  const [owner] = await hre.ethers.getSigners();

  const companyAddressToAuthorize = owner.address;


  console.log(`Authorizing wallet ${companyAddressToAuthorize} as "${companyNameToAuthorize}"...`);

  const tx = await proofAI.authorizeCompany(companyAddressToAuthorize, companyNameToAuthorize);

  await tx.wait();


  console.log("✅ Success! Company has been authorized.");

  console.log(`Transaction Hash: ${tx.hash}`);

}


main().catch((error) => {

  console.error(error);

  process.exitCode = 1;

}); 