// Worksheet Tracking and Export System
// This file handles comprehensive tracking of worksheet progress and exports

class WorksheetTracker {
  constructor() {
    this.worksheets = {
      maintenance: [
        { id: 1, title: "Flow Control System Maintenance", type: "maintenance", totalQuestions: 5 },
        { id: 2, title: "Emergency Stop System Maintenance", type: "maintenance", totalQuestions: 5 },
        { id: 3, title: "Status LED System Maintenance", type: "maintenance", totalQuestions: 5 },
        { id: 4, title: "PLC System Maintenance", type: "maintenance", totalQuestions: 5 },
        { id: 5, title: "HMI System Maintenance", type: "maintenance", totalQuestions: 5 },
        { id: 6, title: "Pump System Maintenance", type: "maintenance", totalQuestions: 5 },
        { id: 7, title: "Valve System Maintenance", type: "maintenance", totalQuestions: 5 },
        { id: 8, title: "Float Switch System Maintenance", type: "maintenance", totalQuestions: 5 },
        { id: 9, title: "Proximity Switch System Maintenance", type: "maintenance", totalQuestions: 5 },
        { id: 10, title: "Flow Sensor System Maintenance", type: "maintenance", totalQuestions: 5 },
        { id: 11, title: "Temperature Sensor System Maintenance", type: "maintenance", totalQuestions: 5 },
        { id: 12, title: "Digital Sensors System Maintenance", type: "maintenance", totalQuestions: 5 },
        { id: 13, title: "Analogue Sensors System Maintenance", type: "maintenance", totalQuestions: 5 },
        { id: 14, title: "Fault Detection & Troubleshooting", type: "maintenance", totalQuestions: 5 },
        { id: 15, title: "Lock Out Tag Out", type: "maintenance", totalQuestions: 5 }
      ],
      fault: [
        { id: 1, title: "Titanium Forging System Failure", type: "fault", totalQuestions: 3 },
        { id: 2, title: "Pharmaceutical Cleanroom Contamination", type: "fault", totalQuestions: 3 },
        { id: 3, title: "Injection Molding Temperature Control", type: "fault", totalQuestions: 3 },
        { id: 4, title: "CNC Cooling System Overheating", type: "fault", totalQuestions: 3 },
        { id: 5, title: "Brine System Pump Failure", type: "fault", totalQuestions: 3 },
        { id: 6, title: "pH Control System Imbalance", type: "fault", totalQuestions: 3 },
        { id: 7, title: "Server Room Cooling Emergency", type: "fault", totalQuestions: 3 },
        { id: 8, title: "Sterilizer Pressure Control Fault", type: "fault", totalQuestions: 3 }
      ]
    };

    // Initialize storage if needed
    this.initializeStorage();
  }

  // Initialize storage with default values if not exists
  initializeStorage() {
    try {
      // Initialize overall progress if not exists
      if (!localStorage.getItem('worksheet-overall-progress')) {
        this.updateOverallProgress();
      }
      
      // Initialize student info if not exists
      if (!localStorage.getItem('student-info')) {
        localStorage.setItem('student-info', JSON.stringify({
          name: '',
          id: '',
          lastUpdated: null
        }));
      }

      // Initialize worksheet progress if not exists
      this.worksheets.maintenance.forEach(worksheet => {
        const key = `worksheet-maintenance-${worksheet.id}`;
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, JSON.stringify({
            answers: {},
            metadata: {
              lastUpdated: null,
              completedQuestions: 0,
              totalQuestions: worksheet.totalQuestions,
              completionPercentage: 0
            }
          }));
        }
      });

