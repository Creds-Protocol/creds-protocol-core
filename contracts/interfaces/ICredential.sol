//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

/// @title Credential interface.
/// @dev Interface of a Credential contract.
interface ICredential {
    error Credential__CallerIsNotTheCredAdmin();
    error Credential__MerkleTreeDepthIsNotSupported();
    error Credential__MerkleTreeRootIsExpired();
    error Credential__MerkleTreeRootIsNotPartOfTheCred();
    error Credential__YouAreUsingTheSameNillifierTwice();

    struct Verifier {
        address contractAddress;
        uint256 merkleTreeDepth;
    }

    /// It defines all the cred parameters, in addition to those in the Merkle tree.
    struct Cred {
        address admin;
        string credURI;
        uint256 merkleRootDuration;
        mapping(uint256 => uint256) merkleRootCreationDates;
        mapping(uint256 => bool) nullifierHashes;
    }

    /// @dev Emitted when an admin is assigned to a cred.
    /// @param credId: Id of the cred.
    /// @param oldAdmin: Old admin of the cred.
    /// @param newAdmin: New admin of the cred.
    event credAdminUpdated(uint256 indexed credId, address indexed oldAdmin, address indexed newAdmin);

    /// @dev Emitted when a Credential proof is verified.
    /// @param credId: Id of the cred.
    /// @param merkleTreeRoot: Root of the Merkle tree.
    /// @param externalNullifier: External nullifier.
    /// @param nullifierHash: Nullifier hash.
    /// @param signal: Credential signal.
    event ProofVerified(
        uint256 indexed credId,
        uint256 merkleTreeRoot,
        uint256 externalNullifier,
        uint256 nullifierHash,
        bytes32 signal
    );

    /// @dev Saves the nullifier hash to avoid double signaling and emits an event
    /// if the zero-knowledge proof is valid.
    /// @param credId: Id of the cred.
    /// @param merkleTreeRoot: Root of the Merkle tree.
    /// @param signal: Credential signal.
    /// @param nullifierHash: Nullifier hash.
    /// @param externalNullifier: External nullifier.
    /// @param proof: Zero-knowledge proof.
    function verifyProof(
        uint256 credId,
        uint256 merkleTreeRoot,
        bytes32 signal,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) external;

    /// @dev Creates a new cred
    /// @param credId: Id of the cred.
    /// @param depth: Depth of the tree.
    /// @param zeroValue: Zero value of the tree.
    /// @param admin: Admin of the cred.
    function createCred(
        uint256 credId,
        uint256 depth,
        uint256 zeroValue,
        address admin,
        string memory credURI
    ) external;

    /// @dev Creates a new cred
    /// @param credId: Id of the cred.
    /// @param depth: Depth of the tree.
    /// @param zeroValue: Zero value of the tree.
    /// @param admin: Admin of the cred.
    /// @param merkleTreeRootDuration: Time before the validity of a root expires.
    function createCred(
        uint256 credId,
        uint256 depth,
        uint256 zeroValue,
        address admin,
        uint256 merkleTreeRootDuration,
        string memory credURI
    ) external;

    /// @dev Updates the cred admin.
    /// @param credId: Id of the cred.
    /// @param newAdmin: New admin of the cred.
    function updateCredAdmin(uint256 credId, address newAdmin) external;

    /// @dev Adds a new idenity to an existing cred.
    /// @param credId: Id of the cred.
    /// @param identityCommitment: New identity commitment.
    function addIdentity(uint256 credId, uint256 identityCommitment) external;

    /// @dev Adds new identities to an existing cred.
    /// @param credId: Id of the cred.
    /// @param identityCommitments: New identity commitments.
    function addIdentities(uint256 credId, uint256[] calldata identityCommitments) external;

    /// @dev Updates an identity commitment of an existing cred. A proof of membership is
    /// needed to check if the node to be updated is part of the tree.
    /// @param credId: Id of the cred.
    /// @param identityCommitment: Existing identity commitment to be updated.
    /// @param newIdentityCommitment: New identity commitment.
    /// @param proofSiblings: Array of the sibling nodes of the proof of membership.
    /// @param proofPathIndices: Path of the proof of membership.
    function updateIdentity(
        uint256 credId,
        uint256 identityCommitment,
        uint256 newIdentityCommitment,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) external;

    /// @dev Removes a member from an existing cred. A proof of membership is
    /// needed to check if the node to be removed is part of the tree.
    /// @param credId: Id of the cred.
    /// @param identityCommitment: Identity commitment to be removed.
    /// @param proofSiblings: Array of the sibling nodes of the proof of membership.
    /// @param proofPathIndices: Path of the proof of membership.
    function removeIdentity(
        uint256 credId,
        uint256 identityCommitment,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) external;
}
