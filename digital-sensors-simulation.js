// Digital Sensors Simulation
// Worksheet 12 - Digital Sensors System Maintenance

let digitalSensorsData = {
    sensors: {
        sensor1: { state: false, type: 'NO', health: 100 },
        sensor2: { state: false, type: 'NC', health: 100 },
        sensor3: { state: false, type: 'NO', health: 100 }
    },
    plcInputs: [false, false, false],
    wiringStatus: [true, true, true],
    faults: []
};

function initializeDigitalSensorsSimulation() {
    console.log('Initializing Digital Sensors Simulation');
    
    const panel = document.getElementById('digital-sensors-panel');
    if (!panel) {
        console.error('Digital sensors panel not found');
        return;
    }
    
    panel.innerHTML = `
        <style>
          #digital-sensors-panel .card { background: #1a1a1a; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
          #digital-sensors-panel .grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
          #digital-sensors-panel .two-col { display: grid; grid-template-columns: 1fr; gap: 16px; }
          #digital-sensors-panel .sensor-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
          #digital-sensors-panel .plc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; }
          #digital-sensors-panel .sensor-item { background: #23272b; padding: 12px; border-radius: 8px; border: 1px solid #333; display: grid; grid-template-columns: 1fr auto auto; gap: 12px; align-items: center; }
          #digital-sensors-panel .sensor-label { color: #aaa; font-weight: bold; display: flex; align-items: center; gap: 8px; }
          #digital-sensors-panel .sensor-indicator { width: 32px; height: 32px; border-radius: 50%; position: relative; transition: all 0.3s ease; }
          #digital-sensors-panel .sensor-indicator.off { background: linear-gradient(145deg, #1a1a1a, #333); box-shadow: inset 0 0 8px rgba(0,0,0,0.5); }
          #digital-sensors-panel .sensor-indicator.on { background: linear-gradient(145deg, #4CAF50, #388E3C); box-shadow: 0 0 16px rgba(76,175,80,0.4); }
          #digital-sensors-panel .sensor-indicator::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 16px; height: 16px; border-radius: 50%; background: rgba(255,255,255,0.1); }
          #digital-sensors-panel .toggle-btn { background: #2196F3; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-weight: bold; transition: all 0.3s ease; display: flex; align-items: center; gap: 6px; font-size: 0.9em; }
          #digital-sensors-panel .toggle-btn:hover { background: #1976D2; box-shadow: 0 0 12px rgba(33,150,243,0.3); }
          #digital-sensors-panel .wiring-diagram { background: #23272b; padding: 16px; border-radius: 8px; margin: 16px 0; position: relative; height: 180px; overflow: hidden; }
          #digital-sensors-panel .wire { position: absolute; background: #444; transition: all 0.3s ease; }
          #digital-sensors-panel .wire.active { background: #2196F3; box-shadow: 0 0 8px rgba(33,150,243,0.4); }
          #digital-sensors-panel .wire.fault { background: #FF5722; box-shadow: 0 0 8px rgba(255,87,34,0.4); }
          #digital-sensors-panel .connection-point { position: absolute; width: 10px; height: 10px; background: #666; border-radius: 50%; border: 2px solid #444; transition: all 0.3s ease; }
          #digital-sensors-panel .connection-point.active { background: #2196F3; border-color: #1976D2; box-shadow: 0 0 8px rgba(33,150,243,0.4); }
          #digital-sensors-panel .connection-point.fault { background: #FF5722; border-color: #F4511E; box-shadow: 0 0 8px rgba(255,87,34,0.4); }
          #digital-sensors-panel .plc-input { background: #23272b; padding: 12px; border-radius: 8px; text-align: center; border: 1px solid #333; }
          #digital-sensors-panel .input-label { color: #aaa; display: block; margin-bottom: 8px; font-weight: bold; font-size: 0.9em; }
          #digital-sensors-panel .plc-indicator { width: 24px; height: 24px; border-radius: 50%; margin: 0 auto; transition: all 0.3s ease; }
          #digital-sensors-panel .plc-indicator.off { background: linear-gradient(145deg, #1a1a1a, #333); box-shadow: inset 0 0 8px rgba(0,0,0,0.5); }
          #digital-sensors-panel .plc-indicator.on { background: linear-gradient(145deg, #2196F3, #1976D2); box-shadow: 0 0 16px rgba(33,150,243,0.4); }
          #digital-sensors-panel .maintenance-btn, #digital-sensors-panel .fault-btn { width: 100%; padding: 10px; border: none; border-radius: 5px; color: white; font-weight: bold; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 8px; font-size: 0.9em; }
          #digital-sensors-panel .maintenance-btn { background: #2196F3; }
          #digital-sensors-panel .maintenance-btn:hover { background: #1976D2; box-shadow: 0 0 12px rgba(33,150,243,0.3); }
          #digital-sensors-panel .fault-btn { background: #FF5722; }
          #digital-sensors-panel .fault-btn:hover { background: #F4511E; box-shadow: 0 0 12px rgba(255,87,34,0.3); }
          #digital-sensors-panel .task-item { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding: 8px; background: #23272b; border-radius: 5px; cursor: pointer; }
          #digital-sensors-panel .task-item input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }
          #digital-sensors-panel .task-item label { color: #aaa; cursor: pointer; flex: 1; font-size: 0.9em; }
          #digital-sensors-panel .diagnostic-log { background: #23272b; padding: 12px; border-radius: 5px; max-height: 180px; overflow-y: auto; font-family: monospace; color: #aaa; margin-top: 8px; font-size: 0.85em; }
          #digital-sensors-panel .diagnostic-log p { margin: 4px 0; padding: 4px; border-radius: 3px; transition: background-color 0.3s ease; }
          #digital-sensors-panel .diagnostic-log p:hover { background: rgba(255,255,255,0.05); }
          @media (min-width: 900px) {
            #digital-sensors-panel .two-col { grid-template-columns: 1fr 320px; }
            #digital-sensors-panel .sensor-grid { grid-template-columns: 1fr; }
            #digital-sensors-panel .plc-grid { grid-template-columns: repeat(3, 1fr); }
          }
        </style>
        <div class="card">
          <h3 style="color:#2196F3; margin:0; display:flex; align-items:center; gap:10px;">
            <i class="fas fa-toggle-on"></i> Digital Sensors System
          </h3>
          <p style="color:#aaa; margin:8px 0 0 0;">Interactive digital sensors maintenance and troubleshooting simulation</p>
        </div>
        <div class="two-col">
          <div>
            <div class="card">
              <h4 style="color:#2196F3; margin:0 0 10px 0; display:flex; align-items:center; gap:10px;"><i class="fas fa-microchip"></i> Digital Sensors Status</h4>
              <div id="sensors-display" class="sensor-grid">
                <div class="sensor-item">
                  <div class="sensor-label"><i class="fas fa-circle"></i> Sensor 1 (NO)</div>
                  <div id="sensor1-indicator" class="sensor-indicator off"></div>
                  <button id="toggle-sensor1" class="toggle-btn"><i class="fas fa-power-off"></i> Toggle</button>
                </div>
                <div class="sensor-item">
                  <div class="sensor-label"><i class="fas fa-circle"></i> Sensor 2 (NC)</div>
                  <div id="sensor2-indicator" class="sensor-indicator off"></div>
                  <button id="toggle-sensor2" class="toggle-btn"><i class="fas fa-power-off"></i> Toggle</button>
                </div>
                <div class="sensor-item">
                  <div class="sensor-label"><i class="fas fa-circle"></i> Sensor 3 (NO)</div>
                  <div id="sensor3-indicator" class="sensor-indicator off"></div>
                  <button id="toggle-sensor3" class="toggle-btn"><i class="fas fa-power-off"></i> Toggle</button>
                </div>
              </div>
            </div>
            <div class="wiring-diagram">
              <div id="wire1" class="wire"></div>
              <div id="wire2" class="wire"></div>
              <div id="wire3" class="wire"></div>
              <div id="sensor1-point" class="connection-point" style="left: 16px; top: 40px;"></div>
              <div id="sensor2-point" class="connection-point" style="left: 16px; top: 80px;"></div>
              <div id="sensor3-point" class="connection-point" style="left: 16px; top: 120px;"></div>
              <div id="plc1-point" class="connection-point" style="right: 16px; top: 40px;"></div>
              <div id="plc2-point" class="connection-point" style="right: 16px; top: 80px;"></div>
              <div id="plc3-point" class="connection-point" style="right: 16px; top: 120px;"></div>
            </div>
            <div class="card">
              <h4 style="color:#2196F3; margin:0 0 10px 0; display:flex; align-items:center; gap:10px;"><i class="fas fa-microchip"></i> PLC Input Status</h4>
              <div class="plc-grid">
                <div class="plc-input">
                  <span class="input-label">Input 1</span>
                  <div id="plc-input1" class="plc-indicator off"></div>
                  <div style="color: #666; margin-top: 4px; font-size: 0.8em;">0-24V DC</div>
                </div>
                <div class="plc-input">
                  <span class="input-label">Input 2</span>
                  <div id="plc-input2" class="plc-indicator off"></div>
                  <div style="color: #666; margin-top: 4px; font-size: 0.8em;">0-24V DC</div>
                </div>
                <div class="plc-input">
                  <span class="input-label">Input 3</span>
                  <div id="plc-input3" class="plc-indicator off"></div>
                  <div style="color: #666; margin-top: 4px; font-size: 0.8em;">0-24V DC</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="card">
              <h4 style="color:#2196F3; margin:0 0 10px 0; display:flex; align-items:center; gap:10px;"><i class="fas fa-tools"></i> Maintenance Tools</h4>
              <div class="grid">
                <button id="test-continuity" class="maintenance-btn"><i class="fas fa-bolt"></i> Test Continuity</button>
                <button id="check-wiring" class="maintenance-btn"><i class="fas fa-plug"></i> Check Wiring</button>
                <button id="verify-logic" class="maintenance-btn"><i class="fas fa-code-branch"></i> Verify Logic</button>
                <button id="reset-sensors" class="maintenance-btn"><i class="fas fa-undo"></i> Reset Sensors</button>
              </div>
            </div>
            <div class="card">
              <h4 style="color:#FF5722; margin:0 0 10px 0; display:flex; align-items:center; gap:10px;"><i class="fas fa-exclamation-triangle"></i> Fault Injection</h4>
              <div class="grid">
                <button id="inject-wiring" class="fault-btn"><i class="fas fa-cut"></i> Wiring Fault</button>
                <button id="inject-sensor" class="fault-btn"><i class="fas fa-exclamation-circle"></i> Sensor Fault</button>
                <button id="inject-logic" class="fault-btn"><i class="fas fa-random"></i> Logic Fault</button>
                <button id="clear-faults" style="background: #4CAF50; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.9em;"><i class="fas fa-broom"></i> Clear All Faults</button>
              </div>
            </div>
            <div class="card">
              <h4 style="color:#4CAF50; margin:0 0 10px 0; display:flex; align-items:center; gap:10px;"><i class="fas fa-tasks"></i> Maintenance Tasks</h4>
              <div class="grid">
                <label class="task-item"><input type="checkbox" id="task-continuity"><span>Test wire continuity</span></label>
                <label class="task-item"><input type="checkbox" id="task-wiring"><span>Check terminal connections</span></label>
                <label class="task-item"><input type="checkbox" id="task-logic"><span>Verify NO/NC logic</span></label>
                <label class="task-item"><input type="checkbox" id="task-interface"><span>Test interface requirements</span></label>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <h4 style="color:#2196F3; margin:0 0 10px 0; display:flex; align-items:center; gap:10px;"><i class="fas fa-terminal"></i> Diagnostic Information</h4>
          <div id="diagnostic-log" class="diagnostic-log"><p>System initialized. Digital sensors ready for testing.</p></div>
        </div>
    `;
    
    initializeDigitalSensorsControls();
    updateDigitalSensorsDisplay();
    startDigitalSensorsSimulation();
}

