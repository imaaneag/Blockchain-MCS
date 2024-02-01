const UserRegistration = artifacts.require("UserRegistrationContract");


module.exports = async function(callback) {
  let userRegistrationContract;  // Declare userRegistrationContract outside the try-catch block

  try {
    const accounts = await web3.eth.getAccounts();
    userRegistrationContract = await UserRegistration.deployed();

    // Register a new user as a "Requester" with 100 points using accounts[4]
    await userRegistrationContract.addUser("Requester", 100, accounts[1]);
    await userRegistrationContract.addUser("Requester", 90, accounts[2]);
    //await userRegistrationContract.addUser("Requester", 100, accounts[1], { from: accounts[1] });
    console.log("User registered successfully as a requester!");


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
        userRegistrationContract = await UserRegistration.deployed();
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