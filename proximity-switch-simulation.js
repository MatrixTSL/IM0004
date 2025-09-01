// Global variables
let chart = null;
let targetDistance = 20; // Start at 20mm (middle of 0-40mm range)
let sensorState = false;

// Progress tracking variables
let step1Completed = false; // Basic Detection
let step2Completed = false; // Range Testing  
let step3Completed = false; // Hysteresis Check
let hasTestedFullRange = false; // Track if user has moved through 0-100mm
let lastDetectionState = false; // Track previous detection state for hysteresis

// Initialize simulation
function initializeProximitySwitchSimulation() {
    console.log('Initializing proximity switch simulation...');
    
    try {
        // Load any previously saved progress
        loadProgress();
        
        // Setup initial detection zone and full range zone
        const detectionZone = document.getElementById('detection-zone');
        const fullRangeZone = document.getElementById('full-range-zone');
        if (detectionZone && fullRangeZone) {
            detectionZone.style.opacity = '0.1';
            // Width and position will be set dynamically in updateVisualization()
        }

        // Setup chart
        setupChart();
        
        // Setup distance slider
        const slider = document.getElementById('target-distance');
        if (slider) {
            slider.value = targetDistance;
            slider.addEventListener('input', (e) => {
                targetDistance = parseInt(e.target.value);
                updateDisplay();
            });
        }
        
        // Initial display update
        updateDisplay();
        
        // Start update loop - reduced frequency to prevent layout shifts
        setInterval(updateDisplay, 200);
        
        console.log('Proximity switch simulation initialized successfully!');
    } catch (error) {
        console.error('Simulation initialization error:', error);
    }
}

