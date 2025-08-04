/**
 * Shared Components for Fault Scenarios
 * This file contains reusable components that appear across multiple fault scenarios
 */

/**
 * Creates and inserts the educational note before simulation sections
 * @param {string} targetSelector - CSS selector for the element before which to insert the note
 */
function insertEducationalNote(targetSelector = '.simulation-section') {
  const educationalNoteHTML = `
    <!-- Educational Note Section -->
    <div class="worksheet-section note-section">
      <div class="educational-note">
        <h4><i class="fas fa-info-circle"></i> Educational Note</h4>
        <p>The simulation below is designed to aid in further learning and understanding of system behavior. It is not necessarily intended to be used as a direct troubleshooting tool for the above scenario, but rather to help you explore and understand the relationships between different system parameters.</p>
      </div>
    </div>
  `;

  // First try to find active simulation section
  let targetElement = document.querySelector(targetSelector);
  
  if (targetElement) {
    targetElement.insertAdjacentHTML('beforebegin', educationalNoteHTML);
    return;
  }
  
  // If no active simulation found, look for simulation comment and insert before it
  const bodyHTML = document.body.innerHTML;
  const commentPattern = /<!--\s*Simulation Section[\s\S]*?-->/i;
  const match = bodyHTML.match(commentPattern);
  
  if (match) {
    const newHTML = bodyHTML.replace(commentPattern, educationalNoteHTML + '\n\n    ' + match[0]);
    document.body.innerHTML = newHTML;
  }
}

/**
 * Adds the educational note CSS styles to the document
 */
function addEducationalNoteStyles() {
  const styles = `
    <style>
      .educational-note {
        background: #2A4D5B;
        padding: 20px;
        border-radius: 8px;
        border-left: 4px solid #4FC3F7;
        margin: 20px 0;
      }
      
      .educational-note h4 {
        color: #4FC3F7;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 16px;
      }
      
      .educational-note p {
        color: #E0F2F1;
        margin: 0;
        line-height: 1.6;
        font-size: 14px;
      }
    </style>
  `;
  
  document.head.insertAdjacentHTML('beforeend', styles);
}

/**
 * Initialize educational note on page load
 * Call this function in your DOMContentLoaded event
 */
function initializeEducationalNote() {
  addEducationalNoteStyles();
  insertEducationalNote();
}
