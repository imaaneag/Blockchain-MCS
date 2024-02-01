const UserRegistrationContract = artifacts.require("UserRegistrationContract");

module.exports = async function(callback) {
  let userRegistrationContract;

  try {
    const accounts = await web3.eth.getAccounts();
    userRegistrationContract = await UserRegistrationContract.deployed();

    // Register another user with a profile "Worker" and 70 points using accounts[3]
    await userRegistrationContract.addUser("Worker", 70, accounts[3]);
    await userRegistrationContract.addUser("Worker", 10, accounts[4]);
    await userRegistrationContract.addUser("Worker", 5, accounts[5]);
    console.log("User registered successfully as a worker!");

    // Get and print the list of requesters
    const requestersList = await userRegistrationContract.getRequesters();
    console.log("Requesters List:", requestersList);

    // Get and print the list of workers
    const workersList = await userRegistrationContract.getWorkers();
    console.log("Workers List:", workersList);

    callback();
  } catch (error) {
    console.error("Error:", error);

    try {
      if (!userRegistrationContract) {
        userRegistrationContract = await UserRegistrationContract.deployed();
      }

      const requestersListOnError = await userRegistrationContract.getRequesters();
      console.log("Requesters List (on error):", requestersListOnError);

      const workersListOnError = await userRegistrationContract.getWorkers();
      console.log("Workers List (on error):", workersListOnError);
    } catch (errorOnLists) {
      console.error("Error on getting lists:", errorOnLists);
    }

    callback(error);
  }
};