function initializeDigitalSensorsControls() {
    // Sensor toggle buttons
    document.getElementById('toggle-sensor1').addEventListener('click', () => toggleSensor('sensor1'));
    document.getElementById('toggle-sensor2').addEventListener('click', () => toggleSensor('sensor2'));
    document.getElementById('toggle-sensor3').addEventListener('click', () => toggleSensor('sensor3'));
    
    // Maintenance buttons
    document.getElementById('test-continuity').addEventListener('click', testContinuity);
    document.getElementById('check-wiring').addEventListener('click', checkWiring);
    document.getElementById('verify-logic').addEventListener('click', verifyLogic);
    document.getElementById('reset-sensors').addEventListener('click', resetSensors);
    
    // Fault injection buttons
    document.getElementById('inject-wiring').addEventListener('click', injectWiringFault);
    document.getElementById('inject-sensor').addEventListener('click', injectSensorFault);
    document.getElementById('inject-logic').addEventListener('click', injectLogicFault);
    document.getElementById('clear-faults').addEventListener('click', clearAllFaults);
    
    // Maintenance task checkboxes
    document.querySelectorAll('.task-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateMaintenanceStatus);
    });
}

function toggleSensor(sensorId) {
    digitalSensorsData.sensors[sensorId].state = !digitalSensorsData.sensors[sensorId].state;
    updateDigitalSensorsDisplay();
    logDiagnostic('Sensor ' + sensorId + ' toggled to ' + (digitalSensorsData.sensors[sensorId].state ? 'ON' : 'OFF'));
}

