
let happyImg = "image/happy.png";
let organizingImg = "image/organizing.png";
let sadImg = "image/sad.png";


let currentSequence = []; 
let currentIndex = 0;     

// DOM elements
let mainHeader = document.getElementById("main-header");
let selectionScreen = document.getElementById("selection-screen");
let storyScreen = document.getElementById("story-screen");

let seq1ChoiceBtn = document.getElementById("seq1-choice-btn");
let seq2ChoiceBtn = document.getElementById("seq2-choice-btn");

let stageTitle = document.getElementById("stage-title");
let storyImage = document.getElementById("story-image");
let dialogueBox = document.getElementById("dialogue-box");

let nextStepBtn = document.getElementById("next-step-btn");
let backToMenuBtn = document.getElementById("back-to-menu-btn");

// Narrative Step 
let narratives = {
    seq1: [
        { stage: "Beginning (1/3)", image: happyImg, dialogue: "\"I bought a beautiful potted flower. Looking forward to seeing it bloom!!\"" },
        { stage: "Middle (2/3)", image: organizingImg, dialogue: "\"Wait... Taking care of plants are harder than I imagined.\"" },
        { stage: "End (3/3)", image: sadImg, dialogue: "\"OH NO!!!\"" }
    ],
    seq2: [
        { stage: "Beginning (1/3)", image: sadImg, dialogue: "\"OMG my flowers are dying!!\"" },
        { stage: "Middle (2/3)", image: organizingImg, dialogue: "\"Water! More water! And also sunlight!\"" },
        { stage: "End (3/3)", image: happyImg, dialogue: "\"Finally! Yeah!\"" }
    ]
};

// Current Story Stage & DOM
function updateStoryDisplay() {
    let currentStepData = currentSequence[currentIndex];

    stageTitle.innerHTML = currentStepData.stage;
    storyImage.src = currentStepData.image;
    dialogueBox.innerHTML = currentStepData.dialogue;

    if (currentIndex === currentSequence.length - 1) {
        nextStepBtn.innerHTML = "Restart Story ↺";
    } else {
        nextStepBtn.innerHTML = "Next Step →";
    }
}

// Start Narrative Sequence
function startNarrative(sequenceKey) {
    currentSequence = narratives[sequenceKey];
    currentIndex = 0; 

    mainHeader.classList.add("hidden");
    selectionScreen.classList.add("hidden");
    storyScreen.classList.remove("hidden");

    updateStoryDisplay();
}

// Next Step
function handleNextStep() {
    currentIndex++;
    
    if (currentIndex >= currentSequence.length) {
        returnToMenu();
        return;
    }

    updateStoryDisplay();
}

// Return to Page
function returnToMenu() {
    storyScreen.classList.add("hidden");
    selectionScreen.classList.remove("hidden");
    mainHeader.classList.remove("hidden"); 
}

// Event Listeners
seq1ChoiceBtn.addEventListener("click", function() {
    startNarrative("seq1");
});

seq2ChoiceBtn.addEventListener("click", function() {
    startNarrative("seq2");
});

nextStepBtn.addEventListener("click", handleNextStep);
backToMenuBtn.addEventListener("click", returnToMenu);