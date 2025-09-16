// Analogue Sensors Simulation
// Worksheet 13 - Analogue Sensors System Maintenance

let analogueSensorsData = {
    voltageInput: 5.0,
    rawValue: 0,
    scaledValue: 0,
    scalingFactor: 1.0,
    offset: 0,
    noiseLevel: 0,
    sensorHealth: 100,
    faults: []
};

function initializeAnalogueSensorsSimulation() {
    console.log('Initializing Analogue Sensors Simulation');
    
    const panel = document.getElementById('analogue-sensors-panel');
    if (!panel) {
        console.error('Analogue sensors panel not found');
        return;
    }
    
    panel.innerHTML = `
        <style>
          #analogue-sensors-panel .card { background: #1a1a1a; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
          #analogue-sensors-panel .grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
          #analogue-sensors-panel .two-col { display: grid; grid-template-columns: 1fr; gap: 16px; }
          #analogue-sensors-panel .signal-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
          #analogue-sensors-panel .status-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; }
          #analogue-sensors-panel .signal-value { background: #1a1a1a; padding: 12px; border-radius: 8px; text-align: center; }
          #analogue-sensors-panel .signal-label { color: #aaa; font-size: 0.85em; margin-bottom: 4px; }
          #analogue-sensors-panel .signal-number { font-size: 20px; font-weight: bold; margin: 6px 0; }
          #analogue-sensors-panel .signal-unit { color: #666; font-size: 0.75em; }
          #analogue-sensors-panel .voltage .signal-number { color: #2196F3; }
          #analogue-sensors-panel .raw .signal-number { color: #FF5722; }
          #analogue-sensors-panel .scaled .signal-number { color: #4CAF50; }
          #analogue-sensors-panel .signal-chart { height: 160px; margin: 12px 0; position: relative; }
          #analogue-sensors-panel .control-group { 
            background: #23272b; 
            padding: 16px; 
            border-radius: 8px; 
            margin-bottom: 20px; 
            border: 1px solid #333;
          }
          #analogue-sensors-panel .control-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 12px; 
          }
          #analogue-sensors-panel .control-label { 
            color: #2196F3; 
            font-size: 1em; 
            font-weight: bold; 
          }
          #analogue-sensors-panel .control-value { 
            color: #4CAF50; 
            font-size: 1.1em; 
            font-weight: bold; 
            background: #1a1a1a; 
            padding: 4px 8px; 
            border-radius: 4px; 
            min-width: 60px; 
            text-align: center; 
          }
          #analogue-sensors-panel .control-slider { 
            margin: 12px 0; 
          }
          #analogue-sensors-panel .control-range { 
            color: #666; 
            font-size: 0.8em; 
            text-align: center; 
            margin-top: 8px; 
          }
          #analogue-sensors-panel .status-card { background: #23272b; padding: 12px; border-radius: 8px; text-align: center; border: 1px solid #333; transition: all 0.3s ease; }
          #analogue-sensors-panel .status-icon { font-size: 20px; margin-bottom: 6px; }
          #analogue-sensors-panel .status-label { color: #aaa; font-size: 0.8em; margin-bottom: 4px; }
          #analogue-sensors-panel .status-value { font-size: 16px; font-weight: bold; }
          #analogue-sensors-panel .status-good { color: #4CAF50; text-shadow: 0 0 8px rgba(76,175,80,0.4); }
          #analogue-sensors-panel .status-fair { color: #FFC107; text-shadow: 0 0 8px rgba(255,193,7,0.4); }
          #analogue-sensors-panel .status-poor { color: #FF5722; text-shadow: 0 0 8px rgba(255,87,34,0.4); }
          #analogue-sensors-panel .maintenance-btn, #analogue-sensors-panel .fault-btn { width: 100%; padding: 10px; border: none; border-radius: 5px; color: white; font-weight: bold; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 8px; font-size: 0.9em; }
          #analogue-sensors-panel .maintenance-btn { background: #2196F3; }
          #analogue-sensors-panel .maintenance-btn:hover { background: #1976D2; box-shadow: 0 0 12px rgba(33,150,243,0.3); }
          #analogue-sensors-panel .fault-btn { background: #FF5722; }
          #analogue-sensors-panel .fault-btn:hover { background: #F4511E; box-shadow: 0 0 12px rgba(255,87,34,0.3); }
          #analogue-sensors-panel .task-item { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding: 8px; background: #23272b; border-radius: 5px; cursor: pointer; }
          #analogue-sensors-panel .task-item input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }
          #analogue-sensors-panel .task-item label { color: #aaa; cursor: pointer; flex: 1; font-size: 0.9em; }
          #analogue-sensors-panel .diagnostic-log { background: #23272b; padding: 12px; border-radius: 5px; max-height: 160px; overflow-y: auto; font-family: monospace; color: #aaa; margin-top: 8px; font-size: 0.85em; }
          #analogue-sensors-panel .diagnostic-log p { margin: 4px 0; padding: 4px; border-radius: 3px; transition: background-color 0.3s ease; }
          #analogue-sensors-panel .diagnostic-log p:hover { background: rgba(255,255,255,0.05); }
          @media (min-width: 900px) {
            #analogue-sensors-panel .two-col { grid-template-columns: 1fr 320px; }
            #analogue-sensors-panel .signal-grid { grid-template-columns: repeat(3, 1fr); }
            #analogue-sensors-panel .status-grid { grid-template-columns: repeat(3, 1fr); }
          }
        </style>
        <div class="card">
          <h3 style="color:#2196F3; margin:0; display:flex; align-items:center; gap:10px;">
            <i class="fas fa-wave-square"></i> Analogue Sensors System
          </h3>
          <p style="color:#aaa; margin:8px 0 0 0;">Interactive analogue sensors maintenance and troubleshooting simulation</p>
        </div>
        <div class="two-col">
          <div>
            <div class="card">
              <h4 style="color:#2196F3; margin:0 0 10px 0; display:flex; align-items:center; gap:10px;"><i class="fas fa-chart-line"></i> Signal Display</h4>
              <div class="signal-grid">
                <div class="signal-value voltage">
                  <div class="signal-label">Voltage Input</div>
                  <div id="voltage-value" class="signal-number">5.0</div>
                  <div class="signal-unit">Volts DC</div>
                </div>
                <div class="signal-value raw">
                  <div class="signal-label">PLC Raw Value</div>
                  <div id="raw-value" class="signal-number">0</div>
                  <div class="signal-unit">0-32767</div>
                </div>
                <div class="signal-value scaled">
                  <div class="signal-label">Scaled Value</div>
                  <div id="scaled-value" class="signal-number">0</div>
                  <div class="signal-unit">Engineering Units</div>
                </div>
              </div>
              <div class="signal-chart">
                <canvas id="signal-chart"></canvas>
              </div>
            </div>
            <div class="card">
              <h4 style="color:#2196F3; margin:0 0 16px 0; display:flex; align-items:center; gap:10px;"><i class="fas fa-sliders-h"></i> Signal Controls</h4>
              
              <!-- Voltage Control -->
              <div class="control-group">
                <div class="control-header">
                  <label class="control-label">Voltage Input</label>
                  <span class="control-value" id="voltage-display">5.0V</span>
                </div>
                <div class="control-slider">
                  <div id="voltage-slider"></div>
                </div>
                <div class="control-range">0V - 10V</div>
              </div>
              
              <!-- Scaling Control -->
              <div class="control-group">
                <div class="control-header">
                  <label class="control-label">Scaling Factor</label>
                  <span class="control-value" id="scaling-display">1.00x</span>
                </div>
                <div class="control-slider">
                  <div id="scaling-slider"></div>
                </div>
                <div class="control-range">0.1x - 2.0x</div>
              </div>
              
              <!-- Offset Control -->
              <div class="control-group">
                <div class="control-header">
                  <label class="control-label">Offset</label>
                  <span class="control-value" id="offset-display">+0.0</span>
                </div>
                <div class="control-slider">
                  <div id="offset-slider"></div>
                </div>
                <div class="control-range">-5.0 - +5.0</div>
              </div>
              
              <!-- Noise Control -->
              <div class="control-group">
                <div class="control-header">
                  <label class="control-label">Noise Level</label>
                  <span class="control-value" id="noise-display">0%</span>
                </div>
                <div class="control-slider">
                  <div id="noise-slider"></div>
                </div>
                <div class="control-range">0% - 100%</div>
              </div>
            </div>
            <div class="card">
              <h4 style="color:#2196F3; margin:0 0 10px 0; display:flex; align-items:center; gap:10px;"><i class="fas fa-heartbeat"></i> Sensor Status</h4>
              <div class="status-grid">
                <div class="status-card">
                  <i class="fas fa-signal status-icon"></i>
                  <div class="status-label">Signal Quality</div>
                  <div id="signal-quality" class="status-value status-good">Good</div>
                </div>
                <div class="status-card">
                  <i class="fas fa-balance-scale status-icon"></i>
                  <div class="status-label">Calibration</div>
                  <div id="calibration-status" class="status-value status-good">Good</div>
                </div>
                <div class="status-card">
                  <i class="fas fa-wave-square status-icon"></i>
                  <div class="status-label">Noise Level</div>
                  <div id="noise-status" class="status-value status-good">Low</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="card">
              <h4 style="color:#2196F3; margin:0 0 10px 0; display:flex; align-items:center; gap:10px;"><i class="fas fa-tools"></i> Maintenance Tools</h4>
              <div class="grid">
                <button id="calibrate-signal" class="maintenance-btn"><i class="fas fa-balance-scale"></i> Calibrate Signal</button>
                <button id="adjust-scaling" class="maintenance-btn"><i class="fas fa-compress-arrows-alt"></i> Adjust Scaling</button>
                <button id="reduce-noise" class="maintenance-btn"><i class="fas fa-filter"></i> Reduce Noise</button>
                <button id="verify-accuracy" class="maintenance-btn"><i class="fas fa-check-circle"></i> Verify Accuracy</button>
              </div>
            </div>
            <div class="card">
              <h4 style="color:#FF5722; margin:0 0 10px 0; display:flex; align-items:center; gap:10px;"><i class="fas fa-exclamation-triangle"></i> Fault Injection</h4>
              <div class="grid">
                <button id="inject-scaling" class="fault-btn"><i class="fas fa-compress"></i> Scaling Fault</button>
                <button id="inject-offset" class="fault-btn"><i class="fas fa-arrows-alt-v"></i> Offset Fault</button>
                <button id="inject-noise" class="fault-btn"><i class="fas fa-random"></i> Noise Fault</button>
                <button id="clear-faults" style="background: #4CAF50; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.9em;"><i class="fas fa-broom"></i> Clear All Faults</button>
              </div>
            </div>
            <div class="card">
              <h4 style="color:#4CAF50; margin:0 0 10px 0; display:flex; align-items:center; gap:10px;"><i class="fas fa-tasks"></i> Maintenance Tasks</h4>
              <div class="grid">
                <label class="task-item"><input type="checkbox" id="task-scaling"><span>Check signal scaling</span></label>
                <label class="task-item"><input type="checkbox" id="task-offset"><span>Verify offset values</span></label>
                <label class="task-item"><input type="checkbox" id="task-noise"><span>Assess noise levels</span></label>
                <label class="task-item"><input type="checkbox" id="task-shielding"><span>Check shielding</span></label>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <h4 style="color:#2196F3; margin:0 0 10px 0; display:flex; align-items:center; gap:10px;"><i class="fas fa-terminal"></i> Diagnostic Information</h4>
          <div id="diagnostic-log" class="diagnostic-log"><p>System initialized. Analogue sensors ready for testing.</p></div>
        </div>
    `;
    
    initializeAnalogueSensorsControls();
    updateAnalogueSensorsDisplay();
    startAnalogueSensorsSimulation();
}

