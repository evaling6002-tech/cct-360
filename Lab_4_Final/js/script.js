
// Store Current Power Level
let powerLevel = 0;

// HTML
let boilBtn = document.getElementById("boil-btn");
let showerBtn = document.getElementById("shower-btn");
let heatBtn = document.getElementById("heat-btn");
let levelDisplay = document.getElementById("level-display");
let statusPanel = document.getElementById("status-panel");
let statusTitle = document.getElementById("status-title");
let statusDesc = document.getElementById("status-desc");

// Power State = Conditional logic
function updatePowerState() {
    levelDisplay.innerHTML = powerLevel;

    if (powerLevel === 1) {
        statusPanel.className = "state-one";
        statusTitle.innerHTML = "State 1: Boiling Water (Lower Power)";
        statusDesc.innerHTML = "The electric kettle is drawing minimal power. Safe eco-mode active.";
    } 
    else if (powerLevel === 2) {
        statusPanel.className = "state-two";
        statusTitle.innerHTML = "State 2: Taking a Shower (Moderate Power)";
        statusDesc.innerHTML = "The water heater is running at a moderate level. Stable flow.";
    } 
    else if (powerLevel === 3) {
        statusPanel.className = "state-three";
        statusTitle.innerHTML = "State 3: HEATING SYSTEM OVERLOAD!";
        statusDesc.innerHTML = "Maximum power draw! The central heating system is straining the electrical grid!";
    } 
    else {
        statusPanel.className = "state-zero";
        statusTitle.innerHTML = "System Idle";
        statusDesc.innerHTML = "Select an action above to start drawing power.";
    }
}

// Specific user actions
boilBtn.addEventListener("click", function () {
    powerLevel = 1; // Sets state variable to 1
    updatePowerState();
});

showerBtn.addEventListener("click", function () {
    powerLevel = 2; // Sets state variable to 2
    updatePowerState();
});

heatBtn.addEventListener("click", function () {
    powerLevel = 3; // Sets state variable to 3
    updatePowerState();
});