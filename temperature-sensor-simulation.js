// Temperature Sensor Simulation
// Worksheet 11 - Temperature Sensor System Maintenance

let temperatureSensorData = {
    temperature: 25,
    voltageOutput: 0,
    scaledTemperature: 0,
    offset: 0,
    drift: 0,
    sensorHealth: 100,
    faults: []
};

function initializeTemperatureSensorSimulation() {
    console.log('Initializing Temperature Sensor Simulation');
    
    const panel = document.getElementById('temperature-sensor-panel');
    if (!panel) {
        console.error('Temperature sensor panel not found');
        return;
    }
    
    panel.innerHTML = `
        <style>
          #temperature-sensor-panel .card { background: #1a1a1a; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
          #temperature-sensor-panel .grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
          #temperature-sensor-panel .two-col { display: grid; grid-template-columns: 1fr; gap: 16px; }
          #temperature-sensor-panel .status-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; }
          #temperature-sensor-panel .center { text-align: center; }
          #temperature-sensor-panel .metric { background:#1a1a1a; padding:12px; border-radius:8px; }
          @media (min-width: 900px) {
            #temperature-sensor-panel .two-col { grid-template-columns: 1fr 320px; }
          }
        </style>
        <div class="card">
          <h3 style="color:#FF5722; margin:0; display:flex; align-items:center; gap:10px;">
            <i class="fas fa-thermometer-half"></i> Temperature Sensor System
          </h3>
          <p style="color:#aaa; margin:8px 0 0 0;">Interactive temperature sensor maintenance and troubleshooting simulation</p>
        </div>
        <div class="two-col">
          <div>
            <div class="card">
              <h4 style="color:#FF5722; margin:0 0 10px 0; display:flex; align-items:center; gap:10px;"><i class="fas fa-chart-line"></i> Temperature Measurement</h4>
              <div class="metric" style="position:relative; height:200px; overflow:hidden; background:#23272b;">
                <div id="temp-gauge" style="position:absolute; left:0; bottom:0; width:100%; height:100%; background:linear-gradient(to top, #1B5E20, #4CAF50, #FFC107, #FF5722); opacity:0.1; transition:height .3s ease;"></div>
                <div class="center" style="position:relative;">
                  <div style="font-size:42px; color:#FF5722; font-weight:bold; text-shadow:0 0 10px rgba(255,87,34,.5);"><span id="temp-value">25</span>°C</div>
                  <div class="grid" style="grid-template-columns:1fr 1fr; margin-top:12px;">
                    <div class="metric center"><div style="color:#aaa; font-size:.9em;">Voltage Output</div><div style="color:#2196F3; font-size:1.4em; font-weight:bold;"><span id="voltage-value">0</span>V</div></div>
                    <div class="metric center"><div style="color:#aaa; font-size:.9em;">Scaled Value</div><div style="color:#2196F3; font-size:1.4em; font-weight:bold;"><span id="scaled-value">0</span>°C</div></div>
                  </div>
                </div>
              </div>
              <div class="grid">
                <div class="metric" style="border:1px solid #333;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;"><label style="color:#FF5722; font-weight:bold;">Process Temperature</label><span style="color:#FF5722; font-weight:bold;"><span id="temperature-value">25</span>°C</span></div>
                  <div id="temperature-slider" style="margin:8px 0 6px 0;"></div>
                </div>
                <div class="metric" style="border:1px solid #333;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;"><label style="color:#2196F3; font-weight:bold;">Sensor Offset</label><span style="color:#2196F3; font-weight:bold;"><span id="offset-value">0</span>°C</span></div>
                  <div id="offset-slider" style="margin:8px 0 6px 0;"></div>
                </div>
                <div class="metric" style="border:1px solid #333;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;"><label style="color:#FFC107; font-weight:bold;">Sensor Drift</label><span style="color:#FFC107; font-weight:bold;"><span id="drift-value">0</span>°C</span></div>
                  <div id="drift-slider" style="margin:8px 0 6px 0;"></div>
                </div>
              </div>
            </div>
            <div class="card">
              <h4 style="color:#4CAF50; margin:0 0 10px 0; display:flex; align-items:center; gap:10px;"><i class="fas fa-heartbeat"></i> Sensor Status</h4>
              <div class="status-grid">
                <div class="metric center"><div style="color:#aaa; margin-bottom:4px;">Sensor Health</div><div id="sensor-health" style="font-size:22px; font-weight:bold; color:#4CAF50;">100%</div></div>
                <div class="metric center"><div style="color:#aaa; margin-bottom:4px;">Calibration</div><div id="calibration-status" style="font-size:22px; font-weight:bold; color:#4CAF50;">Good</div></div>
                <div class="metric center"><div style="color:#aaa; margin-bottom:4px;">Drift Level</div><div id="drift-level" style="font-size:22px; font-weight:bold; color:#4CAF50;">0°C</div></div>
              </div>
            </div>
          </div>
          <div>
            <div class="card">
              <h4 style="color:#2196F3; margin:0 0 10px 0; display:flex; align-items:center; gap:10px;"><i class="fas fa-tools"></i> Maintenance Tools</h4>
              <div class="grid">
                <button id="calibrate-sensor" style="background:#2196F3; color:#fff; border:none; padding:10px; border-radius:5px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px;"><i class="fas fa-sync"></i> Calibrate Sensor</button>
                <button id="reset-offset" style="background:#2196F3; color:#fff; border:none; padding:10px; border-radius:5px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px;"><i class="fas fa-undo"></i> Reset Offset</button>
                <button id="check-drift" style="background:#2196F3; color:#fff; border:none; padding:10px; border-radius:5px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px;"><i class="fas fa-chart-line"></i> Check Drift</button>
                <button id="verify-signals" style="background:#2196F3; color:#fff; border:none; padding:10px; border-radius:5px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px;"><i class="fas fa-check-circle"></i> Verify Signals</button>
              </div>
            </div>
            <div class="card">
              <h4 style="color:#FF5722; margin:0 0 10px 0; display:flex; align-items:center; gap:10px;"><i class="fas fa-exclamation-triangle"></i> Fault Injection</h4>
              <div class="grid">
                <button id="inject-offset" style="background:#FF5722; color:#fff; border:none; padding:10px; border-radius:5px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px;"><i class="fas fa-random"></i> Offset Fault</button>
                <button id="inject-drift" style="background:#FF5722; color:#fff; border:none; padding:10px; border-radius:5px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px;"><i class="fas fa-chart-line"></i> Drift Fault</button>
                <button id="inject-noise" style="background:#FF5722; color:#fff; border:none; padding:10px; border-radius:5px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px;"><i class="fas fa-wave-square"></i> Noise Fault</button>
                <button id="clear-faults" style="background:#4CAF50; color:#fff; border:none; padding:10px; border-radius:5px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px;"><i class="fas fa-broom"></i> Clear All Faults</button>
              </div>
            </div>
            <div class="card">
              <h4 style="color:#4CAF50; margin:0 0 10px 0; display:flex; align-items:center; gap:10px;"><i class="fas fa-tasks"></i> Maintenance Tasks</h4>
              <div class="grid">
                <label class="task-item" style="display:flex; align-items:center; gap:10px; color:#aaa; cursor:pointer;"><input type="checkbox" id="task-calibrate" style="width:20px; height:20px;"><span>Calibrate temperature sensor</span></label>
                <label class="task-item" style="display:flex; align-items:center; gap:10px; color:#aaa; cursor:pointer;"><input type="checkbox" id="task-offset" style="width:20px; height:20px;"><span>Reset offset values</span></label>
                <label class="task-item" style="display:flex; align-items:center; gap:10px; color:#aaa; cursor:pointer;"><input type="checkbox" id="task-drift" style="width:20px; height:20px;"><span>Check for drift</span></label>
                <label class="task-item" style="display:flex; align-items:center; gap:10px; color:#aaa; cursor:pointer;"><input type="checkbox" id="task-verify" style="width:20px; height:20px;"><span>Verify signal accuracy</span></label>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <h4 style="color:#2196F3; margin:0 0 10px 0; display:flex; align-items:center; gap:10px;"><i class="fas fa-terminal"></i> Diagnostic Information</h4>
          <div id="diagnostic-log" style="background:#23272b; padding:12px; border-radius:5px; max-height:150px; overflow-y:auto; font-family:monospace; color:#aaa;"><p>System initialized. Temperature sensor ready for testing.</p></div>
        </div>
    `;
    
    initializeTemperatureSensorControls();
    updateTemperatureSensorDisplay();
    startTemperatureSensorSimulation();
}

