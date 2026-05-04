// Brian's friendship system
let config = {};

try {
    config = require('./gameConfig.json');
} catch (error) {
    config = {
        friendshipThresholds: {
            MAX_FRIENDSHIP: 10,
            MIN_FRIENDSHIP: 0,
            BETRAY_THRESHOLD: 3,
            ALLY_THRESHOLD: 8
        },
        playerStats: { startingFriendship: 0 }
    };
}

let brianFriendship = config.playerStats?.startingFriendship || 0;
const MAX_FRIENDSHIP = config.friendshipThresholds?.MAX_FRIENDSHIP || 10;
const MIN_FRIENDSHIP = config.friendshipThresholds?.MIN_FRIENDSHIP || 0;
const BETRAY_THRESHOLD = config.friendshipThresholds?.BETRAY_THRESHOLD || 3;
const ALLY_THRESHOLD = config.friendshipThresholds?.ALLY_THRESHOLD || 8;

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

function getFriendshipLevel() {
    return brianFriendship;
}

function resetFriendship() {
    brianFriendship = 0;
}

function willBetray() {
    return brianFriendship < BETRAY_THRESHOLD;
}

function isAlly() {
    return brianFriendship > ALLY_THRESHOLD;
}

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
