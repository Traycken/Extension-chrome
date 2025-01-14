// Écoute les messages envoyés par le service worker
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.play) {
      playAudio(msg.play);
    }
  });
  
  // Fonction pour jouer le son
  function playAudio({ source, volume }) {
    const audio = new Audio(chrome.runtime.getURL(source));
    audio.volume = volume;
    audio.play().catch((err) => console.error("Erreur lors de la lecture du son :", err));
  }
  