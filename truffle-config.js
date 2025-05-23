module.exports = {
    networks: {
        medical: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*",
            gas: 6721975,
            gasPrice: 20000000000,
        },
    },
    compilers: {
        solc: {
            version: "^0.8.0", // Must match your contract pragma (^0.8.0)
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200,
                },
                evmVersion: "london" // Helps avoid subtle opcode issues
            },
        },
    },
};
