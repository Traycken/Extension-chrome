// Déclaration des variables globales
let notifLC, savedVolume, notifsoundLive;

// Vérifie si les valeurs existent déjà dans chrome.storage.local
chrome.storage.local.get(['notifLC', 'savedVolume', 'notifsoundLive'], function(result) {

  if (result.notifLC === undefined) {chrome.storage.local.set({ notifLC: true })}
  if (result.savedVolume === undefined) {chrome.storage.local.set({ savedVolume: 1 })}
  if (result.notifsoundLive === undefined) {chrome.storage.local.set({ notifsoundLive: "../mp3/sound.mp3" })}

  notifLC = result.notifLC;
  savedVolume = result.savedVolume;
  notifsoundLive = result.notifsoundLive;

  onStorageDataReady();
});

// Fonction à appeler après que les données soient prêtes
function onStorageDataReady() {

  async function playSound(source = "../mp3/sound.mp3", volume = null) {
    await createOffscreen();
    await chrome.runtime.sendMessage({ play: { source, volume } });
  }

  async function createOffscreen() {
    if (await chrome.offscreen.hasDocument()) return; // Vérifie si un document offscreen existe déjà
    await chrome.offscreen.createDocument({
      url: "../html/offscreen.html", // Chemin du document HTML
      reasons: ["AUDIO_PLAYBACK"],
      justification: "Requis pour jouer des sons via une extension." // Justification pour l'API
    });
  }

  // Fonction pour changer l'icône de l'extension
  function changeIcon(iconName) {
    chrome.action.setIcon({ path: iconName });
  }

  // Afficher une notification quand R0diK est en live
  function showNotification(gameName) {
    chrome.notifications.create('', {
      type: 'basic',
      iconUrl: chrome.runtime.getURL('../images/icon70.png'),
      title: 'R0diK - Je suis en live ! 🎮',
      message: `Je suis en live sur :\n${gameName}`,
      priority: 2
    });
  }

  // Lorsque l'utilisateur clique sur la notification
  chrome.notifications.onClicked.addListener(function() {
    chrome.tabs.create({ url: 'https://www.twitch.tv/r0dik' });
  });
  
  let isR0dikLive = false;
  let livetime = 0;
  // Fonction pour récupérer les données JSON toutes les 5 secondes
  function checkTwitchStatus() {
    try {
      fetch('http://beckaert.ddns.net/twitch-info', {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa('extension:K28f5XV64WuFkKxiCvqPUhBXYK1EtynT')
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Réponse du serveur incorrecte');
          }
          return response.json();
        })
        .then(data => {
          let r0dik = data.find(channel => channel.R0diK);

          if (r0dik && r0dik.R0diK) {
            if (r0dik.R0diK.live) {
              if (!isR0dikLive) {
                isR0dikLive = true;
                showNotification(r0dik.R0diK.game_name);
                playSound(notifsoundLive, savedVolume);
                changeIcon('../images/icon28Live.png');
              }
              livetime = 4;
            } else {
              if (isR0dikLive) {
                isR0dikLive = false;
                changeIcon('../images/icon28.png');
              }
              livetime = 0;
            }
          }
        })
        .catch(err => {
          if (isR0dikLive) {
            isR0dikLive = false;
            changeIcon('../images/icon28.png');
          }
        });
    } catch {
      if (isR0dikLive) {
        isR0dikLive = false;
        changeIcon('../images/icon28.png');
      }
    }
  }

  chrome.alarms.create("checkTwitchStatus", {periodInMinutes: (1 + livetime)});
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "checkTwitchStatus") {
        if (notifLC) {checkTwitchStatus()}
    }
  });
  checkTwitchStatus();

  chrome.alarms.create('keepAlive', { periodInMinutes: (25/60) });
  chrome.alarms.onAlarm.addListener(function(alarm) {
      if (alarm.name === 'keepAlive') {
        console.log('keepAlive');
      }
  });
};