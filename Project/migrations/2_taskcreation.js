const TaskCreation = artifacts.require("TaskCreation");

module.exports = function(deployer) {
  deployer.deploy(TaskCreation);
};