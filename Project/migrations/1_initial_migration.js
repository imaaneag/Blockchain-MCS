const UserRegistrationContract = artifacts.require("UserRegistrationContract");

module.exports = function(deployer) {
  deployer.deploy(UserRegistrationContract);
};