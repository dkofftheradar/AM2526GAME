// Brian's friendship system
let brianFriendship = 0; 
const MAX_FRIENDSHIP = 0;
const MIN_FRIENDSHIP = 0;
const BETRAY_THRESHOLD = 0; 
const ALLY_THRESHOLD = 0;  

// Function to increase Brian's friendship level
function increaseFriendship(amount) {
    brianFriendship += amount;
    if (brianFriendship > MAX_FRIENDSHIP) {
        brianFriendship = MAX_FRIENDSHIP;
    }
    console.log(`Brian's friendship increased to ${brianFriendship}.`);
}

// Function to decrease Brian's friendship level
function decreaseFriendship(amount) {
    brianFriendship -= amount;
    if (brianFriendship < MIN_FRIENDSHIP) {
        brianFriendship = MIN_FRIENDSHIP;
    }
    console.log(`Brian's friendship decreased to ${brianFriendship}.`);
}

// Function to get current friendship level
function getFriendshipLevel() {
    return brianFriendship;
}

function resetFriendship() {
    brianFriendship = 0;
}

// Function to check if Brian will betray the player (low friendship)
function willBetray() {
    return brianFriendship < BETRAY_THRESHOLD;
}

// Function to check if Brian will fight by the player's side (high friendship)
function isAlly() {
    return brianFriendship > ALLY_THRESHOLD;
}

// Function to get Brian's current status
function getBrianStatus() {
    if (isAlly()) {
        return "Brian is your loyal ally and will fight by your side!";
    } else if (willBetray()) {
        return "Brian betrayed you!";
    }
    return "Brian is neutral towards you.";
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        brianFriendship,
        increaseFriendship,
        decreaseFriendship,
        getFriendshipLevel,
        resetFriendship,
        willBetray,
        isAlly,
        getBrianStatus,
    };
}
