// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./UserRegistrationContract.sol";
import "./TaskCreation.sol";

contract MCScontract {
    UserRegistrationContract public userRegistrationContract;
    TaskCreation public taskCreationContract;
    uint256 private dataCounter;
    enum TaskStatus { Available, Failed, Completed }

    // Structure to represent data uploaded by the worker
    struct Data {
        address workerAddress;
        address requesterAddress;
        uint256 taskID;
        string dataType;
        uint256 depositDate;
        string dataContent;
    }

    // Mapping to store data
    mapping(uint256 => Data) public data;

    // Event to signal the upload of data
    event DataUploaded(uint256 indexed dataID, address indexed workerAddress, address indexed requesterAddress, uint256 taskID, string dataType, uint256 depositDate, string dataContent);

    constructor(address userRegistrationAddress, address taskCreationAddress) {
        userRegistrationContract = UserRegistrationContract(userRegistrationAddress);
        taskCreationContract = TaskCreation(taskCreationAddress);
    }

    function MCS(uint256 taskID) public returns (TaskStatus) {
    // Get task details
    (
            address requesterAddress,
            string memory objective,
            uint256 reward,
            uint256 deposit,
            string memory typeData,
            uint256 deadline,
            string memory taskstatus
        ) = taskCreationContract.getTaskDetails(taskID);

    // Worker selection
    address workerAddress = workerSelection();
    userRegistrationContract.subtractPoints(workerAddress, deposit);
    uint256 temps = block.timestamp;
    //uint256 temps2 = block.timestamp+ 30 days;



    
    // Check if the worker has enough points
    if (userRegistrationContract.getPoints(workerAddress) < deposit) {
        return TaskStatus.Available;
    }

    // Check if the deadline has passed
    if (temps < deadline) {
        taskCreationContract.updateTaskStatus(taskID, "Failed");
        return TaskStatus.Failed;
    }

    // Upload data and get data ID
    uint256 dataID = uploadData(taskID, workerAddress, "Data Type", "Sample Data");

    // Validate data
    string memory feedback = dataValidate(dataID, "Non", requesterAddress);

    if (keccak256(abi.encodePacked((feedback))) == keccak256(abi.encodePacked(("Valide")))) {
        // Perform payment distribution
        paymentDistribution(workerAddress, taskID);

        // Update task status to "Completed"
        taskCreationContract.updateTaskStatus(taskID, "Completed");

        return TaskStatus.Completed;
    } else {
        return TaskStatus.Available;
    }
}

    function workerSelection() public view returns (address) {
        address[] memory workers = userRegistrationContract.getWorkers();
        require(workers.length > 0, "No workers available");

        address selectedWorker = workers[0];
        uint256 maxPoints = userRegistrationContract.getPoints(selectedWorker);

        for (uint256 i = 1; i < workers.length; i++) {
            uint256 workerPoints = userRegistrationContract.getPoints(workers[i]);

            if (workerPoints > maxPoints) {
                maxPoints = workerPoints;
                selectedWorker = workers[i];
            }
        }

        return selectedWorker;
    }

    function uploadData(uint256 taskID, address workerAddress, string memory dataType, string memory dataContent) public returns (uint256) {
        require(taskCreationContract.isTaskAvailable(taskID), "Task not available");

        // Get the address of the selected worker
        address requesterAddress = taskCreationContract.getRequesterAddress(taskID);
        uint256 depositDate = block.timestamp;

        // Generate a unique data ID
        uint256 dataID = generateUniqueDataID();

        // Store data in the mapping
        data[dataID] = Data({
            workerAddress: workerAddress,
            requesterAddress: requesterAddress,
            taskID: taskID,
            dataType: dataType,
            depositDate: depositDate,
            dataContent: dataContent
        });

        // Emit an event to signal the upload of data
        emit DataUploaded(dataID, workerAddress, requesterAddress, taskID, dataType, depositDate, dataContent);

        // Return the data ID
        return dataID;
    }

    function generateUniqueDataID() private returns (uint256) {
        dataCounter++;
        return dataCounter;
    }

    function dataValidate(uint256 dataID, string memory feedback, address requesterAddress) public view returns (string memory) {
        require(bytes(feedback).length > 0, "Feedback cannot be empty");
        require(data[dataID].requesterAddress == requesterAddress, "Only the requester can validate data");

        // Check the feedback value
        if (keccak256(abi.encodePacked((feedback))) == keccak256(abi.encodePacked(("Non")))) {
            // If feedback is "Non", mark data as invalid
            return "Nonvalide";
        } else {
            // If feedback is anything other than "Non", mark data as valid
            return "Valide";
        }
    }

    // Function to distribute payment to the worker
    function paymentDistribution(address workerAddress, uint256 taskID) public returns (bool) {
        // Obtain task details
        (
            address taskRequesterAddress,
            string memory objective,
            uint256 reward,
            uint256 deposit,
            string memory typeData,
            uint256 deadline,
            string memory status
        ) = taskCreationContract.getTaskDetails(taskID);

        // Add the reward and deposit to the worker's points balance
        userRegistrationContract.addPoints(workerAddress, reward + deposit);

        // Subtract the deposit already paid by the worker at the beginning
        userRegistrationContract.subtractPoints(taskRequesterAddress, deposit);

        // Uncomment the next line if you have a function to mark the task as completed
        // taskCreationContract.markTaskAsCompleted(taskID);

        // Return true to indicate successful distribution
        return true;
    }
    
}
