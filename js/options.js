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

  
window.onload = applyStarShadows;
window.addEventListener('resize', () => {applyStarShadows()});

const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', (e) => {
  cursor.style.left = `${e.pageX + 32 / 2}px`;
  cursor.style.top = `${e.pageY + 32 / 2}px`;
});

document.addEventListener('mouseleave', () => {cursor.style.display = 'none'});
document.addEventListener('mouseenter', () => {cursor.style.display = 'block'});


function generateRandomBoxShadow(numShadows) {
    let shadows = '';
    for (let i = 0; i < numShadows; i++) {
        let x = Math.floor(Math.random() * (window.innerWidth));
        let y = Math.floor(Math.random() * (window.innerHeight*3));
        let color = `#${Math.floor(Math.random() * 16).toString(16)}${Math.floor(Math.random() * 16).toString(16)}${Math.floor(Math.random() * 16).toString(16)}`;
        shadows += `${x}px ${y}px ${color}, `;
    }
    return shadows.slice(0, -2);
}

function applyStarShadows() {
    const coreLimit = Math.floor(1000 * (navigator.hardwareConcurrency / 8));
    const memoryLimit = Math.floor(1000 * (navigator.deviceMemory / 8));
    const starstotals = Math.min(Math.floor(window.innerWidth + window.innerHeight), Math.min(coreLimit, memoryLimit, 4500));

    const starElements = document.querySelectorAll('#stars, #stars2, #stars3');
    
    const starsCount = Math.floor(starstotals * 0.4);
    const stars2Count = Math.floor(starstotals * 0.35);
    const stars3Count = Math.floor(starstotals * 0.25);

    starElements[0].style.boxShadow = generateRandomBoxShadow(starsCount);
    starElements[1].style.boxShadow = generateRandomBoxShadow(stars2Count);
    starElements[2].style.boxShadow = generateRandomBoxShadow(stars3Count);
}

window.onload = applyStarShadows;