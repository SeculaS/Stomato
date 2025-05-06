module.exports = {
    networks: {
        medical: {
            host: "127.0.0.1",  // Adresa RPC din Ganache
            port: 7545,          // Portul la care Ganache rulează
            network_id: "5777",  // Id-ul rețelei din Ganache
            gas: 6721975,        // Limita de gaz
            gasPrice: 20000000000 // Prețul gazului
        }
    },
    compilers: {
        solc: {
            version: "^0.8.0"  // Asigură-te că folosești o versiune compatibilă
        }
    }
};
