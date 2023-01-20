const { Identity } = require("@semaphore-protocol/identity")
const { Group } = require("@semaphore-protocol/group")
const { generateProof, packToSolidityProof, verifyProof } = require("@semaphore-protocol/proof")
const { expect } = require("chai")

const util = require("util");
const request = util.promisify(require("request"));

task("execute", "Creates a Cred")
  .addParam("credid", "Cred Id : ")
  .addParam("admin", "Admin : ")
  .setAction(async (taskArgs) => {

    const contractAddr = "0x87128aAFf9EaAd6Ace9324dAF709d8Ca621aDA42"
    const credid = taskArgs.credid
    const admin = taskArgs.admin
    const networkId = network.name
    console.log("======= Executing Creds Protocol On ", networkId, " =======")
    console.log("")
    console.log("Credential Contract Address : 0x87128aAFf9EaAd6Ace9324dAF709d8Ca621aDA42")
    console.log("")
    const Credential = await ethers.getContractFactory("Credential", {
      libraries: {
        IncrementalBinaryTree: "0x7960fFf40FDe0bec2C510C968D0991E007C0a61d",
      },
    })


    //Get signer information
    const deployer = new ethers.Wallet("032c6bdae6cc5408b0362b1eac35bf2f373bda66f005d15fa20bdc412e41b1c8")

    const accounts = await ethers.getSigners()
    const signer = accounts[0]

    const priorityFee = await callRpc("eth_maxPriorityFeePerGas")

    async function callRpc(method, params) {
      var options = {
        method: "POST",
        url: "https://api.hyperspace.node.glif.io/rpc/v1",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: method,
          params: params,
          id: 1,
        }),
      };
      const res = await request(options);
      return JSON.parse(res.body).result;
  }

    const users = []
    const group = new Group()

    console.log("")
    console.log("Generating Idenity of User 1")
    users.push({
      identity: new Identity(),
      username: ethers.utils.formatBytes32String("User 1")
    })

    console.log("Idenity for User 1 generated ... 🔖")
    console.log("")

    console.log("Generating Idenity of User 2")
    users.push({
        identity: new Identity(),
        username: ethers.utils.formatBytes32String("User 2")
    })

    console.log("Idenity for User 2 generated ... 🔖")
    console.log("")

    const abi = [
        {
          "inputs": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "contractAddress",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "merkleTreeDepth",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ICredential.Verifier[]",
              "name": "_verifiers",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [],
          "name": "Credential__CallerIsNotTheCredAdmin",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "Credential__CredAlreadyExists",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "Credential__CredDoesNotExist",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "Credential__CredIdIsNotLessThanSnarkScalarField",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "Credential__MerkleTreeDepthIsNotSupported",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "Credential__MerkleTreeRootIsExpired",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "Credential__MerkleTreeRootIsNotPartOfTheCred",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "Credential__YouAreUsingTheSameNillifierTwice",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "credId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "merkleTreeDepth",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "zeroValue",
              "type": "uint256"
            }
          ],
          "name": "CredCreated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "credId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "identityCommitment",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "merkleTreeRoot",
              "type": "uint256"
            }
          ],
          "name": "IdentityAdded",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "credId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "identityCommitment",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "merkleTreeRoot",
              "type": "uint256"
            }
          ],
          "name": "IdentityRemoved",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "credId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "identityCommitment",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "newIdentityCommitment",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "merkleTreeRoot",
              "type": "uint256"
            }
          ],
          "name": "IdentityUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "nullifierHash",
              "type": "uint256"
            }
          ],
          "name": "NullifierHashAdded",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "credId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "merkleTreeRoot",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "externalNullifier",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "nullifierHash",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "bytes32",
              "name": "signal",
              "type": "bytes32"
            }
          ],
          "name": "ProofVerified",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "credId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "oldAdmin",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "newAdmin",
              "type": "address"
            }
          ],
          "name": "credAdminUpdated",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "credId",
              "type": "uint256"
            },
            {
              "internalType": "uint256[]",
              "name": "identityCommitments",
              "type": "uint256[]"
            }
          ],
          "name": "addIdentities",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "credId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "identityCommitment",
              "type": "uint256"
            }
          ],
          "name": "addIdentity",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "credId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "merkleTreeDepth",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "zeroValue",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "admin",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "credURI",
              "type": "string"
            }
          ],
          "name": "createCred",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "creds",
          "outputs": [
            {
              "internalType": "address",
              "name": "admin",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "credURI",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "merkleRootDuration",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "credID",
              "type": "uint256"
            }
          ],
          "name": "getMerkleTreeDepth",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "credID",
              "type": "uint256"
            }
          ],
          "name": "getMerkleTreeRoot",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "credID",
              "type": "uint256"
            }
          ],
          "name": "getNumberOfMerkleTreeLeaves",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "credId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "identityCommitment",
              "type": "uint256"
            },
            {
              "internalType": "uint256[]",
              "name": "proofSiblings",
              "type": "uint256[]"
            },
            {
              "internalType": "uint8[]",
              "name": "proofPathIndices",
              "type": "uint8[]"
            }
          ],
          "name": "removeIdentity",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "credId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "newAdmin",
              "type": "address"
            }
          ],
          "name": "updateCredAdmin",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "credId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "identityCommitment",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "newIdentityCommitment",
              "type": "uint256"
            },
            {
              "internalType": "uint256[]",
              "name": "proofSiblings",
              "type": "uint256[]"
            },
            {
              "internalType": "uint8[]",
              "name": "proofPathIndices",
              "type": "uint8[]"
            }
          ],
          "name": "updateIdentity",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "verifiers",
          "outputs": [
            {
              "internalType": "contract IVerifier",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "credId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "merkleTreeRoot",
              "type": "uint256"
            },
            {
              "internalType": "bytes32",
              "name": "signal",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "nullifierHash",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "externalNullifier",
              "type": "uint256"
            },
            {
              "internalType": "uint256[8]",
              "name": "proof",
              "type": "uint256[8]"
            }
          ],
          "name": "verifyProof",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];

    const credentialContract = new ethers.Contract(contractAddr, abi, signer)
    console.log("========================================================")
    console.log("")
    console.log("Creating Cred ", credid, " ...")

    const transaction01 = await credentialContract.createCred(credid, 20, 0, admin, "Cred URI", {
        gasLimit: 1000000000,
        maxPriorityFeePerGas: priorityFee
    })

    console.log("Cred ", credid, " created ✅")
    console.log("")
    console.log("====== User 1 - User 1 Claim Cred ======");
    console.log("")
    group.addMember(users[0].identity.generateCommitment())
    const transaction02 = await credentialContract.addIdentity(group.members[0], users[0].username, {
      gasLimit: 1000000000,
      maxPriorityFeePerGas: priorityFee
    })

    console.log("")
    console.log("User 1 Claimed a Cred successfully ⭐️")
    console.log("")

    const wasmFilePath = "./static/semaphore.wasm"
    const zkeyFilePath = "./static/semaphore.zkey"
    const signal = ethers.utils.formatBytes32String("Hello World")

    console.log("====== Generate Proof for User 1 - User 1 ======");

    const fullProof = await generateProof(users[0].identity, group, credid, signal, {
      wasmFilePath,
      zkeyFilePath
    })

    const solidityProof = packToSolidityProof(fullProof.proof)
    console.log("")
    console.log("Verifying Proof for User 1 ... ");
    console.log("")

    const transaction03 = await credentialContract.verifyProof(
        credid,
        fullProof.publicSignals.merkleRoot,
        signal,
        fullProof.publicSignals.nullifierHash,
        credid,
        solidityProof, {
          gasLimit: 1000000000,
          maxPriorityFeePerGas: priorityFee
        }
    )

    console.log("User 1's Proof Verified Successfully ✅")
    console.log("")

    console.log("====== Generate Proof for User 2 ======");
    console.log("")

    try{
      const fullProof01 = await generateProof(users[1].identity, group, credid, signal, {
        wasmFilePath,
        zkeyFilePath
      })

      const solidityProof01 = packToSolidityProof(fullProof01.proof)

      console.log("")
      console.log("Verifying Proof of User 2 ... ");
      console.log("")

      const transaction05 = await credentialContract.verifyProof(
        credid,
        fullProof01.publicSignals.merkleRoot,
        signal,
        fullProof01.publicSignals.nullifierHash,
        credid,
        solidityProof01, {
          gasLimit: 1000000000,
          maxPriorityFeePerGas: priorityFee
        }
    )
    } catch (error) {
        console.log(error.toString(), " 🚫", )
    }

})

module.exports = {}