const UserRegistrationContract = artifacts.require("UserRegistrationContract");

module.exports = async function(callback) {
  let userRegistrationContract;  // Declare userRegistrationContract outside the try-catch block

  try {
    const accounts = await web3.eth.getAccounts();
    userRegistrationContract = await UserRegistrationContract.deployed();

    // Register a new user as a "Requester" with 100 points using accounts[4]
    await userRegistrationContract.addUser(UserRegistrationContract.UserProfile.Requester, 100, { from: accounts[5] });

    console.log("User registered successfully as a requester!");

    // Register another user as a "Worker" with 150 points using accounts[3]
    await userRegistrationContract.addUser(UserRegistrationContract.UserProfile.Worker, 150, { from: accounts[6] });

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

    // If there is an error, still try to get and print the lists of requesters and workers
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
