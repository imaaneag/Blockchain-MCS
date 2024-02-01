// scripts/testValidateData.js

const MCScontract = artifacts.require("MCScontract");

module.exports = async function (callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const mcsContract = await MCScontract.deployed();

    // Assume you have a data ID that you want to validate
    const dataID = 1;

    // Assume the requester provides feedback (could be "Oui" or "Non")
    const feedback = "Non";

    // Specify the requester's Ethereum address
    const requesterAddress = accounts[3]; // Change this to the requester's address

    // Call the validateData function with the specified requester's address
    const validationStatus = await mcsContract.dataValidate(dataID, feedback, requesterAddress);

    console.log("Validation Status:", validationStatus);

    callback();
  } catch (error) {
    console.error("Error:", error);
    callback(error);
  }
};