function initializeTemperatureSensorControls() {
    // Temperature slider
    const temperatureSlider = document.getElementById('temperature-slider');
    noUiSlider.create(temperatureSlider, {
        start: [25],
        connect: 'lower',
        range: {
            'min': -50,
            'max': 150
        },
        tooltips: [{
            to: value => `${Math.round(value)}°C`,
            from: value => value
        }],
        pips: {
            mode: 'positions',
            values: [0, 25, 50, 75, 100],
            density: 4,
            format: {
                to: value => `${Math.round(value)}°C`,
                from: value => value
            }
        }
    });
    
    // Offset slider
    const offsetSlider = document.getElementById('offset-slider');
    noUiSlider.create(offsetSlider, {
        start: [0],
        connect: 'lower',
        range: {
            'min': -20,
            'max': 20
        },
        tooltips: [{
            to: value => `${Math.round(value)}°C`,
            from: value => value
        }],
        pips: {
            mode: 'positions',
            values: [0, 25, 50, 75, 100],
            density: 4,
            format: {
                to: value => `${Math.round(value)}°C`,
                from: value => value
            }
        }
    });
    
    // Drift slider
    const driftSlider = document.getElementById('drift-slider');
    noUiSlider.create(driftSlider, {
        start: [0],
        connect: 'lower',
        range: {
            'min': 0,
            'max': 10
        },
        tooltips: [{
            to: value => `${Math.round(value)}°C`,
            from: value => value
        }],
        pips: {
            mode: 'positions',
            values: [0, 25, 50, 75, 100],
            density: 4,
            format: {
                to: value => `${Math.round(value)}°C`,
                from: value => value
            }
        }
    });
    
    // Event listeners
    temperatureSlider.noUiSlider.on('update', function(values, handle) {
        const value = Math.round(parseFloat(values[handle]));
        temperatureSensorData.temperature = value;
        document.getElementById('temperature-value').textContent = value;
        updateTemperatureSensorDisplay();
    });
    
    offsetSlider.noUiSlider.on('update', function(values, handle) {
        const value = Math.round(parseFloat(values[handle]));
        temperatureSensorData.offset = value;
        document.getElementById('offset-value').textContent = value;
        updateTemperatureSensorDisplay();
    });
    
    driftSlider.noUiSlider.on('update', function(values, handle) {
        const value = Math.round(parseFloat(values[handle]));
        temperatureSensorData.drift = value;
        document.getElementById('drift-value').textContent = value;
        updateTemperatureSensorDisplay();
    });
    
    // Maintenance buttons
    document.getElementById('calibrate-sensor').addEventListener('click', calibrateSensor);
    document.getElementById('reset-offset').addEventListener('click', resetOffset);
    document.getElementById('check-drift').addEventListener('click', checkDrift);
    document.getElementById('verify-signals').addEventListener('click', verifySignals);
    
    // Fault injection buttons
    document.getElementById('inject-offset').addEventListener('click', injectOffsetFault);
    document.getElementById('inject-drift').addEventListener('click', injectDriftFault);
    document.getElementById('inject-noise').addEventListener('click', injectNoiseFault);
    document.getElementById('clear-faults').addEventListener('click', clearAllFaults);
    
    // Maintenance task checkboxes
    document.querySelectorAll('.task-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateMaintenanceStatus);
    });
}

