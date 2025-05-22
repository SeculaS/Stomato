
const ChirConsent = artifacts.require("ChirConsent");

module.exports = async function (deployer) {
    await deployer.deploy(ChirConsent);
};