function initializeAnalogueSensorsControls() {
    // Initialize Chart.js
    const ctx = document.getElementById('signal-chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(50).fill(''),
            datasets: [{
                label: 'Voltage',
                data: Array(50).fill(5),
                borderColor: '#2196F3',
                backgroundColor: 'rgba(33,150,243,0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }, {
                label: 'Scaled',
                data: Array(50).fill(5),
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76,175,80,0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#aaa',
                        font: {
                            family: 'monospace'
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    min: -2,
                    max: 12,
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    },
                    ticks: {
                        color: '#aaa',
                        font: {
                            family: 'monospace'
                        }
                    }
                }
            }
        }
    });
    analogueSensorsData.chart = chart;

    // Initialize noUiSlider controls
    noUiSlider.create(document.getElementById('voltage-slider'), {
        start: 5.0,
        connect: 'lower',
        range: {
            'min': 0,
            'max': 10
        },
        tooltips: {
            to: value => value.toFixed(1) + 'V'
        },
        pips: {
            mode: 'values',
            values: [0, 2, 4, 6, 8, 10],
            density: 10,
            format: {
                to: value => value + 'V'
            }
        }
    }).on('update', function(values) {
        analogueSensorsData.voltageInput = parseFloat(values[0]);
        updateAnalogueSensorsDisplay();
    });

    noUiSlider.create(document.getElementById('scaling-slider'), {
        start: 1.0,
        connect: 'lower',
        range: {
            'min': 0.1,
            'max': 2.0
        },
        tooltips: {
            to: value => value.toFixed(2) + 'x'
        },
        pips: {
            mode: 'values',
            values: [0.1, 0.5, 1.0, 1.5, 2.0],
            density: 10,
            format: {
                to: value => value.toFixed(1) + 'x'
            }
        }
    }).on('update', function(values) {
        analogueSensorsData.scalingFactor = parseFloat(values[0]);
        updateAnalogueSensorsDisplay();
    });

    noUiSlider.create(document.getElementById('offset-slider'), {
        start: 0,
        connect: 'lower',
        range: {
            'min': -5,
            'max': 5
        },
        tooltips: {
            to: value => (value >= 0 ? '+' : '') + value.toFixed(1)
        },
        pips: {
            mode: 'values',
            values: [-5, -2.5, 0, 2.5, 5],
            density: 10,
            format: {
                to: value => (value >= 0 ? '+' : '') + value.toFixed(1)
            }
        }
    }).on('update', function(values) {
        analogueSensorsData.offset = parseFloat(values[0]);
        updateAnalogueSensorsDisplay();
    });

    noUiSlider.create(document.getElementById('noise-slider'), {
        start: 0,
        connect: 'lower',
        range: {
            'min': 0,
            'max': 1
        },
        tooltips: {
            to: value => (value * 100).toFixed(0) + '%'
        },
        pips: {
            mode: 'values',
            values: [0, 0.25, 0.5, 0.75, 1],
            density: 10,
            format: {
                to: value => (value * 100).toFixed(0) + '%'
            }
        }
    }).on('update', function(values) {
        analogueSensorsData.noiseLevel = parseFloat(values[0]);
        updateAnalogueSensorsDisplay();
    });
    
    // Maintenance buttons
    document.getElementById('calibrate-signal').addEventListener('click', calibrateSignal);
    document.getElementById('adjust-scaling').addEventListener('click', adjustScaling);
    document.getElementById('reduce-noise').addEventListener('click', reduceNoise);
    document.getElementById('verify-accuracy').addEventListener('click', verifyAccuracy);
    
    // Fault injection buttons
    document.getElementById('inject-scaling').addEventListener('click', injectScalingFault);
    document.getElementById('inject-offset').addEventListener('click', injectOffsetFault);
    document.getElementById('inject-noise').addEventListener('click', injectNoiseFault);
    document.getElementById('clear-faults').addEventListener('click', clearAllFaults);
    
    // Maintenance task checkboxes
    document.querySelectorAll('.task-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateMaintenanceStatus);
    });
}

