export function playSound(name = 'pickup') {
  const sounds = {
    pickup: '/pickup.wav',
  };
  const src = sounds[name] || sounds.pickup;
  const audio = new Audio(src);
  audio.volume = 0.5;
  audio.play().catch(() => {});
}
