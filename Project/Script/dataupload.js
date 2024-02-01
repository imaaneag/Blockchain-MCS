// scripts/testUploadData.js

const MCScontract = artifacts.require("MCScontract");

module.exports = async function (callback) {
  let mcsContract;

  try {
    const accounts = await web3.eth.getAccounts();
    mcsContract = await MCScontract.deployed();

    // Get the task ID from your task creation test or any other source
    const taskID = 1; // Replace with the actual task ID

    // Call the uploadData function
    const txResult = await mcsContract.uploadData(taskID, "Data Type", "Sample Data");

    // Extract data ID from the event logs
    const dataID = txResult.logs[0].args.dataID.toNumber();
    console.log("Data uploaded successfully with ID:", dataID);

    // Retrieve and print the details of the uploaded data
    const dataDetails = await mcsContract.data(dataID);
    console.log("Data Details:");
    console.log("Worker Address:", dataDetails.workerAddress);
    console.log("Requester Address:", dataDetails.requesterAddress);
    console.log("Task ID:", dataDetails.taskID.toNumber());
    console.log("Data Type:", dataDetails.dataType);
    console.log("Deposit Date:", new Date(dataDetails.depositDate.toNumber() * 1000).toLocaleString());
    console.log("Data Content:", dataDetails.dataContent);

    callback();
  } catch (error) {
    console.error("Error:", error);
    callback(error);
  }
};