function updateDigitalSensorsDisplay() {
    // Update sensor indicators and wiring
    Object.keys(digitalSensorsData.sensors).forEach((sensorId, index) => {
        const sensor = digitalSensorsData.sensors[sensorId];
        const indicator = document.getElementById(sensorId + '-indicator');
        const plcIndicator = document.getElementById('plc-input' + (index + 1));
        
        // Update sensor indicator
        if (indicator) {
            indicator.className = 'sensor-indicator ' + (sensor.state ? 'on' : 'off');
            indicator.style.boxShadow = sensor.state ? 
                '0 0 20px rgba(76,175,80,0.4)' : 
                'inset 0 0 10px rgba(0,0,0,0.5)';
        }
        
        // Calculate PLC input based on sensor type and state
        let plcInput = sensor.state;
        if (sensor.type === 'NC') {
            plcInput = !sensor.state; // NC is inverted
        }
        
        // Apply wiring faults
        const hasWiringFault = !digitalSensorsData.wiringStatus[index];
        if (hasWiringFault) {
            plcInput = false; // Wiring fault forces input to false
        }
        
        digitalSensorsData.plcInputs[index] = plcInput;
        
        // Update PLC indicator
        if (plcIndicator) {
            plcIndicator.className = 'plc-indicator ' + (plcInput ? 'on' : 'off');
            plcIndicator.style.boxShadow = plcInput ? 
                '0 0 20px rgba(33,150,243,0.4)' : 
                'inset 0 0 10px rgba(0,0,0,0.5)';
        }
        
        // Update wiring visualization
        const wire = document.getElementById('wire' + (index + 1));
        const sensorPoint = document.getElementById('sensor' + (index + 1) + '-point');
        const plcPoint = document.getElementById('plc' + (index + 1) + '-point');
        
        if (wire && sensorPoint && plcPoint) {
            // Position wire
            const sensorRect = sensorPoint.getBoundingClientRect();
            const plcRect = plcPoint.getBoundingClientRect();
            const diagramRect = wire.parentElement.getBoundingClientRect();
            
            const startX = sensorPoint.offsetLeft + 6;
            const startY = sensorPoint.offsetTop + 6;
            const endX = plcPoint.offsetLeft + 6;
            const endY = plcPoint.offsetTop + 6;
            
            wire.style.left = startX + 'px';
            wire.style.top = startY + 'px';
            wire.style.width = (endX - startX) + 'px';
            wire.style.height = '2px';
            
            // Update wire and connection point states
            if (hasWiringFault) {
                wire.className = 'wire fault';
                sensorPoint.className = 'connection-point fault';
                plcPoint.className = 'connection-point fault';
            } else if (sensor.state) {
                wire.className = 'wire active';
                sensorPoint.className = 'connection-point active';
                plcPoint.className = 'connection-point active';
            } else {
                wire.className = 'wire';
                sensorPoint.className = 'connection-point';
                plcPoint.className = 'connection-point';
            }
        }
    });
}

