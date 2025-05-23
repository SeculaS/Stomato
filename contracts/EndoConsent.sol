// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EndoConsent {
    struct Consent {
        string patientName;
        string dateSigned;
        bool agreed;
    }
    constructor() {

    }
    mapping(address => Consent) public consents;

    event ConsentSigned(address patient, string name, string dateSigned);

    function signConsent(string memory _name, string memory _date) public {
        consents[msg.sender] = Consent(_name, _date, true);
        emit ConsentSigned(msg.sender, _name, _date);
    }

    function getConsent(address patient) public view returns (string memory, string memory, bool) {
        Consent memory c = consents[patient];
        return (c.patientName, c.dateSigned, c.agreed);
    }
}
