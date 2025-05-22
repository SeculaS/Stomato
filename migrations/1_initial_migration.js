
const ChirConsent = artifacts.require("ChirConsent");

module.exports = async function (deployer) {
    await deployer.deploy(ChirConsent, { gas: 6000000 });
};