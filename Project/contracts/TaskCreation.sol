// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TaskCreation {
    // Structure pour represent une tâche
    struct Task {
        address requesterAddress;
        string objective;
        uint256 reward;
        uint256 deposit;
        string typeData;
        uint256 deadline;
        string status;
    }

    // Mapping pour stocker les tâches
    mapping(uint256 => Task) public tasks;

    // List pour stocker les ID des tâches crées
    uint256[] public taskList;

    // Counter pour générer un unique ID d'une tâche
    uint256 private taskCounter;

    // Event pour signaler la création d'une nouvelle tâche
    event TaskCreated(uint256 indexed taskID, address indexed requesterAddress, string objective, uint256 reward, uint256 deposit, string typeData, uint256 deadline, string status);

    // Constructor
    constructor() {
        // Initialiser le conter à 0
        taskCounter = 0;
    }

    // Fonction pour generer un unique ID pour une tâche
    function generateUniqueTaskID() private returns (uint256) {
        taskCounter++;
        return taskCounter;
    }

    // Fonction pour créer une nouvelle tâche
    function createTask(
    address requesterAddress,
    string memory objective,
    uint256 reward,
    uint256 deposit,
    string memory typeData,
    uint256 deadline
    ) public returns (uint256) {
    // Generater un unique task ID
    uint256 taskID = generateUniqueTaskID();

    // Créer une nouvelle tâche
    Task memory newTask = Task({
        requesterAddress: requesterAddress,
        objective: objective,
        reward: reward,
        deposit: deposit,
        typeData: typeData,
        deadline: deadline,
        status: "Available" // valeur initiale de status
    });

    // Stocker la tâche dans le mapping
    tasks[taskID] = newTask;

    // Ajouter le ID dans la list taskList
    taskList.push(taskID);

    // Emit un event pour signaler la creation d'une tâche
    emit TaskCreated(taskID, requesterAddress, objective, reward, deposit, typeData, deadline, "Available");

    // Returner le ID
    return taskID;
}


    // Fonction pour avoir la liste des ID
    function getTaskList() public view returns (uint256[] memory) {
        return taskList;
    }

    // Fonction pour avoir le contenue d'une tâche
    function getTaskDetails(uint256 taskID) public view returns (address, string memory, uint256, uint256, string memory, uint256, string memory) {
        Task storage task = tasks[taskID];
        require(task.requesterAddress != address(0), "Task does not exist");

        return (
            task.requesterAddress,
            task.objective,
            task.reward,
            task.deposit,
            task.typeData,
            task.deadline,
            task.status
        );
    }

    // Fonction pour verifier si la tâche est available (le status de tache)
    function isTaskAvailable(uint256 taskID) public view returns (bool) {
        Task storage task = tasks[taskID];
        return (task.requesterAddress != address(0) && keccak256(abi.encodePacked((task.status))) == keccak256(abi.encodePacked(("Available"))));
    }

    // Fonction pour avoir l'address d'un requester pour une tâche donnée
    function getRequesterAddress(uint256 taskID) public view returns (address) {
        Task storage task = tasks[taskID];
        require(task.requesterAddress != address(0), "Task does not exist");
        return task.requesterAddress;
    }

    //Fonction pour changer le status de la tâche
    function updateTaskStatus(uint256 taskID, string memory newStatus) public {
    require(tasks[taskID].requesterAddress != address(0), "Task does not exist");
    tasks[taskID].status = newStatus;
    }   
}