      this.worksheets.fault.forEach(worksheet => {
        const key = `worksheet-fault-${worksheet.id}`;
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, JSON.stringify({
            answers: {},
            metadata: {
              lastUpdated: null,
              completedQuestions: 0,
              totalQuestions: worksheet.totalQuestions,
              completionPercentage: 0
            }
          }));
        }
      });
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  }

  // Save answer with enhanced tracking
  saveAnswer(worksheetId, questionNumber, answer, type = 'maintenance') {
    try {
      const timestamp = new Date().toISOString();
      const key = `worksheet-${type}-${worksheetId}`;
      
      // Get existing data or initialize new
      let data = JSON.parse(localStorage.getItem(key) || '{}');
      
      // Initialize if empty
      if (!data.answers) data.answers = {};
      if (!data.metadata) data.metadata = {};
      
      // Update answer data
      data.answers[questionNumber] = {
        value: answer,
        timestamp: timestamp
      };
      
      // Update metadata
      data.metadata.lastUpdated = timestamp;
      data.metadata.completedQuestions = Object.keys(data.answers).length;
      
      // Get worksheet definition
      const worksheet = this.worksheets[type].find(w => w.id === parseInt(worksheetId));
      if (worksheet) {
        data.metadata.totalQuestions = worksheet.totalQuestions;
        data.metadata.completionPercentage = Math.round((data.metadata.completedQuestions / worksheet.totalQuestions) * 100);
      }
      
      // Save data
      localStorage.setItem(key, JSON.stringify(data));
      
      // Update overall progress
      this.updateOverallProgress(timestamp);
      
      return true;
    } catch (error) {
      console.error('Error saving answer:', error);
      return false;
    }
  }

  // Get worksheet progress with enhanced error handling
  getWorksheetProgress(worksheetId, type = 'maintenance') {
    try {
      const key = `worksheet-${type}-${worksheetId}`;
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      
      // Get worksheet definition
      const worksheet = this.worksheets[type].find(w => w.id === parseInt(worksheetId));
      const totalQuestions = worksheet ? worksheet.totalQuestions : 0;
      
      // Calculate completion
      const answers = data.answers || {};
      const completedQuestions = Object.keys(answers).length;
      const completionPercentage = totalQuestions > 0 ? 
        Math.round((completedQuestions / totalQuestions) * 100) : 0;
      
      return {
        worksheetId,
        type,
        title: worksheet ? worksheet.title : `Worksheet ${worksheetId}`,
        answers: answers,
        completedQuestions,
        totalQuestions,
        completionPercentage,
        lastUpdated: data.metadata ? data.metadata.lastUpdated : null
      };
    } catch (error) {
      console.error('Error getting worksheet progress:', error);
      return {
        worksheetId,
        type,
        answers: {},
        completedQuestions: 0,
        totalQuestions: 0,
        completionPercentage: 0,
        lastUpdated: null
      };
    }
  }

  // Get all progress with error handling
  getAllProgress() {
    try {
      const allProgress = {};
      
      // Get maintenance worksheets progress
      this.worksheets.maintenance.forEach(worksheet => {
        allProgress[`maintenance-${worksheet.id}`] = this.getWorksheetProgress(worksheet.id, 'maintenance');
      });
      
      // Get fault worksheets progress
      this.worksheets.fault.forEach(worksheet => {
        allProgress[`fault-${worksheet.id}`] = this.getWorksheetProgress(worksheet.id, 'fault');
      });
      
      return allProgress;
    } catch (error) {
      console.error('Error getting all progress:', error);
      return {};
    }
  }

  // Update overall progress with validation
  updateOverallProgress(newLastActivity = null) {
    try {
      const allProgress = this.getAllProgress();
      
      const overallStats = {
        totalWorksheets: this.worksheets.maintenance.length + this.worksheets.fault.length,
        completedWorksheets: 0,
        totalQuestions: 0,
        completedQuestions: 0,
        lastActivity: this.validateTimestamp(newLastActivity) || null
      };
      
      Object.values(allProgress).forEach(progress => {
        if (progress.completedQuestions === progress.totalQuestions) {
          overallStats.completedWorksheets++;
        }
        overallStats.totalQuestions += progress.totalQuestions;
        overallStats.completedQuestions += progress.completedQuestions;
      });
      
      overallStats.completionPercentage = overallStats.totalQuestions > 0 ? 
        Math.round((overallStats.completedQuestions / overallStats.totalQuestions) * 100) : 0;
      
      localStorage.setItem('worksheet-overall-progress', JSON.stringify(overallStats));
      return overallStats;
    } catch (error) {
      console.error('Error updating overall progress:', error);
      return {
        totalWorksheets: 0,
        completedWorksheets: 0,
        totalQuestions: 0,
        completedQuestions: 0,
        completionPercentage: 0,
        lastActivity: null
      };
    }
  }

  // Validate timestamp
  validateTimestamp(timestamp) {
    if (!timestamp) return null;
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime()) || date > new Date()) {
        return null;
      }
      return timestamp;
    } catch (error) {
      return null;
    }
  }

  // Get overall progress with error handling
  getOverallProgress() {
    try {
      const saved = localStorage.getItem('worksheet-overall-progress');
      if (saved) {
        const stats = JSON.parse(saved);
        // Validate lastActivity
        stats.lastActivity = this.validateTimestamp(stats.lastActivity);
        return stats;
      }
      return this.updateOverallProgress();
    } catch (error) {
      console.error('Error getting overall progress:', error);
      return this.updateOverallProgress();
    }
  }

  // Export data for teacher with enhanced metadata
  exportForTeacher() {
    try {
      const allProgress = this.getAllProgress();
      const overallStats = this.getOverallProgress();
      const studentInfo = this.getStudentInfo();
      
      const exportData = {
        studentInfo: {
          ...studentInfo,
          exportDate: new Date().toISOString(),
          exportVersion: '1.1'
        },
        overallStats,
        worksheets: allProgress,
        summary: this.generateSummary(allProgress, overallStats)
      };
      
      return exportData;
    } catch (error) {
      console.error('Error preparing export:', error);
      throw new Error('Failed to prepare export data');
    }
  }

  // Generate enhanced summary
  generateSummary(allProgress, overallStats) {
    const summary = {
      totalWorksheets: overallStats.totalWorksheets,
      completedWorksheets: overallStats.completedWorksheets,
      totalQuestions: overallStats.totalQuestions,
      completedQuestions: overallStats.completedQuestions,
      overallCompletion: overallStats.completionPercentage + '%',
      maintenanceProgress: {
        completed: 0,
        total: this.worksheets.maintenance.length
      },
      faultProgress: {
        completed: 0,
        total: this.worksheets.fault.length
      },
      lastActivity: overallStats.lastActivity
    };
    
    // Calculate progress by type
    Object.entries(allProgress).forEach(([key, progress]) => {
      if (key.startsWith('maintenance-') && progress.completionPercentage === 100) {
        summary.maintenanceProgress.completed++;
      } else if (key.startsWith('fault-') && progress.completionPercentage === 100) {
        summary.faultProgress.completed++;
      }
    });
    
    return summary;
  }

  // Export to JSON with error handling
  exportToJSON() {
    try {
      const exportData = this.exportForTeacher();
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `worksheet-progress-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      return true;
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      throw new Error('Failed to export data');
    }
  }

  // Import from JSON with validation
  importFromJSON(jsonData) {
    try {
      // Validate data structure
      if (!this.validateImportData(jsonData)) {
        throw new Error('Invalid file format');
      }

      // Clear existing data
      this.clearAllProgress();

      // Import student info
      if (jsonData.studentInfo) {
        this.setStudentInfo(
          jsonData.studentInfo.name || '',
          jsonData.studentInfo.id || ''
        );
      }

      // Import worksheet data
      if (jsonData.worksheets) {
        Object.entries(jsonData.worksheets).forEach(([key, progress]) => {
          const [type, id] = key.split('-');
          if (progress.answers) {
            Object.entries(progress.answers).forEach(([questionNumber, answer]) => {
              // Handle both old and new answer format
              const answerValue = typeof answer === 'object' ? answer.value : answer;
              this.saveAnswer(parseInt(id), parseInt(questionNumber), answerValue, type);
            });
          }
        });
      }

      return { success: true, message: 'Import completed successfully!' };
    } catch (error) {
      console.error('Error importing data:', error);
      return { success: false, message: error.message };
    }
  }

  // Validate import data
  validateImportData(data) {
    if (!data || typeof data !== 'object') return false;
    if (!data.worksheets || typeof data.worksheets !== 'object') return false;
    
    // Validate worksheet data
    for (const [key, progress] of Object.entries(data.worksheets)) {
      const [type, id] = key.split('-');
      if (!type || !id || !['maintenance', 'fault'].includes(type)) return false;
      if (!progress || typeof progress !== 'object') return false;
    }
    
    return true;
  }

  // Import from file with progress tracking
  importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          const result = this.importFromJSON(jsonData);
          resolve(result);
        } catch (error) {
          reject(new Error('Failed to parse JSON file: ' + error.message));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }

  // Export to CSV with enhanced formatting
  exportToCSV() {
    try {
      const allProgress = this.getAllProgress();
      const overallStats = this.getOverallProgress();
      const studentInfo = this.getStudentInfo();
      
      let csvContent = "data:text/csv;charset=utf-8,\n";
      
      // Add student info
      csvContent += `Student Name,${studentInfo.name}\n`;
      csvContent += `Student ID,${studentInfo.id}\n\n`;
      
      // Add overall stats
      csvContent += "Overall Statistics\n";
      csvContent += `Total Completion,${overallStats.completionPercentage}%\n`;
      csvContent += `Completed Worksheets,${overallStats.completedWorksheets}/${overallStats.totalWorksheets}\n`;
      csvContent += `Completed Questions,${overallStats.completedQuestions}/${overallStats.totalQuestions}\n\n`;
      
      // Add worksheet details
      csvContent += "Worksheet Progress\n";
      csvContent += "Type,ID,Title,Completed Questions,Total Questions,Completion %,Last Updated\n";
      
      // Add maintenance worksheets
      this.worksheets.maintenance.forEach(worksheet => {
        const progress = allProgress[`maintenance-${worksheet.id}`];
        csvContent += `Maintenance,${worksheet.id},"${worksheet.title}",${progress.completedQuestions},${progress.totalQuestions},${progress.completionPercentage}%,${progress.lastUpdated || 'Never'}\n`;
      });
      
      // Add fault worksheets
      this.worksheets.fault.forEach(worksheet => {
        const progress = allProgress[`fault-${worksheet.id}`];
        csvContent += `Fault,${worksheet.id},"${worksheet.title}",${progress.completedQuestions},${progress.totalQuestions},${progress.completionPercentage}%,${progress.lastUpdated || 'Never'}\n`;
      });
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `worksheet-progress-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw new Error('Failed to export data');
    }
  }

  // Export to PDF with enhanced styling
  exportToPDF() {
    try {
      const exportData = this.exportForTeacher();
      const reportHTML = this.generateReportHTML(exportData);
      
      const reportWindow = window.open('', '_blank');
      reportWindow.document.write(reportHTML);
      reportWindow.document.close();
      
      setTimeout(() => {
        reportWindow.print();
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw new Error('Failed to export data');
    }
  }

  // Generate enhanced HTML report
  generateReportHTML(exportData) {
    const studentInfo = exportData.studentInfo;
    const overallStats = exportData.overallStats;
    const worksheets = exportData.worksheets;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Progress Report - ${studentInfo.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .student-info { margin-bottom: 20px; }
          .student-info p { margin: 5px 0; }
          .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 30px; }
          .progress-section { margin-bottom: 30px; }
          .progress-section h2 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
          .worksheet-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
          .worksheet-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
          .progress-bar { background: #ddd; height: 20px; border-radius: 10px; overflow: hidden; margin: 10px 0; }
          .progress-fill { background: #4CAF50; height: 100%; }
          .worksheet-stats { display: flex; justify-content: space-between; color: #666; font-size: 0.9em; }
          .completed { border-left: 4px solid #4CAF50; }
          .incomplete { border-left: 4px solid #ff9800; }
          .not-started { border-left: 4px solid #f44336; }
          @media print {
            .worksheet-grid { page-break-inside: avoid; }
            .worksheet-card { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Student Progress Report</h1>
          <div class="student-info">
            <p><strong>Name:</strong> ${studentInfo.name}</p>
            <p><strong>ID:</strong> ${studentInfo.id}</p>
            <p><strong>Report Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
        
        <div class="summary">
          <h2>Overall Progress</h2>
          <p><strong>Total Completion:</strong> ${overallStats.completionPercentage}%</p>
          <p><strong>Completed Worksheets:</strong> ${overallStats.completedWorksheets}/${overallStats.totalWorksheets}</p>
          <p><strong>Questions Completed:</strong> ${overallStats.completedQuestions}/${overallStats.totalQuestions}</p>
          <p><strong>Last Activity:</strong> ${overallStats.lastActivity ? new Date(overallStats.lastActivity).toLocaleDateString() : 'Never'}</p>
        </div>
        
        <div class="progress-section">
          <h2>Maintenance Worksheets (CP0539)</h2>
          <div class="worksheet-grid">
            ${this.worksheets.maintenance.map(worksheet => {
              const progress = worksheets[`maintenance-${worksheet.id}`];
              const statusClass = progress.completedQuestions === 0 ? 'not-started' : 
                                progress.completionPercentage === 100 ? 'completed' : 'incomplete';
              return `
                <div class="worksheet-card ${statusClass}">
                  <h3>${worksheet.title}</h3>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress.completionPercentage}%"></div>
                  </div>
                  <div class="worksheet-stats">
                    <span>${progress.completedQuestions}/${progress.totalQuestions} questions</span>
                    <span>${progress.completionPercentage}%</span>
                  </div>
                  ${progress.lastUpdated ? 
                    `<p class="last-update">Last updated: ${new Date(progress.lastUpdated).toLocaleDateString()}</p>` 
                    : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div class="progress-section">
          <h2>Fault Scenarios (CP6773)</h2>
          <div class="worksheet-grid">
            ${this.worksheets.fault.map(worksheet => {
              const progress = worksheets[`fault-${worksheet.id}`];
              const statusClass = progress.completedQuestions === 0 ? 'not-started' : 
                                progress.completionPercentage === 100 ? 'completed' : 'incomplete';
              return `
                <div class="worksheet-card ${statusClass}">
                  <h3>${worksheet.title}</h3>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress.completionPercentage}%"></div>
                  </div>
                  <div class="worksheet-stats">
                    <span>${progress.completedQuestions}/${progress.totalQuestions} questions</span>
                    <span>${progress.completionPercentage}%</span>
                  </div>
                  ${progress.lastUpdated ? 
                    `<p class="last-update">Last updated: ${new Date(progress.lastUpdated).toLocaleDateString()}</p>` 
                    : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Clear all progress with confirmation
  clearAllProgress() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('worksheet-') || key === 'student-info') {
          localStorage.removeItem(key);
        }
      });
      this.initializeStorage();
      return true;
    } catch (error) {
      console.error('Error clearing progress:', error);
      return false;
    }
  }

  // Set student information with validation
  setStudentInfo(name, id) {
    try {
      const studentInfo = {
        name: name.trim(),
        id: id.trim(),
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('student-info', JSON.stringify(studentInfo));
      return true;
    } catch (error) {
      console.error('Error setting student info:', error);
      return false;
    }
  }

  // Get student information with defaults
  getStudentInfo() {
    try {
      const saved = localStorage.getItem('student-info');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error getting student info:', error);
    }
    return {
      name: '',
      id: '',
      lastUpdated: null
    };
  }
}

// Create global instance
const worksheetTracker = new WorksheetTracker();

// Function to track fault scenario answers
function trackFaultScenarioAnswer(questionType, answer) {
  try {
    const path = window.location.pathname;
    const faultMatch = path.match(/fault-scenario-(\d+)\.html/);
    if (!faultMatch) {
      console.error('Could not determine fault scenario ID from URL');
      return false;
    }
    
    const worksheetId = parseInt(faultMatch[1]);
    const type = 'fault';
    
    // Save with enhanced tracking
    const success = worksheetTracker.saveAnswer(worksheetId, questionType, answer, type);
    
    if (success) {
      console.log(`Fault scenario ${worksheetId} answer saved: ${questionType} = ${answer}`);
    }
    
    return success;
  } catch (error) {
    console.error('Error tracking fault scenario answer:', error);
    return false;
  }
}

// Enhanced submitAnswer function
function submitAnswerWithTracking(questionNumber) {
  try {
    const worksheetId = getUrlParameter('id') || getWorksheetIdFromUrl();
    // Detect if this is a fault scenario based on URL
    const path = window.location.pathname;
    const isFaultScenario = path.includes('fault-scenario');
    const type = getUrlParameter('type') || (isFaultScenario ? 'fault' : 'maintenance');
    
    const answerInput = document.querySelector(`[data-question="${questionNumber}"]`);
    if (!answerInput) return false;
    
    const selectedOption = document.querySelector(`input[name="question-${questionNumber}"]:checked`);
    if (!selectedOption) {
      alert('Please select an answer before submitting.');
      return false;
    }
    
    const answer = selectedOption.value;
    
    // Save with enhanced tracking
    const success = worksheetTracker.saveAnswer(worksheetId, questionNumber, answer, type);
    
    if (success) {
      // Show feedback
      const submitBtn = answerInput.querySelector('.submit-question-btn');
      if (submitBtn) {
        submitBtn.textContent = 'Answer Saved!';
        submitBtn.style.background = '#4CAF50';
        setTimeout(() => {
          submitBtn.textContent = 'Submit Answer';
          submitBtn.style.background = '#4CAF50';
        }, 2000);
      }
      
      // Show correct answer if available
      const correctAnswer = answerInput.querySelector('.correct-answer');
      if (correctAnswer) {
        correctAnswer.style.display = 'block';
      }
    }
    
    return success;
  } catch (error) {
    console.error('Error submitting answer:', error);
    return false;
  }
}

// Override existing submitAnswer function
if (typeof submitAnswer === 'function') {
  window.submitAnswerOriginal = submitAnswer;
  window.submitAnswer = submitAnswerWithTracking;
} 