const MCScontract = artifacts.require("MCScontract");
const UserRegistrationContract = artifacts.require("UserRegistrationContract");
const TaskCreation = artifacts.require("TaskCreation");

module.exports = function (deployer) {
  deployer.deploy(MCScontract, UserRegistrationContract.address, TaskCreation.address);
};
