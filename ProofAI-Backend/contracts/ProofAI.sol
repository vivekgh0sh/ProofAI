// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ProofAI is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Credential {
        string credentialType;
        string issuerName;
        uint256 trustScore;
        uint256 issuedDate;
        bool isRevoked;
    }

    mapping(uint256 => Credential) public credentials;
    mapping(uint256 => string) private _tokenURIs;

    event CredentialMinted(address indexed user, uint256 indexed tokenId, string credentialType, uint256 trustScore);
    event CredentialRevoked(uint256 indexed tokenId);

    constructor() ERC721("ProofAI Verifiable Credential", "PROOF") {}

    function _transfer(address from, address to, uint256 tokenId) internal override {
        require(from == address(0), "ProofAI SBT: This token is soulbound and cannot be transferred.");
        super._transfer(from, to, tokenId);
    }

    // CORRECTED: Simplified the override specifier
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
}