function updateAnalogueSensorsDisplay() {
    // Calculate raw value (0-32767 for typical PLC)
    analogueSensorsData.rawValue = Math.round((analogueSensorsData.voltageInput / 10) * 32767);
    
    // Calculate scaled value with offset and noise
    let scaledValue = (analogueSensorsData.rawValue / 32767) * analogueSensorsData.scalingFactor + analogueSensorsData.offset;
    
    // Add noise if present
    if (analogueSensorsData.noiseLevel > 0) {
        const noise = (Math.random() - 0.5) * analogueSensorsData.noiseLevel;
        scaledValue += noise;
    }
    
    analogueSensorsData.scaledValue = scaledValue;
    
    // Update displays with animation
    const voltageDisplay = document.getElementById('voltage-value');
    const rawDisplay = document.getElementById('raw-value');
    const scaledDisplay = document.getElementById('scaled-value');
    
    // Update signal display values
    if (voltageDisplay) {
        const oldValue = parseFloat(voltageDisplay.textContent);
        const newValue = analogueSensorsData.voltageInput;
        if (oldValue !== newValue) {
            voltageDisplay.style.animation = 'valueChange 0.3s ease';
            voltageDisplay.textContent = newValue.toFixed(1);
            setTimeout(() => voltageDisplay.style.animation = '', 300);
        }
    }
    
    if (rawDisplay) {
        const oldValue = parseInt(rawDisplay.textContent);
        const newValue = analogueSensorsData.rawValue;
        if (oldValue !== newValue) {
            rawDisplay.style.animation = 'valueChange 0.3s ease';
            rawDisplay.textContent = newValue;
            setTimeout(() => rawDisplay.style.animation = '', 300);
        }
    }
    
    if (scaledDisplay) {
        const oldValue = parseFloat(scaledDisplay.textContent);
        const newValue = analogueSensorsData.scaledValue;
        if (oldValue !== newValue) {
            scaledDisplay.style.animation = 'valueChange 0.3s ease';
            scaledDisplay.textContent = newValue.toFixed(2);
            setTimeout(() => scaledDisplay.style.animation = '', 300);
        }
    }
    
    // Update control display values
    const voltageControlDisplay = document.getElementById('voltage-display');
    const scalingControlDisplay = document.getElementById('scaling-display');
    const offsetControlDisplay = document.getElementById('offset-display');
    const noiseControlDisplay = document.getElementById('noise-display');
    
    if (voltageControlDisplay) {
        voltageControlDisplay.textContent = analogueSensorsData.voltageInput.toFixed(1) + 'V';
    }
    
    if (scalingControlDisplay) {
        scalingControlDisplay.textContent = analogueSensorsData.scalingFactor.toFixed(2) + 'x';
    }
    
    if (offsetControlDisplay) {
        const offset = analogueSensorsData.offset;
        offsetControlDisplay.textContent = (offset >= 0 ? '+' : '') + offset.toFixed(1);
    }
    
    if (noiseControlDisplay) {
        noiseControlDisplay.textContent = Math.round(analogueSensorsData.noiseLevel * 100) + '%';
    }
    
    // Update chart
    if (analogueSensorsData.chart) {
        const voltageData = analogueSensorsData.chart.data.datasets[0].data;
        const scaledData = analogueSensorsData.chart.data.datasets[1].data;
        
        voltageData.push(analogueSensorsData.voltageInput);
        scaledData.push(analogueSensorsData.scaledValue);
        
        if (voltageData.length > 50) {
            voltageData.shift();
            scaledData.shift();
        }
        
        analogueSensorsData.chart.update('none');
    }
    
    // Update status displays
    updateStatusDisplays();
}

