// Afficher une notification avec une durée réduite
function showNotification() {
  chrome.notifications.create('', {
    type: 'basic',
    iconUrl: chrome.runtime.getURL('../images/icon70.png'),
    title: 'R0diK - Enregistré !',
    message: "Vos changements d'options ont bien été pris en compte !",
    priority: 2
  }, function(notificationId) {
    setTimeout(function () {
      chrome.notifications.clear(notificationId);
    }, 2000); // 2000 ms = 2 secondes
  });
}

document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("audio");
    const thresholdInput = document.getElementById("threshold");
    const thresholdValue = document.getElementById("threshold-value");
    const playButton = document.getElementById("playButton");
    const saveButton = document.getElementById("save-cfg");
    const quitButton = document.getElementById("quit-tab");
    const notifCheckbox = document.getElementById("notifLC");

    // Chargement automatique du volume sauvegardé
    const savedVolume = localStorage.getItem("savedVolume");
    if (savedVolume !== null) {
        thresholdInput.value = savedVolume;
        thresholdValue.textContent = Math.round(savedVolume * 100) + "%";
    }

    // Chargement de l'état du checkbox
    const savedNotifState = localStorage.getItem("notifLC");
    if (savedNotifState !== null) {
        notifCheckbox.checked = savedNotifState === "true";
    }

    // Met à jour l'affichage du volume en pourcentage
    thresholdInput.addEventListener("input", function () {
        thresholdValue.textContent = Math.round(thresholdInput.value * 100) + "%";
    });

    // Joue le son au volume défini par le seuil
    playButton.addEventListener("click", function () {
        audio.volume = parseFloat(thresholdInput.value);
        audio.currentTime = 0; // Recommence au début
        audio.play();
    });

    // Sauvegarde la valeur du volume et du statut du checkbox dans chrome.storage.local
    saveButton.addEventListener("click", function () {
        const volume = thresholdInput.value;
        const notifState = notifCheckbox.checked;

        // Sauvegarder dans chrome.storage.local
        chrome.storage.local.set({ 
            notifLC: notifState,
            savedVolume: volume 
        }, function() {
            showNotification(); // Affiche la notification si nécessaire
        });
    });

    // Quitter l'onglet
    quitButton.addEventListener("click", function () {
        window.top.close();
    });
});

