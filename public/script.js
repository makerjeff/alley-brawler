document.addEventListener('DOMContentLoaded', function() {
  const actionDisplay = document.getElementById('action-display');
  const resetButton = document.getElementById('reset-button');
  let actionHistory = [];

  // Joystick directions
  const directions = document.querySelectorAll('.direction');
  directions.forEach(dir => {
    dir.addEventListener('mousedown', handleDirectionPress);
    dir.addEventListener('touchstart', handleDirectionPress);
  });

  // Buttons
  const buttons = document.querySelectorAll('button[data-button]');
  buttons.forEach(btn => {
    btn.addEventListener('mousedown', handleButtonPress);
    btn.addEventListener('touchstart', handleButtonPress);
  });

  // Reset button
  resetButton.addEventListener('click', resetActions);

  function handleDirectionPress(e) {
    e.preventDefault();
    const direction = e.target.dataset.direction;
    if (direction && direction !== 'neutral') {
      addToHistory(`Direction: ${direction}`);
    }
  }

  function handleButtonPress(e) {
    e.preventDefault();
    const button = e.target.dataset.button;
    if (button) {
      addToHistory(`Button: ${button}`);
    }
  }

  function resetActions() {
    actionHistory = [];
    updateDisplay();
  }

  function addToHistory(action) {
    actionHistory.push(action);
    // Keep only last 20 actions
    if (actionHistory.length > 20) {
      actionHistory.shift();
    }
    updateDisplay();
  }

  function updateDisplay() {
    if (actionHistory.length === 0) {
      actionDisplay.innerHTML = 'No actions yet';
    } else {
      actionDisplay.innerHTML = actionHistory.map(action => `<div>${action}</div>`).join('');
    }
  }

  // Initialize display
  updateDisplay();
});