function updateStatusDisplays() {
    const signalQuality = document.getElementById('signal-quality');
    const calibrationStatus = document.getElementById('calibration-status');
    const noiseStatus = document.getElementById('noise-status');
    
    if (signalQuality) {
        const quality = analogueSensorsData.noiseLevel < 0.1 ? 'Good' : analogueSensorsData.noiseLevel < 0.5 ? 'Fair' : 'Poor';
        const oldQuality = signalQuality.textContent;
        if (oldQuality !== quality) {
            signalQuality.style.animation = 'statusUpdate 0.3s ease';
            signalQuality.textContent = quality;
            signalQuality.className = 'status-value status-' + quality.toLowerCase();
            setTimeout(() => signalQuality.style.animation = '', 300);
        }
    }
    
    if (calibrationStatus) {
        const calibration = Math.abs(analogueSensorsData.offset) < 0.5 ? 'Good' : 'Needs Calibration';
        const oldCalibration = calibrationStatus.textContent;
        if (oldCalibration !== calibration) {
            calibrationStatus.style.animation = 'statusUpdate 0.3s ease';
            calibrationStatus.textContent = calibration;
            calibrationStatus.className = 'status-value status-' + (calibration === 'Good' ? 'good' : 'poor');
            setTimeout(() => calibrationStatus.style.animation = '', 300);
        }
    }
    
    if (noiseStatus) {
        const noise = analogueSensorsData.noiseLevel < 0.1 ? 'Low' : analogueSensorsData.noiseLevel < 0.5 ? 'Medium' : 'High';
        const oldNoise = noiseStatus.textContent;
        if (oldNoise !== noise) {
            noiseStatus.style.animation = 'statusUpdate 0.3s ease';
            noiseStatus.textContent = noise;
            noiseStatus.className = 'status-value status-' + (noise === 'Low' ? 'good' : noise === 'Medium' ? 'fair' : 'poor');
            setTimeout(() => noiseStatus.style.animation = '', 300);
        }
    }
}