function updateTemperatureSensorDisplay() {
    // Calculate voltage output (4-20mA equivalent as 0-10V)
    temperatureSensorData.voltageOutput = ((temperatureSensorData.temperature + 50) / 200) * 10;
    
    // Calculate scaled temperature with offset and drift
    temperatureSensorData.scaledTemperature = temperatureSensorData.temperature + 
                                             temperatureSensorData.offset + 
                                             temperatureSensorData.drift;
    
    // Update temperature gauge
    const tempGauge = document.getElementById('temp-gauge');
    if (tempGauge) {
        // Calculate height percentage (0-100%) based on temperature range (-50 to 150)
        const percentage = ((temperatureSensorData.temperature + 50) / 200) * 100;
        tempGauge.style.height = percentage + '%';
        tempGauge.style.opacity = '0.2';
    }
    
    // Update displays with animations
    const elements = {
        'temp-value': temperatureSensorData.temperature,
        'voltage-value': temperatureSensorData.voltageOutput.toFixed(2),
        'scaled-value': temperatureSensorData.scaledTemperature.toFixed(1),
        'temperature-value': temperatureSensorData.temperature,
        'offset-value': temperatureSensorData.offset,
        'drift-value': temperatureSensorData.drift
    };
    
    for (const [id, value] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) {
            // Add highlight effect
            element.style.transition = 'color 0.3s ease';
            element.style.color = '#FFC107';
            element.textContent = value;
            setTimeout(() => {
                element.style.color = '';
            }, 300);
        }
    }
    
    // Update status displays
    updateStatusDisplays();
}

