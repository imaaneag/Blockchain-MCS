const UserRegistrationContract = artifacts.require("UserRegistrationContract");
const TaskCreation = artifacts.require("TaskCreation");
const MCScontract = artifacts.require("MCScontract");


module.exports = async function(callback) {
  let userRegistrationContract;  // Declare userRegistrationContract outside the try-catch block
  let mcsContract;


  try {
    const accounts = await web3.eth.getAccounts();
    userRegistrationContract = await UserRegistrationContract.deployed();
    taskCreationContract = await TaskCreation.deployed();
    mcsContract = await MCScontract.deployed();

    console.log("------------------------------------- User Registration -----------------------------------------------");


    // Register a new user as a "Requester" with 100 points using accounts[1]
    
    await userRegistrationContract.addUser("Requester", 100, accounts[1] );

    // Register a new user as a "Requester" with 100 points using accounts[2]
    await userRegistrationContract.addUser("Requester", 100,accounts[2] );

    console.log("User registered successfully as a requester!");

    // Register another user as a "Worker" with 150 points using accounts[3]
    await userRegistrationContract.addUser("Worker", 0, accounts[3] );

    // Register another user as a "Worker" with 150 points using accounts[4]
    await userRegistrationContract.addUser("Worker", 50, accounts[4]);

    // Register another user as a "Worker" with 150 points using accounts[5]
    await userRegistrationContract.addUser("Worker", 150,accounts[5] );

    console.log("User registered successfully as a worker!");

    // Get and print the list of requesters
    const requestersList = await userRegistrationContract.getRequesters();
    console.log("Requesters List:", requestersList);

    // Get and print the list of workers
    const workersList = await userRegistrationContract.getWorkers();
    console.log("Workers List:", workersList);


    console.log("-------------------------------------Task Creation -----------------------------------------------");


    // -------------------------------------------------------------------------------------------------------------


    // Assign the requester's address directly (replace accounts[4] with the actual address)
    const requester = accounts[1];

    // Create a new task with the specified requester's address
    const txResulttask = await taskCreationContract.createTask(
      requester,
      "Sample Objective",
      100,
      10,
      "Data Type",
      Math.floor(Date.now() / 1000) + 3600
    );

    // Extract task ID from the event logs
    const taskID = txResulttask.logs[0].args.taskID.toNumber();
    console.log("Task created successfully with ID:", taskID);

    // Get the details of the created task
    const taskDetails = await taskCreationContract.getTaskDetails(taskID);

    // Print each property individually
    console.log("Task Details:");

    console.log("Requester Address:", taskDetails[0]);
    console.log("Objective:", taskDetails[1]);
    console.log("Reward:", taskDetails[2].toString()); // Convert BN to string
    console.log("Deposit:", taskDetails[3].toString()); // Convert BN to string
    console.log("Type Data:", taskDetails[4]);
    console.log("Deadline:", new Date(taskDetails[5].toNumber() * 1000).toLocaleString()); // Convert timestamp to date
    console.log("Status:", taskDetails[6]);

    console.log("-------------------------------------Worker Selection-----------------------------------------------");

    //--------------------------------------------------------------------------------------------------------------------
    // Call the workerSelection function
    const selectedWorker = await mcsContract.workerSelection();

    console.log("Selected Worker:", selectedWorker);


    console.log("-------------------------------------Upload data ---------------------------------------------------");
    //-------------------------------------------------------------------------------------------------------------------------

    // Get the task ID from your task creation test or any other source
    //const taskID = 1; // Replace with the actual task ID

    // Call the uploadData function
    const txResult = await mcsContract.uploadData(taskID, selectedWorker,"Data Type", "Sample Data");

    // Extract data ID from the event logs
    const dataID = txResult.logs[0].args.dataID.toNumber();
    console.log("Data uploaded successfully with ID:", dataID);

    // Retrieve and print the details of the uploaded data
    const dataDetails = await mcsContract.data(dataID);
    console.log("Data Details:");
    console.log("Worker Address:", dataDetails.workerAddress);
    console.log("Requester Address:", dataDetails.requesterAddress);
    console.log("Task ID:", dataDetails.taskID.toNumber());
    console.log("Data Type:", dataDetails.dataType);
    console.log("Deposit Date:", new Date(dataDetails.depositDate.toNumber() * 1000).toLocaleString());
    console.log("Data Content:", dataDetails.dataContent);



    console.log("------------------------------------Data Validation-----------------------------------------------");
    // Assume you have a data ID that you want to validate
    //const dataID = 1;

    // Assume the requester provides feedback (could be "Oui" or "Non")
    const feedback = "Non";

    // Specify the requester's Ethereum address
    //const requesterAddress = accounts[3]; // Change this to the requester's address

    // Call the validateData function with the specified requester's address
    const validationStatus = await mcsContract.dataValidate(dataID, feedback, requester);
    

    console.log("Validation Status:", validationStatus);

    console.log("====> Informations de sélection de l'utilisateur avant le contrat MCS <====");

    // Obtenir les points de utilisateur choise avant defair la modification par la function MSC
    const pointWorkerSelectionBefore = (await userRegistrationContract.getPoints(selectedWorker)).toNumber();
    console.log("Points du travailleur sélectionné (Avant MCS) :", pointWorkerSelectionBefore);

    await userRegistrationContract.subtractPoints(selectedWorker,10)
    console.log("====> Informations de sélection de l'utilisateur après le contrat MCS <====");

    // Obtenir les points à nouveau après la fonction MCS
    const pointWorkerSelectionAfter = (await userRegistrationContract.getPoints(selectedWorker)).toNumber();
    console.log("Points du travailleur sélectionné (Après MCS) :", pointWorkerSelectionAfter);


    callback(); 
  } catch (error) {
    console.error("Error:", error);
    callback(error);
  }
  
};