function calibrateSignal() {
    analogueSensorsData.offset = 0;
    analogueSensorsData.scalingFactor = 1.0;
    document.getElementById('offset').value = 0;
    document.getElementById('scaling-factor').value = 1.0;
    updateAnalogueSensorsDisplay();
    logDiagnostic('Signal calibration completed - offset and scaling reset');
}

function adjustScaling() {
    analogueSensorsData.scalingFactor = 1.0;
    document.getElementById('scaling-factor').value = 1.0;
    updateAnalogueSensorsDisplay();
    logDiagnostic('Scaling adjustment completed');
}

function reduceNoise() {
    analogueSensorsData.noiseLevel = 0;
    document.getElementById('noise-level').value = 0;
    updateAnalogueSensorsDisplay();
    logDiagnostic('Noise reduction completed');
}

function verifyAccuracy() {
    const accuracy = Math.abs(analogueSensorsData.voltageInput - analogueSensorsData.scaledValue);
    const accuracyStatus = accuracy < 0.5 ? 'Good' : 'Needs Attention';
    logDiagnostic('Accuracy verification completed - ' + accuracyStatus + ' (error: ' + accuracy.toFixed(2) + ')');
}

function injectScalingFault() {
    analogueSensorsData.faults.push('scaling');
    const newScaling = Math.random() * 2 + 0.5;
    document.getElementById('scaling-slider').noUiSlider.set(newScaling);
    
    logDiagnostic(`Scaling fault injected:
    • Previous scaling: ${analogueSensorsData.scalingFactor.toFixed(2)}x
    • New scaling: ${newScaling.toFixed(2)}x
    • Effect: Values ${newScaling > analogueSensorsData.scalingFactor ? 'amplified' : 'attenuated'}
    • Calibration required`, 'error');
    
    // Flash the scaling slider
    const slider = document.getElementById('scaling-slider');
    slider.style.animation = 'glowPulse 1s ease';
    setTimeout(() => slider.style.animation = '', 1000);
}

