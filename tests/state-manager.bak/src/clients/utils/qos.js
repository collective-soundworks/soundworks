// minimalistic, non subtle QoS
// to improved with the time...
export default function initQoS(client) {
  client.socket.addListener('close', () => {
    setTimeout(() => window.location.reload(true), 2000);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      window.location.reload(true);
    }
  }, false);
}
