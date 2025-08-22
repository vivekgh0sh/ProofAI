// scripts/mintEmployment.js
async function main() {
  // 1. Paste your FINAL contract address here
  const contractAddress = "0x2cF2EC61D5F50bcaa41F2e7Dae256955E4D1b5D3";

  // We'll have the company (the owner) mint an NFT for the employee (also the owner)
  const [owner] = await hre.ethers.getSigners();
  const employeeAddress = owner.address;
  const companyAddress = owner.address;

  console.log(`Connecting to ProofAI contract at: ${contractAddress}`);
  const proofAI = await hre.ethers.getContractAt("ProofAI", contractAddress, owner);

  console.log(`Minting a new Employment NFT for ${employeeAddress}...`);
  const tx = await proofAI.mintEmploymentNFT(
    employeeAddress,
    "ProofAI Demo Corp",      // Company Name
    "Senior AI Engineer",    // Position
    "full-time",              // Employment Type
    "https://gist.githubusercontent.com/vivekgh0sh/496601df7f5388a49f3ac4c9beced37e/raw/85bcb7f4ffa95fe7159277a69e1c6784c7adec04/credential-1.json" // Using your Gist for demo metadata
  );

  await tx.wait();

  console.log("✅ Success! Employment NFT minted.");
  console.log(`Transaction Hash: ${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});