function testContinuity() {
    const results = digitalSensorsData.wiringStatus.map((status, index) => {
        const resistance = status ? '< 1Ω' : '∞ Ω';
        const voltage = status ? '24V' : '0V';
        return {
            input: index + 1,
            status: status ? 'Good' : 'Open Circuit',
            resistance,
            voltage
        };
    });
    
    const hasIssues = results.some(r => r.status !== 'Good');
    const messageType = hasIssues ? 'warning' : 'success';
    
    logDiagnostic(`Continuity test completed:
    ${results.map(r => `• Input ${r.input}: ${r.status}
    \t- Resistance: ${r.resistance}
    \t- Voltage: ${r.voltage}`).join('\n')}`, messageType);
    
    // Highlight tested wires
    results.forEach((result, index) => {
        const wire = document.getElementById('wire' + (index + 1));
        if (wire) {
            wire.style.animation = 'activeGlow 1s ease';
            setTimeout(() => {
                wire.style.animation = '';
            }, 1000);
        }
    });
}

function checkWiring() {
    const issues = digitalSensorsData.wiringStatus.map((status, index) => ({
        input: index + 1,
        status: status ? 'Connected' : 'Disconnected',
        voltage: status ? '24V' : '0V',
        current: status ? '20mA' : '0mA'
    }));
    
    const hasIssues = issues.some(i => i.status === 'Disconnected');
    const messageType = hasIssues ? 'warning' : 'success';
    
    logDiagnostic(`Wiring check completed:
    ${issues.map(i => `• Input ${i.input}: ${i.status}
    \t- Voltage: ${i.voltage}
    \t- Current: ${i.current}`).join('\n')}`, messageType);
    
    // Highlight connection points
    issues.forEach((issue, index) => {
        const sensorPoint = document.getElementById('sensor' + (index + 1) + '-point');
        const plcPoint = document.getElementById('plc' + (index + 1) + '-point');
        
        [sensorPoint, plcPoint].forEach(point => {
            if (point) {
                point.style.animation = 'activeGlow 1s ease';
                setTimeout(() => {
                    point.style.animation = '';
                }, 1000);
            }
        });
    });
}

