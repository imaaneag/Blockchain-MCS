const UserRegistrationContract = artifacts.require("UserRegistrationContract");
const TaskCreation = artifacts.require("TaskCreation");
const MCScontract = artifacts.require("MCScontract");

module.exports = async function(callback) {
  let userRegistrationContract;  
  let mcsContract;

  try {
    const accounts = await web3.eth.getAccounts();
    userRegistrationContract = await UserRegistrationContract.deployed();
    taskCreationContract = await TaskCreation.deployed();
    mcsContract = await MCScontract.deployed();
/*
    console.log("------------------------------------- Enregistrement de l'utilisateur -----------------------------------------------");

    // Enregistrer un nouvel utilisateur en tant que "Demandeur" avec 100 points en utilisant accounts[1]
    await userRegistrationContract.addUser(UserRegistrationContract.UserProfile.Requester, 100, { from: accounts[1] });

    // Enregistrer un nouvel utilisateur en tant que "Demandeur" avec 100 points en utilisant accounts[2]
    await userRegistrationContract.addUser(UserRegistrationContract.UserProfile.Requester, 100, { from: accounts[2] });

    console.log("Utilisateur enregistré avec succès en tant que demandeur!");

    // Enregistrer un autre utilisateur en tant que "Travailleur" avec 150 points en utilisant accounts[3]
    await userRegistrationContract.addUser(UserRegistrationContract.UserProfile.Worker, 0, { from: accounts[3] });

    // Enregistrer un autre utilisateur en tant que "Travailleur" avec 150 points en utilisant accounts[4]
    await userRegistrationContract.addUser(UserRegistrationContract.UserProfile.Worker, 50, { from: accounts[4] });

    // Enregistrer un autre utilisateur en tant que "Travailleur" avec 150 points en utilisant accounts[5]
    await userRegistrationContract.addUser(UserRegistrationContract.UserProfile.Worker, 500, { from: accounts[5] });

    console.log("Utilisateur enregistré avec succès en tant que travailleur!");

    // Obtenir et afficher la liste des demandeurs
    const requestersList = await userRegistrationContract.getRequesters();
    console.log("Liste des demandeurs :", requestersList);

    // Obtenir et afficher la liste des travailleurs
    const workersList = await userRegistrationContract.getWorkers();
    console.log("Liste des travailleurs :", workersList);

    console.log("------------------------------------- Création de tâches -----------------------------------------------");

    // -------------------------------------------------------------------------------------------------------------

    // Assigner l'adresse du demandeur directement 
    const requester = accounts[1];

    // Créer une nouvelle tâche avec l'adresse du demandeur spécifiée
    const txResultTask = await taskCreationContract.createTask(
      requester,
      "Objectif d'exemple",
      100,
      10,
      "Type de données",
      Math.floor(new Date().getTime() / 1000) + 100000
    );

    // Extraire l'ID de la tâche des journaux d'événements
    const taskID = txResultTask.logs[0].args.taskID.toNumber();
    console.log("Tâche créée avec succès avec l'ID :", taskID);

    // Obtenir les détails de la tâche créée
    const taskDetails = await taskCreationContract.getTaskDetails(taskID);

    // Afficher chaque propriété individuellement
    console.log("Détails de la tâche :");
    console.log("Adresse du demandeur :", taskDetails[0]);
    console.log("Objectif :", taskDetails[1]);
    console.log("Récompense :", taskDetails[2].toString()); 
    console.log("Dépôt :", taskDetails[3].toString()); 
    console.log("Type de données :", taskDetails[4]);
    console.log("Date limite :", new Date(taskDetails[5].toNumber() * 1000).toLocaleString()); // Convertir le timestamp en format date
    console.log("Statut :", taskDetails[6]);*/

    console.log("------------------------------------- Contrat MCS -----------------------------------------------");

    //-----------------------------------------------------------------------------------------------------------------
    // Appeler la fonction MCS du contrat MCS
    const taskID = 2; 

    console.log("====> Informations de sélection de l'utilisateur avant le contrat MCS <====");
    const workerSelection = await mcsContract.workerSelection();
    console.log("Travailleur sélectionné :", workerSelection);

    // Obtenir les points de utilisateur choise avant defair la modification par la function MSC
    const pointWorkerSelectionBefore = (await userRegistrationContract.getPoints(workerSelection)).toNumber();
    console.log("Points du travailleur sélectionné (Avant MCS) :", pointWorkerSelectionBefore);

    const mcsContractResult = await mcsContract.MCS(taskID);

    console.log("====> Informations de sélection de l'utilisateur après le contrat MCS <====");

    // Obtenir les points à nouveau après la fonction MCS
    const pointWorkerSelectionAfter = (await userRegistrationContract.getPoints(workerSelection)).toNumber();
    console.log("Points du travailleur sélectionné (Après MCS) :", pointWorkerSelectionAfter);

    // Afficher le résultat de la fonction MCS du contrat
    // console.log("Résultat du contrat MCS :", mcsContractResult);

    // Récupérer et afficher les détails mis à jour de la tâche
    const updatedTaskDetails = await taskCreationContract.getTaskDetails(taskID);
    console.log("Détails mis à jour de la tâche :");
    console.log("Adresse du demandeur :", updatedTaskDetails[0]);
    console.log("Objectif :", updatedTaskDetails[1]);
    console.log("Récompense :", updatedTaskDetails[2].toString());
    console.log("Dépôt :", updatedTaskDetails[3].toString());
    console.log("Type de données :", updatedTaskDetails[4]);
    console.log("Date limite :", new Date(updatedTaskDetails[5].toNumber() * 1000).toLocaleString());
    console.log("Statut :", updatedTaskDetails[6]);

    callback();
  } catch (error) {
    console.error("Erreur :", error);
    callback(error);
  }
};
