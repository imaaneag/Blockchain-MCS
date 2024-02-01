// scripts/testWorkerSelection.js

const MCScontract = artifacts.require("MCScontract");

module.exports = async function (callback) {
  let mcsContract; // Declare mcsContract outside the try-catch block

  try {
    const accounts = await web3.eth.getAccounts();
    mcsContract = await MCScontract.deployed();

    // Call the workerSelection function
    const selectedWorker = await mcsContract.workerSelection();

    console.log("Selected Worker:", selectedWorker);

    callback();
  } catch (error) {
    console.error("Error:", error);

    // If there is an error, still try to get the selected worker
    try {
      if (!mcsContract) {
        mcsContract = await MCScontract.deployed();
      }

      const selectedWorkerOnError = await mcsContract.workerSelection();
      console.log("Selected Worker (on error):", selectedWorkerOnError);
    } catch (errorOnSelectedWorker) {
      console.error("Error on getting selected worker:", errorOnSelectedWorker);
    }

    callback(error);
  }
};