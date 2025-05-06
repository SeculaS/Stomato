const MedicalConsent = artifacts.require("MedicalConsent");

module.exports = function (deployer) {
    deployer.deploy(MedicalConsent);
};