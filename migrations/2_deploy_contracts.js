// eslint-disable-next-line no-undef
const EndoConsent = artifacts.require("EndoConsent");
// eslint-disable-next-line no-undef
const ChirConsent = artifacts.require("ChirConsent");
// eslint-disable-next-line no-undef
const PedoConsent = artifacts.require("PedoConsent");
// eslint-disable-next-line no-undef
const GeneConsent = artifacts.require("GeneConsent");
// eslint-disable-next-line no-undef
const MedicalConsent = artifacts.require("MedicalConsent");

module.exports = function (deployer) {
    deployer.deploy(EndoConsent);
    deployer.deploy(ChirConsent);
    deployer.deploy(GeneConsent);
    deployer.deploy(PedoConsent);
    deployer.deploy(MedicalConsent);
};