# Creds Protocol Core
**Creds-Protocol is a digital identity infrastructure for developers and partners built on the open source Semaphore Protocol, 
the circom language and zk toolkit on FVM.**
 
This repo contains the core Creds Protocol contract, having the functionality of creating, issuing and verifying the creds using ZK Proofs.

### Clone the repo

```sh
git clone https://github.com/Creds-Protocol/creds-protocol-core.git
```

### Install the node modules

```sh
cd creds-protocol-core

npm install
```

### The Creds Protocol Contracts

The folder structure of the [Core Creds Protocol contracts](https://github.com/Creds-Protocol/creds-protocol-core/tree/main/contracts) is as below

    .
    ├── base                        # Base Contracts
    │   ├── CredentialConstants.sol    # Constants
    │   ├── CredentialCreds.sol        # Base functions for managing Creds
    │   └── CredentialCore.sol         # Core functions for managing zk proof verification
    ├── interfaces                  # Interfaces
    │   ├── ICredential.sol            # Interface Credential contract
    │   ├── ICredentialCore.sol        # Interface for Core Credential contract
    │   ├── ICredentialCreds.sol       # Interface for Creds contract
    │   ├── ICredentialNullifiers.sol  # Interface to handle nullifiers
    │   └── IVerifier.sol              # Core functions for managing zk proof verification
    ├── Verifiers                   # Verifier contracts with specific merkel tree depth
    └── Credential.sol              # Base Creds Protocol contract to create and issue creds

## Core Idea

The Creds Protocol Core is build with a vision that, the developers can create their custom cred issuance and verification contracts and upcomming Creds Protocol Identity Contracts are also based on the same.

## Executing the Creds Protocol Core flow

An example flow of Creds Protocol Core can be found [here](https://github.com/Creds-Protocol/creds-protocol-core/blob/main/tasks/execute.js)

The flow of Creds Protocol Core is as below
    
> User Identity Creation

The user idenity is created off chain using the Semaphore Idenity Library

> Creation of Cred

A cred can be created by interacting with the Credential contract's *createCred* function

> Issuing the Cred to Users

The creds are created on chain on FVM and are issued onchain as well, enabling other smart contracts to integrate the creds and add zk functionality with couple of line of code.
This can be done using *addIdentity* function.

> Verify 

The verification of the claim of user possesing a cred is done in two steps
  1. Off Chain Generation of proof
  2. On Chain Verification of proof
  
## Summary of example flow

1. Create two identities of two users - "Wallaby" and "Hyperspace"
2. Create a Cred - All teh cred details are stored in Cred URI which can be stored on IPFS similar to metadata stored on IPFS
3. Claiming the Cred - "Wallaby" would claim the cred
4. Generate the proof - Both the users generate the proof of possesing the Cred 
5. Verification -  "Wallaby" succesfully pass the verification check whereas "Hyperspace" fails to pass the verification
