const TaskCreation = artifacts.require("TaskCreation");

module.exports = async function (callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const taskCreationContract = await TaskCreation.deployed();

    // Assign the requester's address directly (replace accounts[4] with the actual address)
    // const requesterAddress = accounts[1];
    const requesterAddress = accounts[2];

    // Create a new task with the specified requester's address
    /*
    const txResult = await taskCreationContract.createTask(
      requesterAddress,
      "Sample Objective",
      50,
      5,
      "Image",
      Math.floor(Date.now() / 1000) + 3600
    );
    */
  
    const txResult = await taskCreationContract.createTask(
      requesterAddress,
      "Sample Objective",
      100,
      10,
      "Image",
      Math.floor(Date.now() / 1000) + 3600
    );

    
    // Extract task ID from the event logs
    const taskID = txResult.logs[0].args.taskID.toNumber();
    console.log("Task created successfully with ID:", taskID);

    // Get the details of the created task
    const taskDetails = await taskCreationContract.getTaskDetails(taskID);

    // Print each property individually
    console.log("Task Details:");
    console.log("Requester Address:", taskDetails[0]);
    console.log("Objective:", taskDetails[1]);
    console.log("Reward:", taskDetails[2].toString()); // Convert BN to string
    console.log("Deposit:", taskDetails[3].toString()); // Convert BN to string
    console.log("Type Data:", taskDetails[4]);
    console.log("Deadline:", new Date(taskDetails[5].toNumber() * 1000).toLocaleString()); // Convert timestamp to date
    console.log("Status:", taskDetails[6]);

    callback();
  } catch (error) {
    console.error("Error:", error);
    callback(error);
  }
};