function updateStatusDisplays() {
    const sensorHealth = document.getElementById('sensor-health');
    const calibrationStatus = document.getElementById('calibration-status');
    const driftLevel = document.getElementById('drift-level');
    
    if (sensorHealth) {
        sensorHealth.textContent = temperatureSensorData.sensorHealth + '%';
        const healthColor = temperatureSensorData.sensorHealth > 80 ? '#4CAF50' : 
                          temperatureSensorData.sensorHealth > 50 ? '#FFC107' : '#FF5722';
        sensorHealth.style.color = healthColor;
        sensorHealth.style.textShadow = `0 0 10px ${healthColor}40`;
    }
    
    if (calibrationStatus) {
        const calibration = Math.abs(temperatureSensorData.offset) < 2 ? 'Good' : 'Needs Calibration';
        calibrationStatus.textContent = calibration;
        const calibrationColor = calibration === 'Good' ? '#4CAF50' : '#FF5722';
        calibrationStatus.style.color = calibrationColor;
        calibrationStatus.style.textShadow = `0 0 10px ${calibrationColor}40`;
    }
    
    if (driftLevel) {
        driftLevel.textContent = temperatureSensorData.drift + '°C';
        const driftColor = temperatureSensorData.drift < 2 ? '#4CAF50' : 
                          temperatureSensorData.drift < 5 ? '#FFC107' : '#FF5722';
        driftLevel.style.color = driftColor;
        driftLevel.style.textShadow = `0 0 10px ${driftColor}40`;
    }
}

function calibrateSensor() {
    const oldOffset = temperatureSensorData.offset;
    const oldDrift = temperatureSensorData.drift;
    
    temperatureSensorData.offset = 0;
    temperatureSensorData.drift = 0;
    document.getElementById('offset').value = 0;
    document.getElementById('drift').value = 0;
    updateTemperatureSensorDisplay();
    
    logDiagnostic(`Sensor calibration completed:
    • Offset corrected: ${oldOffset.toFixed(1)}°C → 0°C
    • Drift reset: ${oldDrift.toFixed(1)}°C → 0°C
    • Sensor now reading: ${temperatureSensorData.temperature}°C`, 'success');
}

function resetOffset() {
    const oldOffset = temperatureSensorData.offset;
    temperatureSensorData.offset = 0;
    document.getElementById('offset').value = 0;
    updateTemperatureSensorDisplay();
    logDiagnostic(`Offset reset completed:
    • Previous offset: ${oldOffset.toFixed(1)}°C
    • Current offset: 0°C`, 'success');
}

function checkDrift() {
    if (temperatureSensorData.drift > 5) {
        logDiagnostic(`Critical drift detected:
        • Current drift: ${temperatureSensorData.drift.toFixed(1)}°C
        • Status: Immediate calibration required
        • Impact: Readings significantly affected`, 'error');
    } else if (temperatureSensorData.drift > 2) {
        logDiagnostic(`Moderate drift detected:
        • Current drift: ${temperatureSensorData.drift.toFixed(1)}°C
        • Status: Calibration recommended
        • Impact: Readings affected`, 'warning');
    } else if (temperatureSensorData.drift > 0) {
        logDiagnostic(`Minor drift detected:
        • Current drift: ${temperatureSensorData.drift.toFixed(1)}°C
        • Status: Monitor regularly
        • Impact: Minimal effect on readings`, 'info');
    } else {
        logDiagnostic(`Drift check completed:
        • Current drift: 0°C
        • Status: No drift detected
        • Impact: Readings accurate`, 'success');
    }
}

function verifySignals() {
    const accuracy = Math.abs(temperatureSensorData.temperature - temperatureSensorData.scaledTemperature);
    const voltage = temperatureSensorData.voltageOutput;
    
    if (accuracy < 2) {
        logDiagnostic(`Signal verification passed:
        • Accuracy: ${accuracy.toFixed(1)}°C deviation
        • Voltage output: ${voltage.toFixed(2)}V
        • Status: All signals normal`, 'success');
    } else {
        logDiagnostic(`Signal verification failed:
        • Accuracy: ${accuracy.toFixed(1)}°C deviation
        • Voltage output: ${voltage.toFixed(2)}V
        • Status: Calibration required`, 'warning');
    }
}

function injectOffsetFault() {
    temperatureSensorData.faults.push('offset');
    const newOffset = Math.random() * 40 - 20;
    temperatureSensorData.offset = newOffset;
    
    // Update slider with animation
    const offsetSlider = document.getElementById('offset-slider');
    if (offsetSlider && offsetSlider.noUiSlider) {
        offsetSlider.noUiSlider.set(newOffset);
    }
    
    updateTemperatureSensorDisplay();
    logDiagnostic(`Offset fault injected:
    • New offset: ${newOffset.toFixed(1)}°C
    • Effect: Temperature readings shifted
    • Action: Calibration needed`, 'error');
}

