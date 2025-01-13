const crumpledPaper = document.getElementById('crumpledPaper');
const contentContainer = document.getElementById('contentContainer');
const audio = document.getElementById('backgroundMusic');
const audioToggle = document.getElementById('audioToggle');
audioToggle.style.display = 'none';
let isDragging = false;
let offsetX = 0; 
let offsetY = 0;
audio.volume = 0.3;  

audio.pause();
// Dragging with the mouse
crumpledPaper.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - crumpledPaper.offsetLeft;
  offsetY = e.clientY - crumpledPaper.offsetTop;
  crumpledPaper.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    crumpledPaper.style.left = `${e.clientX - offsetX}px`;
    crumpledPaper.style.top = `${e.clientY - offsetY}px`;
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  crumpledPaper.style.cursor = 'grab';
});

// Dragging with touch
crumpledPaper.addEventListener('touchstart', (e) => {
  isDragging = true;
  const touch = e.touches[0];
  offsetX = touch.clientX - crumpledPaper.offsetLeft;
  offsetY = touch.clientY - crumpledPaper.offsetTop;
});

document.addEventListener('touchmove', (e) => {
  if (isDragging) {
    const touch = e.touches[0];
    crumpledPaper.style.left = `${touch.clientX - offsetX}px`;
    crumpledPaper.style.top = `${touch.clientY - offsetY}px`;
  }
});

document.addEventListener('touchend', () => {
  isDragging = false;
});

// Unfolding animation on double-click
crumpledPaper.addEventListener('click', () => {
  if (!isDragging) { 
    crumpledPaper.classList.add('unfolding');
    setTimeout(() => {
      crumpledPaper.style.display = 'none';
      contentContainer.style.display = 'block';
      startAudio(); // Start audio after unfolding
    }, 1000);
  }
});



// Start audio and show toggle button
function startAudio() {
    audio.play()
    .then(() => {
      audioToggle.style.display = 'block'; // Show the button
      audioToggle.textContent = '||';  // Set initial state to 'Pause'
      waveContainer.style.display = 'block'; // Show the wave
    })
    .catch((error) => {
      console.warn('Audio autoplay was blocked:', error);
      audioToggle.textContent = '▶';
    });
}

audioToggle.addEventListener('click', toggleAudio);

// Handle Spacebar to toggle play/pause
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault(); // Prevent default browser behavior (scrolling)
    toggleAudio();
  }
});

// Function to toggle audio and button symbols
function toggleAudio() {
  if (audio.paused) {
    audio.play();
    audioToggle.innerHTML = '&#10074;&#10074;'; // Pause symbol
    waveContainer.style.display = 'block'; // Show waves
  } else {
    audio.pause();
    audioToggle.innerHTML = '&#9658;'; // Play symbol
    waveContainer.style.display = 'none'; // Hide waves
  }
}