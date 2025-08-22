// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ProofAI is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // --- STRUCTS ---
    struct Credential {
        string credentialType;
        string issuerName;
        uint256 trustScore;
        uint256 issuedDate;
        bool isRevoked;
    }
    
    struct Employment {
        address employer;           // The wallet address of the company
        string companyName;         // The company's name, e.g., "Google"
        string position;            // The job title, e.g., "Software Engineer"
        uint256 startDate;          // Timestamp of when the employment began
        uint256 endDate;            // Timestamp of when it ended (0 if still active)
        string employmentType;      // "full-time", "part-time", "contract"
        bool isActive;              // True if the employee is currently working there
        string endReason;           // Reason for leaving, e.g., "resigned"
        uint256 trustScore;         // Confidence score (high for direct company issuance)
    }

    struct EmploymentRecord {
        uint256[] employmentIds;    // A list of all employment NFT IDs a user owns
        uint256 activeCount;        // A counter for their currently active jobs
        uint256 lastUpdated;        // Timestamp for the last time this record was changed
    }

    // --- STATE VARIABLES (MAPPINGS) ---
    mapping(uint256 => Credential) public credentials;
    mapping(uint256 => string) private _tokenURIs;

    // --- NEW MAPPINGS FOR EMPLOYMENT ---
    // Links each new Employment NFT ID to its detailed Employment record
    mapping(uint256 => Employment) public employments;
    // Tracks the overall employment history for each user (wallet address)
    mapping(address => EmploymentRecord) public employmentRecords;
    // A simple whitelist of company wallet addresses authorized to mint Employment NFTs
    mapping(address => bool) public authorizedCompanies;

    // --- EVENTS ---
    event CredentialMinted(address indexed user, uint256 indexed tokenId, string credentialType, uint256 trustScore);
    event CredentialRevoked(uint256 indexed tokenId);

    // --- NEW EVENTS FOR EMPLOYMENT ---
    // Announced when a new Employment NFT is created
    event EmploymentMinted(address indexed employee, address indexed employer, uint256 tokenId, string position);
    // Announced when an employment period is ended
    event EmploymentEnded(uint256 indexed tokenId, uint256 endDate, string reason);
    // Announced when the contract owner authorizes a new company
    event CompanyAuthorized(address indexed company, string companyName);

    constructor() ERC721("ProofAI Verifiable Credential", "PROOF") {}

    // Add this new function right after the constructor

    // Only the platform owner can call this to whitelist a new company
    function authorizeCompany(address companyAddress, string memory companyName) public onlyOwner {
        require(companyAddress != address(0), "ProofAI: Cannot authorize the zero address");
        authorizedCompanies[companyAddress] = true;
        emit CompanyAuthorized(companyAddress, companyName);
    }

    function _transfer(address from, address to, uint256 tokenId) internal override {
        // This rule now applies to ALL tokens minted by this contract.
        // A transfer is ONLY allowed if it is the initial mint (from the zero address).
        // All subsequent transfers from one user to another will be blocked.
        require(from == address(0), "ProofAI SBT: All credentials on this platform are soulbound and cannot be transferred.");
        super._transfer(from, to, tokenId);
    }


    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory _uri = _tokenURIs[tokenId];
        return _uri;
    }

    function mintCredential(
        address to,
        string memory credentialType,
        string memory issuerName,
        uint256 trustScore,
        string memory metadataURI
    ) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(to, newTokenId);
        _tokenURIs[newTokenId] = metadataURI;

        credentials[newTokenId] = Credential({
            credentialType: credentialType,
            issuerName: issuerName,
            trustScore: trustScore,
            issuedDate: block.timestamp,
            isRevoked: false
        });

        emit CredentialMinted(to, newTokenId, credentialType, trustScore);
        return newTokenId;
    }

     // This function can only be called by a whitelisted company wallet
    function mintEmploymentNFT(
        address employee,
        string memory companyName,
        string memory position,
        string memory employmentType,
        string memory metadataURI
    ) public returns (uint256) {
        // Rule 1: Check if the caller (msg.sender) is on the authorized list.
        require(authorizedCompanies[msg.sender], "ProofAI: Caller is not an authorized company");

        // Rule 2: Create a new, unique token ID.
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        // Rule 3: Mint the Soulbound NFT to the employee's wallet address.
        _safeMint(employee, newTokenId);
        
        // Rule 4: Store the metadata URI for this new token.
        _tokenURIs[newTokenId] = metadataURI;
        
        // Rule 5: Create the detailed employment record in our "filing cabinet".
        employments[newTokenId] = Employment({
            employer: msg.sender,
            companyName: companyName,
            position: position,
            startDate: block.timestamp,
            endDate: 0, // 0 indicates the job is currently active
            employmentType: employmentType,
            isActive: true,
            endReason: "",
            trustScore: 95 // Assign a high trust score for direct issuance by a company
        });
        
        // Rule 6: Update the employee's master record.
        employmentRecords[employee].employmentIds.push(newTokenId);
        employmentRecords[employee].activeCount++;
        employmentRecords[employee].lastUpdated = block.timestamp;
        
        // Rule 7: Announce that a new employment has been recorded.
        emit EmploymentMinted(employee, msg.sender, newTokenId, position);
        
        return newTokenId;
    }

      // Can be called by either the employer or the employee to mark a job as inactive
    function endEmployment(uint256 tokenId, string memory reason) public {
        // Step 1: Get the specific employment record from our mapping
        Employment storage emp = employments[tokenId];
        // Step 2: Find out who the employee is by checking the NFT's owner
        address employee = ownerOf(tokenId);
        
        // --- SECURITY CHECKS ---
        // Rule A: Only the employer or the employee of this specific job can call this function.
        require(
            msg.sender == emp.employer || msg.sender == employee,
            "ProofAI: Not authorized to end this employment"
        );
        // Rule B: You can't end a job that has already been ended.
        require(emp.isActive, "ProofAI: Employment has already ended");
        
        // --- STATE UPDATES ---
        // Step 3: Update the employment record with the end date and reason.
        emp.endDate = block.timestamp;
        emp.isActive = false;
        emp.endReason = reason;
        
        // Step 4: Update the employee's master record to decrease their active job count.
        if (employmentRecords[employee].activeCount > 0) { // Prevents a number-underflow error
            employmentRecords[employee].activeCount--;
        }
        employmentRecords[employee].lastUpdated = block.timestamp;
        
        // Step 5: Announce that the employment has ended.
        emit EmploymentEnded(tokenId, block.timestamp, reason);
    }

    function revokeCredential(uint256 tokenId) public onlyOwner {
        require(_exists(tokenId), "ProofAI: Credential with this ID does not exist.");
        credentials[tokenId].isRevoked = true;
        emit CredentialRevoked(tokenId);
    }

    function isCredentialValid(uint256 tokenId) public view returns (bool) {
        if (!_exists(tokenId)) {
            return false;
        }
        return !credentials[tokenId].isRevoked;
    }
    
    function getCredentialsByOwner(address owner) public view returns (uint256[] memory) {
        uint256 totalUserTokens = balanceOf(owner);
        if (totalUserTokens == 0) {
            return new uint256[](0);
        }

        uint256[] memory tokenIds = new uint256[](totalUserTokens);
        for (uint256 i = 0; i < totalUserTokens; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }
        return tokenIds;
    }

       // Helper function to get all of a user's employment token IDs
    function getEmploymentsByOwner(address owner) public view returns (uint256[] memory) {
        return employmentRecords[owner].employmentIds;
    }

    // Returns a list of all of a user's currently active jobs
    function getActiveEmployments(address employee) public view returns (Employment[] memory) {
        uint256[] memory allTokenIds = getEmploymentsByOwner(employee);
        Employment[] memory activeJobs = new Employment[](employmentRecords[employee].activeCount);
        uint256 activeIndex = 0;
        
        for (uint256 i = 0; i < allTokenIds.length; i++) {
            uint256 tokenId = allTokenIds[i];
            if (employments[tokenId].isActive) {
                if (activeIndex < activeJobs.length) {
                    activeJobs[activeIndex] = employments[tokenId];
                    activeIndex++;
                }
            }
        }
        
        return activeJobs;
    }

    // The core fraud-detection function for the "Soham Parekh" problem
    function checkEmploymentConflicts(address employee) public view returns (
        bool hasConflicts,
        uint256 activeFullTimeCount
    ) {
        uint256[] memory allTokenIds = getEmploymentsByOwner(employee);
        uint256 fullTimeCount = 0;
        
        for (uint256 i = 0; i < allTokenIds.length; i++) {
            uint256 tokenId = allTokenIds[i];
            // Only check active jobs for conflicts
            if (employments[tokenId].isActive) {
                // Compare strings using their hash to be gas-efficient
                if (keccak256(bytes(employments[tokenId].employmentType)) == keccak256(bytes("full-time"))) {
                    fullTimeCount++;
                }
            }
        }
        
        // A conflict is defined as having more than one active full-time job
        hasConflicts = fullTimeCount > 1;
        activeFullTimeCount = fullTimeCount;
        
        return (hasConflicts, activeFullTimeCount);
    }

    // Returns a list of all of a user's past and present jobs (for their profile timeline)
    function getEmploymentHistory(address employee) public view returns (Employment[] memory) {
        uint256[] memory tokenIds = getEmploymentsByOwner(employee);
        Employment[] memory history = new Employment[](tokenIds.length);
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            history[i] = employments[tokenIds[i]];
        }
        
        return history;
    }
}