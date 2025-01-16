const crumpledPaper = document.getElementById('crumpledPaper');
const audio = document.getElementById('backgroundMusic');
const extraButtons = document.querySelector('.extra-buttons');
const audioToggle = document.getElementById('audioToggle');
const menuBar = document.getElementById('menuBar');
const menuItems = document.querySelectorAll(".menu-bar ul li");
const containers = document.querySelectorAll(".container");
const textElement = document.getElementById('text');


audioToggle.style.display = 'none';
let isDragging = false;
let offsetX = 0; 
let offsetY = 0;
audio.volume = 0.12;  


// Select the custom cursor
const customCursor = document.querySelector('.custom-cursor');

// Update cursor position based on mouse movement
document.addEventListener('mousemove', (e) => {
  customCursor.style.left = `${e.clientX}px`;
  customCursor.style.top = `${e.clientY}px`;
});

// Hide the default cursor
document.body.style.cursor = 'none';



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
      customCursor.style.cursor = 'block';
      text.style.display = 'none';
      document.getElementById("home").classList.add("active");
      startAudio(); // Start audio after unfolding
    }, 1000);
  }
});


document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
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
  { stage: 'Nursery–10', marks: 82, school: 'Saint Anne,s School,Titlagarh', year: '2007–2020', markingScheme: '%' },
  { stage: '11–12', marks: 89, school: 'Yuvoday Junior Collage,Bolangir', year: '2020–2022', markingScheme: '%' },
  { stage: 'Kota', marks: 97, school: 'PW vidyapeeth,kota', year: '2022–2023', markingScheme: 'Percentile' },
  { stage: 'NIT-Rourkela', marks: 88.8, school: 'National Institute of Technology,Rourkela', year: '2023–Present', markingScheme: 'CGPA' },
];

const labels = dataPoints.map((point) => point.stage);
const marks = dataPoints.map((point) => point.marks);

const ctx = document.getElementById('journeyChart').getContext('2d');

const chartData = {
  labels: labels,
  datasets: [
    {
      label: 'Marks over Time',
      data: marks,
      borderColor: 'rgb(0,119,204)',
      backgroundColor: 'rgba(0,119,204,0.2)',
      borderWidth: 2,
      tension: 0.4,
      pointBackgroundColor: 'rgb(0,119,204)',
      pointRadius: 4,
    },
  ],
};

const options = {
  responsive: true, // Make chart responsive
  maintainAspectRatio: false, // Allow flexibility in aspect ratio
  plugins: {
    legend: {
      display: true,
    },
    tooltip: {
      bodyFont: {
        size: window.innerWidth < 768 ? 8 : 12, // Smaller font size for mobile
      },
      titleFont: {
        size: window.innerWidth < 768 ? 10 : 18, // Smaller title font size for mobile
      },
      padding: 8, // Reduce padding for a compact look
      boxPadding: 4, 
      callbacks: {
        title: function (tooltipItems) {
          return tooltipItems[0].label;
        },
        label: function (tooltipItem) {
          const point = dataPoints[tooltipItem.dataIndex];
          let marksLabel = point.marks;

          if (point.markingScheme === 'CGPA') {
            marksLabel = `${(point.marks - 10) / 10} (CGPA)`; // Convert CGPA
          } else if (point.markingScheme === 'Percentile') {
            marksLabel = `${point.marks} (Percentile)`; // Display percentile
          } else {
            marksLabel = `${point.marks}%`; // Display percentage
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
          size: 14,
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
          size: 14,
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
const backdrop = document.getElementById('backdrop');
// Function to open popup
function openPopup(popup) {
  // Hide any currently open popups
  document.querySelectorAll('.center-popup').forEach(p => {
    p.classList.remove('show');
  });

  // Show the selected popup
  popup.classList.add('show');
  backdrop.classList.add('show');
  document.body.classList.add('popup-active'); // Add background dim
}

// Function to close all popups
function closePopup() {
  document.querySelectorAll('.center-popup').forEach(p => {
    p.classList.remove('show');
  });
  backdrop.classList.remove('show');
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



// Function to open the modal with dynamic content
function showModal(title, description) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalDescription').textContent = description;
  document.getElementById('projectModal').style.display = 'flex'; // Make modal visible
}

// Function to close the modal
function closeModal() {
  document.getElementById('projectModal').style.display = 'none'; // Hide modal
}

// Optional: Close modal when clicking outside of it
window.onclick = function (event) {
  const modal = document.getElementById('projectModal');
  if (event.target === modal) {
    closeModal();
  }
};




// Function to apply the 2-axis effect to a set of elements
function applyHoverEffect(selector) {
  const elements = document.querySelectorAll(selector);

  elements.forEach((element) => {
    let sensitivity;
    if (element.classList.contains('container')) {
      sensitivity = 300; // Sensitivity for .container
    } else if (element.classList.contains('crumpled-paper')) {
      sensitivity = 8; // Sensitivity for .card
    } else if (element.classList.contains('center-popup')) {
      sensitivity = 100; // Sensitivity for .card
    } else {
      sensitivity = 70; // Default sensitivity (can adjust if needed)
    }

    element.addEventListener('mousemove', (event) => {
      const rect = element.getBoundingClientRect();

      // Calculate cursor position relative to the element
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Calculate deformation based on cursor distance from the center
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Adjust sensitivity for both axes
      const offsetX = (mouseX - centerX) / sensitivity; // Horizontal tilt
      const offsetY = (mouseY - centerY) / sensitivity; // Vertical tilt

      // Apply the transformation for 2-axis movement
      element.style.transform = `perspective(800px) rotateX(${-offsetY}deg) rotateY(${offsetX}deg)`;
    });
  });
}

// Apply the hover effect to both containers and cards
applyHoverEffect('.container');
applyHoverEffect('.crumpled-paper');
applyHoverEffect('.center-popup');





// Select all divs with the class 'interactive-effect'
const interactiveDivs = document.querySelectorAll('.container');

interactiveDivs.forEach((div) => {
  // Get the sensitivity value from the data attribute
  const sensitivity = 300; // Default to 10 if not provided

  div.addEventListener('mousemove', (event) => {
    const rect = div.getBoundingClientRect();

    // Calculate cursor position relative to the div
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Calculate deformation based on cursor distance from the center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Adjust sensitivity for both axes
    const offsetX = (mouseX - centerX) / sensitivity; // Horizontal tilt
    const offsetY = (mouseY - centerY) / sensitivity; // Vertical tilt

    // Apply the transformation for 2-axis movement
    div.style.transform = `perspective(800px) rotateX(${-offsetY}deg) rotateY(${offsetX}deg)`;
  });
});



