function checkTwitchStatus() {
  boxartSize = '96x144';
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
        let title = r0dik.R0diK.title;
        if (title) {
          document.getElementById('title').textContent = title;
        } else {
          document.getElementById('title').textContent = 'Titre non disponible';
        }
        if (r0dik.R0diK.game_id) {
            document.getElementById('game-logo').src = `https://static-cdn.jtvnw.net/ttv-boxart/${r0dik.R0diK.game_id}_IGDB-${boxartSize}.jpg`;
            document.getElementById('game-logo').style.display = 'block';
            document.getElementById('live-text').textContent = `${r0dik.R0diK.viewer_count} viewers`;
            document.getElementById('viewersCount').style.display = 'block';
            if (r0dik.R0diK.is_mature) {
              document.getElementById('mature').style.fontWeight = 'block';
              document.getElementById('mature').textContent = '🔞';
            }
            if (r0dik.R0diK.started_at) {
              const startedAt = new Date(r0dik.R0diK.started_at);
              const now = new Date();
              const diff = now - startedAt;
              const uptime = `${Math.floor(diff / 3600000)}h${Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0')}`;
              document.getElementById('game-uptime').innerHTML = `<br>Jeux : ${r0dik.R0diK.game_name}<br>Depuis : ${uptime}`;
            }
        } else {
          document.getElementById('game-logo').src = `https://static-cdn.jtvnw.net/ttv-static/404_boxart-${boxartSize}.jpg`;
        }
      } else {
        document.getElementById('title').textContent = 'Offline';
        document.getElementById('title').style.fontSize = '24px';
        document.getElementById('title').style.fontWeight = 'bold';
      }
    } else {
      console.error('Données manquantes ou incorrectes');
      document.getElementById('title').textContent = 'Erreur dans les données';
    }
  })
  .catch(err => {
    console.error(err);
    document.getElementById('title').textContent = 'Impossible de récupérer les informations';
  });
}

checkTwitchStatus();


function generateRandomBoxShadow(numShadows) {
  let shadows = '';
  for (let i = 0; i < numShadows; i++) {
      let x = Math.floor(Math.random() * (350));
      let y = Math.floor(Math.random() * (450*3));
      let color = `#${Math.floor(Math.random() * 16).toString(16)}${Math.floor(Math.random() * 16).toString(16)}${Math.floor(Math.random() * 16).toString(16)}`;
      shadows += `${x}px ${y}px ${color}, `;
  }
  return shadows.slice(0, -2);
}

function applyStarShadows() {

  const starstotals = 100

  const starElements = document.querySelectorAll('#stars, #stars2, #stars3');
  
  const starsCount = Math.floor(starstotals * 0.4);
  const stars2Count = Math.floor(starstotals * 0.35);
  const stars3Count = Math.floor(starstotals * 0.25);

  starElements[0].style.boxShadow = generateRandomBoxShadow(starsCount);
  starElements[1].style.boxShadow = generateRandomBoxShadow(stars2Count);
  starElements[2].style.boxShadow = generateRandomBoxShadow(stars3Count);
}

window.onload = applyStarShadows;


const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', (e) => {
  cursor.style.left = `${e.pageX + 32 / 2}px`;
  cursor.style.top = `${e.pageY + 32 / 2}px`;
});

document.addEventListener('mouseleave', () => {cursor.style.display = 'none'});
document.addEventListener('mouseenter', () => {cursor.style.display = 'block'});


const sounds = [
  "../mp3/sound.mp3"
];

const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
const sound = new Audio(randomSound);
document.addEventListener('click', (event) => {if (!event.target.closest('a, img, #game_link, #social-media, #cursor, #viewersCount')) {sound.play()}});


window.addEventListener('load', function() {
  // Charger le fichier update.xml
  fetch('../update.xml')
      .then(response => response.text())
      .then(data => {
          // Parser le XML et extraire la version
          var parser = new DOMParser();
          var xmlDoc = parser.parseFromString(data, "application/xml");
          var version = xmlDoc.getElementsByTagName("updatecheck")[0].getAttribute("version");

          // Mettre à jour l'élément version-text
          var versionElement = document.getElementById('version-text');
          if (versionElement) {
              versionElement.textContent = version;
          }
      })
      .catch(error => {
          console.error("Erreur lors du chargement du fichier update.xml : ", error);
      });
});