function injectOffsetFault() {
    analogueSensorsData.faults.push('offset');
    const newOffset = (Math.random() - 0.5) * 10;
    document.getElementById('offset-slider').noUiSlider.set(newOffset);
    
    logDiagnostic(`Offset fault injected:
    • Previous offset: ${analogueSensorsData.offset.toFixed(2)}
    • New offset: ${newOffset.toFixed(2)}
    • Shift direction: ${newOffset > 0 ? 'Positive' : 'Negative'}
    • Calibration required`, 'error');
    
    // Flash the offset slider
    const slider = document.getElementById('offset-slider');
    slider.style.animation = 'glowPulse 1s ease';
    setTimeout(() => slider.style.animation = '', 1000);
}

function injectNoiseFault() {
    analogueSensorsData.faults.push('noise');
    const newNoise = Math.random() * 1;
    document.getElementById('noise-slider').noUiSlider.set(newNoise);
    
    logDiagnostic(`Noise fault injected:
    • Previous noise: ${(analogueSensorsData.noiseLevel * 100).toFixed(0)}%
    • New noise: ${(newNoise * 100).toFixed(0)}%
    • Signal quality: ${newNoise < 0.3 ? 'Degraded' : newNoise < 0.6 ? 'Poor' : 'Critical'}
    • Maintenance required`, 'error');
    
    // Flash the noise slider
    const slider = document.getElementById('noise-slider');
    slider.style.animation = 'glowPulse 1s ease';
    setTimeout(() => slider.style.animation = '', 1000);
}

function clearAllFaults() {
    const faultCount = analogueSensorsData.faults.length;
    const hadScalingFault = analogueSensorsData.scalingFactor !== 1.0;
    const hadOffsetFault = analogueSensorsData.offset !== 0;
    const hadNoiseFault = analogueSensorsData.noiseLevel > 0;
    
    analogueSensorsData.faults = [];
    
    // Reset all sliders
    document.getElementById('offset-slider').noUiSlider.set(0);
    document.getElementById('scaling-slider').noUiSlider.set(1.0);
    document.getElementById('noise-slider').noUiSlider.set(0);
    
    logDiagnostic(`System restored to normal operation:
    • Total faults cleared: ${faultCount}
    • Scaling reset: ${hadScalingFault ? 'Yes (1.0x)' : 'No change needed'}
    • Offset reset: ${hadOffsetFault ? 'Yes (0.0)' : 'No change needed'}
    • Noise eliminated: ${hadNoiseFault ? 'Yes (0%)' : 'No change needed'}`, 'success');
    
    // Flash all status indicators
    ['signal-quality', 'calibration-status', 'noise-status'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.animation = 'statusUpdate 1s ease';
            setTimeout(() => element.style.animation = '', 1000);
        }
    });
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
        
        const logEntry = document.createElement('p');
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

function startAnalogueSensorsSimulation() {
    logDiagnostic('Analogue sensors simulation initialized and ready for testing', 'success');
    
    // Periodic updates for noise simulation and chart
    setInterval(() => {
        if (analogueSensorsData.noiseLevel > 0 || analogueSensorsData.faults.length > 0) {
            updateAnalogueSensorsDisplay();
        }
    }, 100);
}

// Auto-initialize if function exists
if (typeof initializeAnalogueSensorsSimulation === 'function') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializeAnalogueSensorsSimulation, 1000);
    });
} 