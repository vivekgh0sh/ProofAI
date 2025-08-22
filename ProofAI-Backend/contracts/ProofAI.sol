// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// --- CUSTOM ERRORS (for gas efficiency and smaller contract size) ---
error ProofAI_CannotAuthorizeZeroAddress();
error ProofAI_CompanyAlreadyVerified();
error ProofAI_TokenIsSoulbound();
error ProofAI_URIQueryForNonexistentToken();
error ProofAI_CredentialDoesNotExist();
error ProofAI_CallerNotAuthorizedCompany();
error ProofAI_NotAuthorizedToEndEmployment();
error ProofAI_EmploymentAlreadyEnded();


contract ProofAI is ERC721, Ownable {
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
        address employer;
        string companyName;
        string position;
        uint256 startDate;
        uint256 endDate;
        string employmentType;
        bool isActive;
        string endReason;
        uint256 trustScore;
    }

    struct EmploymentRecord {
        uint256[] employmentIds;
        uint256 activeCount;
        uint256 lastUpdated;
    }
    
    struct CompanyProfile {
        string companyName;
        bool isVerified;
        uint256 trustScore;
        uint256 registrationDate;
        string[] redFlags;
    }

    // --- STATE VARIABLES (MAPPINGS) ---
    mapping(uint256 => Credential) public credentials;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => Employment) public employments;
    mapping(address => EmploymentRecord) public employmentRecords;
    mapping(address => bool) public authorizedCompanies;
    mapping(address => CompanyProfile) public companyProfiles;
    mapping(address => uint256[]) private _userCredentials;


    // --- EVENTS ---
    event CredentialMinted(address indexed user, uint256 indexed tokenId, string credentialType, uint256 trustScore);
    event CredentialRevoked(uint256 indexed tokenId);
    event EmploymentMinted(address indexed employee, address indexed employer, uint256 tokenId, string position);
    event EmploymentEnded(uint256 indexed tokenId, uint256 endDate, string reason);
    event CompanyAuthorized(address indexed company, string companyName);
    event CompanyVerified(address indexed company);
    event CompanyFlagged(address indexed company, string reason);

    constructor() ERC721("ProofAI Verifiable Credential", "PROOF") {}

    function authorizeCompany(address companyAddress, string memory companyName) public onlyOwner {
        if (companyAddress == address(0)) revert ProofAI_CannotAuthorizeZeroAddress();
        if (companyProfiles[companyAddress].isVerified) revert ProofAI_CompanyAlreadyVerified();

        authorizedCompanies[companyAddress] = true;

        companyProfiles[companyAddress] = CompanyProfile({
            companyName: companyName,
            isVerified: true,
            trustScore: 95,
            registrationDate: block.timestamp,
            redFlags: new string[](0)
        });

        emit CompanyAuthorized(companyAddress, companyName);
        emit CompanyVerified(companyAddress);
    }

    function _transfer(address from, address to, uint256 tokenId) internal override {
        if (from != address(0)) revert ProofAI_TokenIsSoulbound();
        super._transfer(from, to, tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) revert ProofAI_URIQueryForNonexistentToken();
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

        _userCredentials[to].push(newTokenId);

        emit CredentialMinted(to, newTokenId, credentialType, trustScore);
        return newTokenId;
    }

    function mintEmploymentNFT(
        address employee,
        string memory companyName,
        string memory position,
        string memory employmentType,
        string memory metadataURI
    ) public returns (uint256) {
        if (!authorizedCompanies[msg.sender]) revert ProofAI_CallerNotAuthorizedCompany();

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(employee, newTokenId);
        _tokenURIs[newTokenId] = metadataURI;

        employments[newTokenId] = Employment({
            employer: msg.sender,
            companyName: companyName,
            position: position,
            startDate: block.timestamp,
            endDate: 0,
            employmentType: employmentType,
            isActive: true,
            endReason: "",
            trustScore: 95
        });

        employmentRecords[employee].employmentIds.push(newTokenId);
        employmentRecords[employee].activeCount++;
        employmentRecords[employee].lastUpdated = block.timestamp;

        emit EmploymentMinted(employee, msg.sender, newTokenId, position);
        return newTokenId;
    }

    function endEmployment(uint256 tokenId, string memory reason) public {
        Employment storage emp = employments[tokenId];
        address employee = ownerOf(tokenId);

        if (msg.sender != emp.employer && msg.sender != employee) {
            revert ProofAI_NotAuthorizedToEndEmployment();
        }
        if (!emp.isActive) revert ProofAI_EmploymentAlreadyEnded();

        emp.endDate = block.timestamp;
        emp.isActive = false;
        emp.endReason = reason;

        if (employmentRecords[employee].activeCount > 0) {
            employmentRecords[employee].activeCount--;
        }
        employmentRecords[employee].lastUpdated = block.timestamp;

        emit EmploymentEnded(tokenId, block.timestamp, reason);
    }

    function revokeCredential(uint256 tokenId) public onlyOwner {
        if (!_exists(tokenId)) revert ProofAI_CredentialDoesNotExist();
        credentials[tokenId].isRevoked = true;
        emit CredentialRevoked(tokenId);
    }

    // --- VIEW FUNCTIONS ---

    function isCredentialValid(uint256 tokenId) public view returns (bool) {
        if (!_exists(tokenId)) {
            return false;
        }
        return !credentials[tokenId].isRevoked;
    }
    
    function getCredentialsByOwner(address owner) public view returns (uint256[] memory) {
        return _userCredentials[owner];
    }

    function getEmploymentsByOwner(address owner) public view returns (uint256[] memory) {
        return employmentRecords[owner].employmentIds;
    }

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

    function checkEmploymentConflicts(address employee) public view returns (bool hasConflicts, uint256 activeFullTimeCount) {
        uint256[] memory allTokenIds = getEmploymentsByOwner(employee);
        uint256 fullTimeCount = 0;

        for (uint256 i = 0; i < allTokenIds.length; i++) {
            uint256 tokenId = allTokenIds[i];
            if (employments[tokenId].isActive) {
                if (keccak256(bytes(employments[tokenId].employmentType)) == keccak256(bytes("full-time"))) {
                    fullTimeCount++;
                }
            }
        }

        hasConflicts = fullTimeCount > 1;
        activeFullTimeCount = fullTimeCount;
        return (hasConflicts, activeFullTimeCount);
    }

    function getEmploymentHistory(address employee) public view returns (Employment[] memory) {
        uint256[] memory tokenIds = getEmploymentsByOwner(employee);
        Employment[] memory history = new Employment[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            history[i] = employments[tokenIds[i]];
        }
        return history;
    }
    
    function verifyCompanyLegitimacy(address companyAddress) public view returns (bool isVerified, uint256 trustScore, string[] memory warnings) {
        CompanyProfile memory profile = companyProfiles[companyAddress];
        return (profile.isVerified, profile.trustScore, profile.redFlags);
    }

    function flagFraudulentCompany(address companyAddress, string memory reason) public onlyOwner {
        companyProfiles[companyAddress].redFlags.push(reason);
        if (companyProfiles[companyAddress].trustScore >= 20) {
            companyProfiles[companyAddress].trustScore -= 20;
        } else {
            companyProfiles[companyAddress].trustScore = 0;
        }
        emit CompanyFlagged(companyAddress, reason);
    }
}