// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract UserRegistrationContract {
    // Structure pour représenter un utilisateur
    struct User {
        string profile; // Profil de l'utilisateur (Requester ou Worker)
        uint256 points;
    }

    // Mapping pour associer une adresse Ethereum à un utilisateur
    mapping(address => User) public users;

    // Ensembles pour les adresses des Requesters et Workers
    address[] public requesterPool;
    address[] public workerPool;

    // Événements pour signaler l'enregistrement d'un utilisateur
    event UserRegistered(address indexed user, string profile, uint256 points);
    // Événements pour signaler l'ajout d'un utilisateur au pool
    event RequesterAdded(address indexed requester);
    event WorkerAdded(address indexed worker);

    // Fonction d'enregistrement d'un nouvel utilisateur
    function addUser(string memory profile, uint256 points, address userId) public returns (bool) {
        // Vérifiez si l'utilisateur est déjà enregistré
        require(bytes(users[userId].profile).length == 0, "User already registered");

        // Vérifiez si l'adresse n'est pas déjà dans le pool 
        require(keccak256(bytes(profile)) != keccak256(bytes("Worker")) || !isAddressInArray(userId, workerPool), "Worker already registered");
        require(keccak256(bytes(profile)) != keccak256(bytes("Requester")) || !isAddressInArray(userId, requesterPool), "Requester already registered");

        // Initialiser l'utilisateur avec ses données
        users[userId] = User({
            profile: profile,
            points: points
        });

        // Émettre un événement pour signaler l'enregistrement de l'utilisateur
        emit UserRegistered(userId, profile, points);

        // Ajouter l'adresse de l'utilisateur au pool approprié
        if (keccak256(bytes(profile)) == keccak256(bytes("Requester"))) {
            requesterPool.push(userId);
            emit RequesterAdded(userId);
        } else if (keccak256(bytes(profile)) == keccak256(bytes("Worker"))) {
            workerPool.push(userId);
            emit WorkerAdded(userId);
        }

        // Retourner vrai pour indiquer un enregistrement réussi
        return true;
    }

    // Fonction pour vérifier si une adresse existe dans un tableau
    function isAddressInArray(address _address, address[] storage _array) internal view returns (bool) {
        for (uint256 i = 0; i < _array.length; i++) {
            if (_array[i] == _address) {
                return true;
            }
        }
        return false;
    }

    // Fonctions pour récupérer les adresses des Requesters et Workers
    function getRequesters() public view returns (address[] memory) {
        return requesterPool;
    }

    function getWorkers() public view returns (address[] memory) {
        return workerPool;
    }

    function isRequesterRegistered(address requesterAddress) public view returns (bool) {
        return keccak256(bytes(users[requesterAddress].profile)) == keccak256(bytes("Requester"));
    }

    function getPoints(address userAddress) public view returns (uint256) {
        return users[userAddress].points;
    }

    function addPoints(address userAddress, uint256 pointsToAdd) public {
        users[userAddress].points += pointsToAdd;
    }

    function subtractPoints(address userAddress, uint256 pointsToSubtract) public {
        users[userAddress].points -= pointsToSubtract;
    }
}