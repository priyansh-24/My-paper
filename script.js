const crumpledPaper = document.getElementById('crumpledPaper');
const audio = document.getElementById('backgroundMusic');
const extraButtons = document.querySelector('.extra-buttons');
const audioToggle = document.getElementById('audioToggle');
const menuBar = document.getElementById('menuBar');
const menuItems = document.querySelectorAll(".menu-bar ul li");
const containers = document.querySelectorAll(".container");


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
      menuBar.style.left = '0px'; // Slide in the menu
      crumpledPaper.style.display = 'none';
      document.getElementById("home").classList.add("active");
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
      extraButtons.style.display = 'flex';
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
    audioToggle.innerHTML = '||'; // Pause symbol
    waveContainer.style.display = 'block'; // Show waves
  } else {
    audio.pause();
    audioToggle.innerHTML = '▶'; // Play symbol
    waveContainer.style.display = 'none'; // Hide waves
  }
}


let currentIndex = 0;
// Function to update active class
function updateActiveItem(index) {
  menuItems.forEach((item, i) => {
    item.classList.toggle('active', i === index); // Toggle active on menu items
  });
  containers.forEach((container, i) => {
    container.classList.toggle('active', i === index); // Toggle active on containers
  });
}

// Click event to toggle containers
menuItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    currentIndex = index; // Update currentIndex based on clicked item
    updateActiveItem(currentIndex); // Update active class
  });
});

// Keyboard navigation using arrow keys
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') {
    currentIndex = (currentIndex + 1) % menuItems.length; // Move right, loop back to start
    updateActiveItem(currentIndex);
  } else if (event.key === 'ArrowLeft') {
    currentIndex = (currentIndex - 1 + menuItems.length) % menuItems.length; // Move left, loop back to end
    updateActiveItem(currentIndex);
  }
});

// Smooth scroll to the Journey section on button click
document.getElementById("exploreMore").addEventListener("click", function () {
  currentIndex = Array.from(menuItems).findIndex(item => item.getAttribute("data-section") === "journey");
  updateActiveItem(currentIndex);
});



const dataPoints = [
  { stage: 'Nursery–10 (School)', marks: 82, school: 'Saint Anne,s School,Titlagarh', year: '2007–2020', markingScheme: '%'},
  { stage: '11–12', marks: 89, school: 'Yuvoday Junior Collage,Bolangir', year: '2020–2022', markingScheme: '%'},
  { stage: 'Kota', marks: 97, school: 'PW vidyapeeth,kota', year: '2022–2023', markingScheme: 'Percentile' },
  { stage: 'NIT-Rourkela', marks: 88.8, school: 'National Institute of Technology,Rourkela', year: '2023–Present', markingScheme: 'CGPA' },
];

const labels = dataPoints.map(point => point.stage);
const marks = dataPoints.map(point => point.marks);

const ctx = document.getElementById('journeyChart').getContext('2d');

const chartData = {
  labels: labels,
  datasets: [
    {
      label: 'Marks over Time',
      data: marks,
      borderColor: 'rgb(0,119,204)',
      backgroundColor: 'rgb(255, 255, 255,0.4)',
      borderWidth: 2,
      tension: 0.4,
      pointBackgroundColor: 'rgb(255, 255, 255)',
      pointRadius: 5,
    },
  ],
};
const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
    tooltip: {
      callbacks: {
        title: function (tooltipItems) {
          return tooltipItems[0].label;
        },
        label: function (tooltipItem) {
          const point = dataPoints[tooltipItem.dataIndex];
          let marksLabel = point.marks;
          
          if (point.markingScheme === 'CGPA') {
            marksLabel = `${(point.marks-10)/10}(CGPA)`; // Convert CGPA (e.g., 78.8 to 7.88)
          } else if (point.markingScheme === 'Percentile') {
            marksLabel = `${point.marks}(Percentile)`; // Add percentage sign without brackets
          } else {
            marksLabel = `${point.marks}%`; // Add percentage sign without brackets
          }

          
          return [
            `Marks: ${marksLabel}`,
            `School: ${point.school}`,
            `Year: ${point.year}`,
          ];
        },
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Journey Stages',
        font: {
          size: 18,
        },
      },
    },
    y: {
      beginAtZero: true,
      max: 100,
      title: {
        display: true,
        text: 'Marks',
        font: {
          size: 18,
        },
      },
    },
  },
};

const journeyChart = new Chart(ctx, {
  type: 'line',
  data: chartData,
  options: options,
});





// Select buttons and popups
const toolboxButton = document.getElementById('toolboxButton');
const contactButton = document.getElementById('contactButton');
const toolboxPopup = document.getElementById('toolboxPopup');
const contactPopup = document.getElementById('contactPopup');
const closeButtons = document.querySelectorAll('.close-btn');

// Function to open popup
function openPopup(popup) {
  // Hide any currently open popups
  document.querySelectorAll('.center-popup').forEach(p => {
    p.classList.remove('show');
  });

  // Show the selected popup
  popup.classList.add('show');
  document.body.classList.add('popup-active'); // Add background dim
}

// Function to close all popups
function closePopup() {
  document.querySelectorAll('.center-popup').forEach(p => {
    p.classList.remove('show');
  });
  document.body.classList.remove('popup-active'); // Remove background dim
}

// Event listeners for buttons
toolboxButton.addEventListener('click', () => {
  openPopup(toolboxPopup);
});

contactButton.addEventListener('click', () => {
  openPopup(contactPopup);
});

// Event listeners for close buttons
closeButtons.forEach(btn => {
  btn.addEventListener('click', closePopup);
});

// Close popup when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.center-popup') && !e.target.closest('.extra-btn')) {
    closePopup();
  }
});

