const EndoConsent = artifacts.require("EndoConsent");
const ChirConsent = artifacts.require("ChirConsent");
const PedoConsent = artifacts.require("PedoConsent");
const GeneConsent = artifacts.require("GeneConsent");
const MedicalConsent = artifacts.require("MedicalConsent");

module.exports = function (deployer) {
    deployer.deploy(EndoConsent);
    deployer.deploy(ChirConsent);
    deployer.deploy(GeneConsent);
    deployer.deploy(PedoConsent);
    deployer.deploy(MedicalConsent);
};