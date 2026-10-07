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
