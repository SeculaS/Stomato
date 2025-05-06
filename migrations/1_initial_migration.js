const MedicalConsent = artifacts.require("MedicalConsent");

module.exports = function (deployer) {
    deployer.deploy(MedicalConsent, { gas: 6721975 });  // Crește limita de gaz
};