function verifyLogic() {
    const results = Object.keys(digitalSensorsData.sensors).map((sensorId, index) => {
        const sensor = digitalSensorsData.sensors[sensorId];
        const expectedPlcInput = sensor.type === 'NC' ? !sensor.state : sensor.state;
        const actualPlcInput = digitalSensorsData.plcInputs[index];
        
        return {
            sensor: sensorId,
            type: sensor.type,
            state: sensor.state ? 'ON' : 'OFF',
            expected: expectedPlcInput ? 'ON' : 'OFF',
            actual: actualPlcInput ? 'ON' : 'OFF',
            status: expectedPlcInput === actualPlcInput ? 'Pass' : 'Fail'
        };
    });
    
    const hasIssues = results.some(r => r.status === 'Fail');
    const messageType = hasIssues ? 'warning' : 'success';
    
    logDiagnostic(`Logic verification completed:
    ${results.map(r => `• ${r.sensor} (${r.type}): ${r.status}
    \t- Sensor State: ${r.state}
    \t- Expected PLC: ${r.expected}
    \t- Actual PLC: ${r.actual}`).join('\n')}`, messageType);
    
    // Highlight verified components
    results.forEach((result, index) => {
        const indicator = document.getElementById(result.sensor + '-indicator');
        const plcIndicator = document.getElementById('plc-input' + (index + 1));
        
        [indicator, plcIndicator].forEach(element => {
            if (element) {
                element.style.animation = 'activeGlow 1s ease';
                setTimeout(() => {
                    element.style.animation = '';
                }, 1000);
            }
        });
    });
}

function resetSensors() {
    const previousStates = Object.keys(digitalSensorsData.sensors).map(sensorId => ({
        sensor: sensorId,
        state: digitalSensorsData.sensors[sensorId].state ? 'ON' : 'OFF'
    }));
    
    Object.keys(digitalSensorsData.sensors).forEach(sensorId => {
        digitalSensorsData.sensors[sensorId].state = false;
    });
    updateDigitalSensorsDisplay();
    
    logDiagnostic(`Sensors reset completed:
    ${previousStates.map(s => `• ${s.sensor}: ${s.state} → OFF`).join('\n')}`, 'success');
}

function injectWiringFault() {
    digitalSensorsData.faults.push('wiring');
    const randomIndex = Math.floor(Math.random() * 3);
    digitalSensorsData.wiringStatus[randomIndex] = false;
    updateDigitalSensorsDisplay();
    
    logDiagnostic(`Wiring fault injected:
    • Input ${randomIndex + 1} connection lost
    • Circuit open detected
    • Signal path interrupted
    • Maintenance required`, 'error');
    
    // Flash affected wire
    const wire = document.getElementById('wire' + (randomIndex + 1));
    if (wire) {
        wire.style.animation = 'wireFault 1s ease';
        setTimeout(() => {
            wire.style.animation = '';
        }, 1000);
    }
}

