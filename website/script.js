const copy = document.querySelector('#copy');
copy.addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(document.querySelector('#prompt').textContent);
    status.textContent = 'Copied. Paste this prompt into your coding agent.';
  } catch {
    status.textContent = 'Select and copy the installation prompt above.';
  }
});

// A pipeline with downstream backpressure. Ratios are a conceptual model:
// baseline verifies one item every 2s; Agent every 1s; Suite every .02s.
// Development is longer than verification, with the same baseline velocity.
// Agent development is 100x faster but admits new work only at verification pace.
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const flows = [...document.querySelectorAll('[data-flow]')].map(card => {
  const mode = card.dataset.flow;
  const dev = mode === 'before' ? 6 : .06;
  const verify = mode === 'before' ? 2 : mode === 'agent' ? 1 : .02;
  const cadence = verify;
  const group = card.querySelector('.flow-rings');
  const rings = Array.from({length:mode === 'suite' ? 5 : 6}, () => {
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('r','10');ring.setAttribute('cy','79');ring.setAttribute('class','requirement');group.append(ring);return ring;
  });
  return {card,mode,dev,verify,cadence,rings,idle:card.querySelector('.idle-indicator')};
});
let frame; let epoch;
function draw(time) {
  const t = motion.matches ? 1.2 : (time - epoch) / 1000;
  for(const f of flows) {
    const cycle = f.dev + f.verify;
    const latest = Math.floor(t / f.cadence);
    f.rings.forEach((ring,index) => {
      const age = t - (latest - index) * f.cadence;
      const visible = age >= 0 && age <= cycle;
      ring.style.display = visible ? '' : 'none';
      const x = age < f.dev ? 20 + 215 * age / f.dev : 235 + 105 * (age - f.dev) / f.verify;
      ring.setAttribute('cx',String(x));
    });
    // Real completed development waits for downstream capacity; a rotating
    // empty indicator shows unused development capacity, never fake output.
    f.idle.style.opacity = f.mode === 'agent' && t % f.cadence > f.dev ? '.8' : '0';
  }
  if(!motion.matches && !document.hidden) frame = requestAnimationFrame(draw);
}
function resume() {cancelAnimationFrame(frame);epoch=performance.now();draw(epoch);}
motion.addEventListener('change',resume);
document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(frame);else resume();});
resume();