// Setup Chart.js chart
function setupChart() {
    const ctx = document.getElementById('detection-chart');
    if (!ctx) return;
    
    // Destroy existing chart if any
    if (chart) chart.destroy();
    
    // Create data arrays
    const labels = Array(50).fill('');
    const data = Array(50).fill(0);
    
    // Create new chart
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sensor State',
                data: data,
                borderColor: '#2196F3',
                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0
            },
            scales: {
                y: {
                    min: -0.1,
                    max: 1.1,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#888',
                        callback: function(value) {
                            if (value <= 0) return 'OFF';
                            if (value >= 1) return 'ON';
                            return '';
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Update display elements
function updateDisplay() {
    // Update sensor state
    sensorState = targetDistance <= 40;
    
    // Update chart
    if (chart && chart.data && chart.data.datasets) {
        const data = chart.data.datasets[0].data;
        data.push(sensorState ? 1 : 0);
        data.shift();
        chart.update('none');
    }
    
    // Update visualization
    updateVisualization();
    
    // Update text displays
    const distanceValue = document.getElementById('distance-value');
    if (distanceValue) {
        distanceValue.textContent = targetDistance + 'mm';
    }
    
    const currentDistance = document.getElementById('current-distance');
    if (currentDistance) {
        currentDistance.textContent = targetDistance + 'mm';
    }
    
    const sensorStateElement = document.getElementById('sensor-state');
    if (sensorStateElement) {
        sensorStateElement.textContent = sensorState ? 'Detecting' : 'Not Detecting';
        sensorStateElement.style.color = sensorState ? '#4CAF50' : '#FF5722';
    }
}

// Progress tracking functions
function updateProgress() {
    let progressChanged = false;
    
    // Step 1: Basic Detection - Complete when target is in detection range
    if (!step1Completed && targetDistance <= 40) {
        step1Completed = true;
        document.getElementById('step1-complete').textContent = '✅';
        document.getElementById('step1-complete').style.color = '#4CAF50';
        console.log('Step 1 completed: Basic Detection');
        progressChanged = true;
    }
    
    // Step 2: Range Testing - Complete when user has tested full 0-100mm range
    if (!step2Completed && hasTestedFullRange) {
        step2Completed = true;
        document.getElementById('step2-complete').textContent = '✅';
        document.getElementById('step2-complete').style.color = '#4CAF50';
        console.log('Step 2 completed: Range Testing');
        progressChanged = true;
    }
    
    // Step 3: Hysteresis Check - Complete when user observes different ON/OFF points
    if (!step3Completed && lastDetectionState !== sensorState && (targetDistance > 40 && targetDistance <= 42)) {
        step3Completed = true;
        document.getElementById('step3-complete').textContent = '✅';
        document.getElementById('step3-complete').style.color = '#4CAF50';
        console.log('Step 3 completed: Hysteresis Check');
        progressChanged = true;
    }
    
    // Save progress if any step was completed
    if (progressChanged) {
        saveProgress();
    }
    
    // Update last detection state for hysteresis tracking
    lastDetectionState = sensorState;
}

// Update visualization
// Scale: 3 pixels = 1mm, so 100mm = 300 pixels total, 40mm = 120 pixels detection zone
function updateVisualization() {
    const targetObject = document.getElementById('target-object');
    const detectionZone = document.getElementById('detection-zone');
    const sensorBody = document.getElementById('sensor-body');
    
    if (targetObject && detectionZone && sensorBody) {
        // Use fixed positioning values to prevent layout shifts
        const sensorLeft = 40; // Fixed sensor left position
        const sensorWidth = 30; // Fixed sensor width
        const sensorRight = sensorLeft + sensorWidth;
        
        // Use fixed positioning values to prevent layout shifts
        const leftMargin = 70; // Left edge where 0mm starts
        const rightMargin = 40; // Right edge where 100mm ends
        const availableWidth = 300; // Fixed width for 0-100mm range (prevents layout shifts)
        
        // Position detection zone (0-40mm range)
        // Detection zone covers 0-40mm (40% of the total range)
        const detectionZoneLeft = leftMargin;
        const detectionZoneWidth = (40 / 100) * availableWidth;
        
        detectionZone.style.left = detectionZoneLeft + 'px';
        detectionZone.style.width = detectionZoneWidth + 'px';
        
        // Ensure full-range-zone covers exactly 0-100mm
        const fullRangeZone = document.getElementById('full-range-zone');
        if (fullRangeZone) {
            fullRangeZone.style.left = leftMargin + 'px';
            fullRangeZone.style.width = availableWidth + 'px';
        }
        
        // Position target object within the 0-100mm range
        // Calculate target position: 0mm = leftMargin, 100mm = leftMargin + availableWidth
        const targetLeft = leftMargin + (targetDistance / 100) * availableWidth;
        targetObject.style.left = targetLeft + 'px';
        
        // Ensure target doesn't go beyond the visualization area
        const maxTargetLeft = leftMargin + availableWidth;
        if (targetLeft > maxTargetLeft) {
            targetObject.style.left = maxTargetLeft + 'px';
        }
        
        // Update detection zone visibility
        detectionZone.style.opacity = sensorState ? '0.3' : '0.1';
        
        // Add glow effect to sensor when detecting
        const sensorFace = sensorBody.querySelector('#sensor-face');
        if (sensorFace) {
            sensorFace.style.boxShadow = sensorState ? 
                '0 0 10px rgba(33, 150, 243, 0.8)' : 
                '0 0 5px rgba(33, 150, 243, 0.3)';
        }
        
        // Track range testing - mark as complete when user has moved through full range
        if (targetDistance >= 100 || targetDistance <= 0) {
            hasTestedFullRange = true;
        }
        
        // Update learning progress
        updateProgress();
    }
}

// Progress persistence functions
function saveProgress() {
    const progress = {
        step1Completed,
        step2Completed,
        step3Completed,
        hasTestedFullRange
    };
    localStorage.setItem('proximitySwitchProgress', JSON.stringify(progress));
}

function resetProgress() {
    // Reset all progress variables
    step1Completed = false;
    step2Completed = false;
    step3Completed = false;
    hasTestedFullRange = false;
    lastDetectionState = false;
    
    // Reset visual indicators
    document.getElementById('step1-complete').textContent = '❌';
    document.getElementById('step1-complete').style.color = '#FF5722';
    document.getElementById('step2-complete').textContent = '❌';
    document.getElementById('step2-complete').style.color = '#FF5722';
    document.getElementById('step3-complete').textContent = '❌';
    document.getElementById('step3-complete').style.color = '#FF5722';
    
    // Clear saved progress
    localStorage.removeItem('proximitySwitchProgress');
    
    console.log('Progress reset successfully');
}

function loadProgress() {
    const savedProgress = localStorage.getItem('proximitySwitchProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        step1Completed = progress.step1Completed || false;
        step2Completed = progress.step2Completed || false;
        step3Completed = progress.step3Completed || false;
        hasTestedFullRange = progress.hasTestedFullRange || false;
        
        // Update visual indicators for already completed steps
        if (step1Completed) {
            const step1Element = document.getElementById('step1-complete');
            if (step1Element) {
                step1Element.textContent = '✅';
                step1Element.style.color = '#4CAF50';
            }
        }
        if (step2Completed) {
            const step2Element = document.getElementById('step2-complete');
            if (step2Element) {
                step2Element.textContent = '✅';
                step2Element.style.color = '#4CAF50';
            }
        }
        if (step3Completed) {
            const step3Element = document.getElementById('step3-complete');
            if (step3Element) {
                step3Element.textContent = '✅';
                step3Element.style.color = '#4CAF50';
            }
        }
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initializeProximitySwitchSimulation); 