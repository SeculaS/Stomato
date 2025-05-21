
const PedoConsent = artifacts.require("PedoConsent");

module.exports = async function (deployer) {
    await deployer.deploy(PedoConsent, { gas: 6000000 });
};