function injectSensorFault() {
    digitalSensorsData.faults.push('sensor');
    const randomSensor = Object.keys(digitalSensorsData.sensors)[Math.floor(Math.random() * 3)];
    const healthReduction = 30;
    const oldHealth = digitalSensorsData.sensors[randomSensor].health;
    digitalSensorsData.sensors[randomSensor].health = Math.max(0, oldHealth - healthReduction);
    
    logDiagnostic(`Sensor fault injected:
    • ${randomSensor} health degraded
    • Health reduction: ${healthReduction}%
    • Current health: ${digitalSensorsData.sensors[randomSensor].health}%
    • Calibration recommended`, 'error');
    
    // Flash affected sensor
    const indicator = document.getElementById(randomSensor + '-indicator');
    if (indicator) {
        indicator.style.animation = 'sensorFault 1s ease';
        setTimeout(() => {
            indicator.style.animation = '';
        }, 1000);
    }
}

function injectLogicFault() {
    digitalSensorsData.faults.push('logic');
    const randomSensor = Object.keys(digitalSensorsData.sensors)[Math.floor(Math.random() * 3)];
    const oldType = digitalSensorsData.sensors[randomSensor].type;
    const newType = oldType === 'NO' ? 'NC' : 'NO';
    digitalSensorsData.sensors[randomSensor].type = newType;
    updateDigitalSensorsDisplay();
    
    logDiagnostic(`Logic fault injected:
    • ${randomSensor} type changed
    • Previous type: ${oldType}
    • Current type: ${newType}
    • Logic verification needed`, 'error');
    
    // Flash affected sensor and PLC input
    const sensorIndex = parseInt(randomSensor.replace('sensor', '')) - 1;
    const plcIndicator = document.getElementById('plc-input' + (sensorIndex + 1));
    if (plcIndicator) {
        plcIndicator.style.animation = 'logicFault 1s ease';
        setTimeout(() => {
            plcIndicator.style.animation = '';
        }, 1000);
    }
}

function clearAllFaults() {
    const faultCount = digitalSensorsData.faults.length;
    const wiringFaults = digitalSensorsData.wiringStatus.filter(status => !status).length;
    const sensorFaults = Object.values(digitalSensorsData.sensors).filter(sensor => sensor.health < 100).length;
    const logicFaults = Object.values(digitalSensorsData.sensors).filter(sensor => 
        (sensor.type === 'NO' && sensor === digitalSensorsData.sensors.sensor2) || 
        (sensor.type === 'NC' && sensor !== digitalSensorsData.sensors.sensor2)
    ).length;
    
    digitalSensorsData.faults = [];
    digitalSensorsData.wiringStatus = [true, true, true];
    Object.keys(digitalSensorsData.sensors).forEach(sensorId => {
        digitalSensorsData.sensors[sensorId].health = 100;
        digitalSensorsData.sensors[sensorId].type = sensorId === 'sensor2' ? 'NC' : 'NO';
    });
    updateDigitalSensorsDisplay();
    
    logDiagnostic(`System restored to normal operation:
    • Total faults cleared: ${faultCount}
    • Wiring faults fixed: ${wiringFaults}
    • Sensor health restored: ${sensorFaults}
    • Logic types corrected: ${logicFaults}`, 'success');
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

function startDigitalSensorsSimulation() {
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes wireFault {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }
        
        @keyframes sensorFault {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
        
        @keyframes logicFault {
            0%, 100% { filter: brightness(1); }
            50% { filter: brightness(1.5); }
        }
        
        @keyframes activeGlow {
            0% { box-shadow: 0 0 5px currentColor; }
            50% { box-shadow: 0 0 15px currentColor; }
            100% { box-shadow: 0 0 5px currentColor; }
        }
    `;
    document.head.appendChild(style);
    
    logDiagnostic('Digital sensors simulation initialized and ready for testing', 'success');
}

// Auto-initialize if function exists
if (typeof initializeDigitalSensorsSimulation === 'function') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializeDigitalSensorsSimulation, 1000);
    });
} 