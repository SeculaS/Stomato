// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalConsent {
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

    function getConsent(address patient) public view returns (Consent memory) {
        return consents[patient];
    }
}
