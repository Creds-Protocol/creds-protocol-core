const { Identity } = require("@semaphore-protocol/identity")

task("generate-identity", "Generates Identity")
  .addParam("identity-secret", "Cred Id : ")
  .setAction(async (taskArgs) => {

    const identitySecret = taskArgs.identity-secret

    console.log("Generating Idenity of User 1")
    users.push({
      identity: new Identity(identitySecret),
      username: ethers.utils.formatBytes32String(identitySecret)
    })

    console.log("Idenity generated")

})

module.exports = {}