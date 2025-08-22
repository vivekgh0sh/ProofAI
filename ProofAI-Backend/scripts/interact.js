async function main() {
  const contractAddress = "0x2cF2EC61D5F50bcaa41F2e7Dae256955E4D1b5D3";
  const userAddress = "0x8dD11dCcD996d697a731b830495c95b6F6FeCdF3";
  const metadataURI = "https://gist.githubusercontent.com/vivekgh0sh/496601df7f5388a49f3ac4c9beced37e/raw/85bcb7f4ffa95fe7159277a69e1c6784c7adec04/credential-1.json";
  
  console.log(`Interacting with0x4F43a3507737b034eaE43C763aE0E31E046d9328 ProofAI contract at: ${contractAddress}`);

  const proofAI = await hre.ethers.getContractAt("ProofAI", contractAddress);

  console.log("Minting a new credential NFT with the CORRECT metadata...");
  const tx = await proofAI.mintCredential(
    userAddress,
    "Education",
    "BNB Hackathon University",
    95, // Trust Score
    metadataURI // <-- THIS IS THE CORRECTED LINE
  );

  await tx.wait();

  console.log(`Success! Transaction Hash: ${tx.hash}`);
  console.log(`NFT minted for address: ${userAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});