function injectDriftFault() {
    temperatureSensorData.faults.push('drift');
    const newDrift = Math.random() * 10;
    temperatureSensorData.drift = newDrift;
    
    // Update slider with animation
    const driftSlider = document.getElementById('drift-slider');
    if (driftSlider && driftSlider.noUiSlider) {
        driftSlider.noUiSlider.set(newDrift);
    }
    
    updateTemperatureSensorDisplay();
    logDiagnostic(`Drift fault injected:
    • Drift amount: ${newDrift.toFixed(1)}°C
    • Effect: Progressive reading error
    • Action: Monitor and calibrate`, 'error');
}

function injectNoiseFault() {
    temperatureSensorData.faults.push('noise');
    const healthReduction = 20;
    temperatureSensorData.sensorHealth = Math.max(0, temperatureSensorData.sensorHealth - healthReduction);
    
    // Add visual feedback
    const sensorHealth = document.getElementById('sensor-health');
    if (sensorHealth) {
        sensorHealth.style.transition = 'color 0.3s ease';
        sensorHealth.style.color = '#FF5722';
        setTimeout(() => {
            sensorHealth.style.color = '';
        }, 300);
    }
    
    updateTemperatureSensorDisplay();
    logDiagnostic(`Noise fault injected:
    • Health reduction: ${healthReduction}%
    • Current health: ${temperatureSensorData.sensorHealth}%
    • Effect: Signal quality degraded`, 'error');
}

function clearAllFaults() {
    const faultCount = temperatureSensorData.faults.length;
    const oldHealth = temperatureSensorData.sensorHealth;
    
    temperatureSensorData.faults = [];
    temperatureSensorData.offset = 0;
    temperatureSensorData.drift = 0;
    temperatureSensorData.sensorHealth = 100;
    
    // Update sliders with animation
    const offsetSlider = document.getElementById('offset-slider');
    const driftSlider = document.getElementById('drift-slider');
    
    if (offsetSlider && offsetSlider.noUiSlider) {
        offsetSlider.noUiSlider.set(0);
    }
    if (driftSlider && driftSlider.noUiSlider) {
        driftSlider.noUiSlider.set(0);
    }
    
    updateTemperatureSensorDisplay();
    
    logDiagnostic(`System restored to normal operation:
    • Faults cleared: ${faultCount}
    • Health restored: ${oldHealth}% → 100%
    • Calibration: Reset to factory defaults`, 'success');
}

function updateMaintenanceStatus() {
    const tasks = document.querySelectorAll('.task-item input[type="checkbox"]:checked');
    logDiagnostic('Maintenance tasks completed: ' + tasks.length + '/4');
    
    if (tasks.length === 4) {
        logDiagnostic('All maintenance tasks completed - system optimized');
    }
}

function logDiagnostic(message, type = 'info') {
    const log = document.getElementById('diagnostic-log');
    if (log) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('p');
        
        // Define colors for different message types
        const colors = {
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',
            error: '#FF5722'
        };
        
        // Add icon based on message type
        const icons = {
            info: 'info-circle',
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle'
        };
        
        logEntry.innerHTML = `
            <span style="color: #666;">[${timestamp}]</span>
            <i class="fas fa-${icons[type]}" style="color: ${colors[type]}; margin: 0 5px;"></i>
            <span style="color: ${colors[type]};">${message}</span>
        `;
        
        log.appendChild(logEntry);
        log.scrollTop = log.scrollHeight;
        
        // Highlight effect
        logEntry.style.backgroundColor = `${colors[type]}10`;
        setTimeout(() => {
            logEntry.style.backgroundColor = 'transparent';
            logEntry.style.transition = 'background-color 0.5s ease';
        }, 100);
    }
}

function startTemperatureSensorSimulation() {
    logDiagnostic('Temperature sensor simulation started');
    
    // Periodic updates
    setInterval(() => {
        if (temperatureSensorData.faults.length > 0) {
            // Simulate fault effects
            if (temperatureSensorData.faults.includes('drift')) {
                temperatureSensorData.drift += 0.1;
                document.getElementById('drift').value = temperatureSensorData.drift;
                updateTemperatureSensorDisplay();
            }
        }
    }, 5000);
}

// Auto-initialize if function exists
if (typeof initializeTemperatureSensorSimulation === 'function') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializeTemperatureSensorSimulation, 1000);
    });
} 