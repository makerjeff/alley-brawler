document.addEventListener('DOMContentLoaded', function() {
  const actionDisplay = document.getElementById('action-display');
  const resetButton = document.getElementById('reset-button');
  const joystick = document.getElementById('joystick');
  const joystickIndicator = document.getElementById('joystick-indicator');
  let actionHistory = [];
  let currentInterval = null;
  let currentDirection = null;
  let isJoystickActive = false;

  // Joystick
  joystick.addEventListener('mousedown', handleJoystickStart);
  joystick.addEventListener('touchstart', handleJoystickStart);
  joystick.addEventListener('mousemove', handleJoystickMove);
  joystick.addEventListener('touchmove', handleJoystickMove);
  joystick.addEventListener('mouseup', handleJoystickEnd);
  joystick.addEventListener('touchend', handleJoystickEnd);
  joystick.addEventListener('mouseleave', handleJoystickEnd);

  // Buttons
  const buttons = document.querySelectorAll('button[data-button]');
  buttons.forEach(btn => {
    btn.addEventListener('mousedown', handleButtonStart);
    btn.addEventListener('touchstart', handleButtonStart);
    btn.addEventListener('mouseup', handleButtonEnd);
    btn.addEventListener('touchend', handleButtonEnd);
    btn.addEventListener('mouseleave', handleButtonEnd);
  });

  // Reset button
  resetButton.addEventListener('click', resetActions);

  function handleJoystickStart(e) {
    e.preventDefault();
    isJoystickActive = true;
    handleJoystickMove(e);
  }

  function handleJoystickMove(e) {
    if (!isJoystickActive) return;
    e.preventDefault();
    const rect = joystick.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    let dx = clientX - centerX;
    let dy = clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = rect.width / 2 - 15; // Leave space for indicator

    if (distance > maxDistance) {
      dx = (dx / distance) * maxDistance;
      dy = (dy / distance) * maxDistance;
    }

    // Move indicator
    joystickIndicator.style.left = `${50 + (dx / (rect.width / 2)) * 50}%`;
    joystickIndicator.style.top = `${50 + (dy / (rect.height / 2)) * 50}%`;

    // Calculate direction
    let direction = null;
    if (distance > 20) { // Threshold for neutral
      let angle = Math.atan2(dy, dx) * 180 / Math.PI - 180; // Rotate 180 degrees
      angle = (angle + 360) % 360;
      if (angle >= 337.5 || angle < 22.5) direction = 'back';
      else if (angle >= 22.5 && angle < 67.5) direction = 'up-back';
      else if (angle >= 67.5 && angle < 112.5) direction = 'up';
      else if (angle >= 112.5 && angle < 157.5) direction = 'up-forward';
      else if (angle >= 157.5 && angle < 202.5) direction = 'forward';
      else if (angle >= 202.5 && angle < 247.5) direction = 'down-forward';
      else if (angle >= 247.5 && angle < 292.5) direction = 'down';
      else if (angle >= 292.5 && angle < 337.5) direction = 'down-back';
    }

    if (direction !== currentDirection) {
      currentDirection = direction;
      if (direction) {
        addToHistory(`Direction: ${direction}`);
      }
    }
  }

  function handleJoystickEnd(e) {
    e.preventDefault();
    isJoystickActive = false;
    currentDirection = null;
    stopContinuousInput();
    // Reset indicator
    joystickIndicator.style.left = '50%';
    joystickIndicator.style.top = '50%';
  }

  function handleButtonStart(e) {
    e.preventDefault();
    const button = e.target.dataset.button;
    if (button) {
      startContinuousInput(`Button: ${button}`);
    }
  }

  function handleButtonEnd(e) {
    e.preventDefault();
    stopContinuousInput();
  }

  function startContinuousInput(action) {
    stopContinuousInput(); // Clear any existing
    addToHistory(action);
    currentInterval = setInterval(() => {
      addToHistory(action);
    }, 200); // Register every 200ms
  }

  function stopContinuousInput() {
    if (currentInterval) {
      clearInterval(currentInterval);
      currentInterval = null;
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
