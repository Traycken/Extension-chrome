// Fonction pour récupérer les données JSON et mettre à jour le titre
function checkTwitchStatus() {
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
      // Recherche de l'objet avec la clé "R0diK"
      let r0dik = data.find(channel => channel.R0diK);

      if (r0dik && r0dik.R0diK) {
        if (r0dik.R0diK.live) {
            // Vérifie si les données pour R0diK sont valides et met à jour le titre
            let title = r0dik.R0diK.title;
            if (title) {
                document.getElementById('title').textContent = title;
            } else {
                document.getElementById('title').textContent = 'Titre non disponible';
            }

            // Mise à jour de l'image du jeu (game-thumbnail)
            let gameId = r0dik.R0diK.game_id; // Identifiant du jeu
            if (gameId) {
                document.getElementById('game-logo').src = `https://static-cdn.jtvnw.net/ttv-boxart/${gameId}_IGDB-96x144.jpg`;
                document.getElementById('game-name').textContent = r0dik.R0diK.game_name;
                document.getElementById('live-text').textContent = `${r0dik.R0diK.viewer_count} viewers`;
                document.getElementById('game-logo').style.display = 'block';
                document.getElementById('viewersCount').style.display = 'block';

                if (r0dik.R0diK.started_at) {
                  const startedAt = new Date(r0dik.R0diK.started_at);
                  const now = new Date();
                  const diff = now - startedAt;
                  const uptime = `${Math.floor(diff / 3600000)}h${Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0')}`;
                  document.getElementById('game-uptime').textContent = `Depuis : ${uptime}`;
                } else {
                  document.getElementById('game-uptime').textContent = 'Depuis : 0h00';
                }
              
            } else {
                document.getElementById('game-logo').src = 'https://static-cdn.jtvnw.net/ttv-static/404_boxart-96x144.jpg';
            }
        } else {
            document.getElementById('title').textContent = 'Offline';
            document.getElementById('title').style.fontSize = '24px';
            document.getElementById('game-logo').src = 'mp3/icon70.png';
        }
      } else {
        console.error('Données manquantes ou incorrectes');
        document.getElementById('title').textContent = 'Erreur dans les données';
      }
    })
    .catch(err => {
      // Affiche un message d'erreur si la requête échoue
      document.getElementById('title').textContent = 'Impossible de récupérer les informations';
    });
}

// Lancer la fonction pour mettre à jour le titre et l'image
checkTwitchStatus();
