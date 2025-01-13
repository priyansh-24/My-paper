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

// Add click event to menu items to toggle containers
menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Remove 'active' class from all containers and menu items
    containers.forEach((container) => container.classList.remove("active"));
    menuItems.forEach((menuItem) => menuItem.classList.remove("active"));

    // Add 'active' class to the selected container and menu item
    const sectionId = item.getAttribute("data-section");
    document.getElementById(sectionId).classList.add("active");
    item.classList.add("active");
  });
});
// Add smooth scroll to the Journey section
document.getElementById("exploreMore").addEventListener("click", function () {
  // Hide all sections
  containers.forEach((container) => container.classList.remove("active"));

  // Show the "Journey" section
  document.getElementById("journey").classList.add("active");
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

// Function to toggle popup visibility
function togglePopup(popup) {
  // Close any open popup
  document.querySelectorAll('.popup').forEach(p => (p.style.display = 'none'));

  // Toggle the selected popup
  if (popup.style.display === 'none' || popup.style.display === '') {
    popup.style.display = 'block';
  } else {
    popup.style.display = 'none';
  }
}

// Add event listeners
toolboxButton.addEventListener('click', () => {
  togglePopup(toolboxPopup);
});

contactButton.addEventListener('click', () => {
  togglePopup(contactPopup);
});

// Close popup when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.extra-buttons') && !e.target.closest('.popup')) {
    document.querySelectorAll('.popup').forEach(p => (p.style.display = 'none'));
  }
});
