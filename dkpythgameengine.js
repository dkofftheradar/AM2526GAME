// Backend game state manager for AM2526GAME
// This module owns the state, scene data, navigation logic, win/loss checks, and restart/reset behavior.

const scenes = {
    start: {
        id: 'start',
        title: 'A Cold Awakening',
        text: 'You wake up in a quiet room. Brian is there, watching you carefully. The door in front of you looks old and heavy.',
        artHTML: '<div class="scene-art">🛏️ You are in a small, dimly lit room.</div>',
        options: [
            {
                id: 'open-door',
                text: 'Open the door and step outside.',
                nextScene: 'hallway',
                healthChange: 0,
                friendshipChange: 0,
                inventoryGain: [],
                flagsSet: { leftStartRoom: true },
            },
            {
                id: 'inspect-room',
                text: 'Inspect the room for useful items.',
                nextScene: 'start',
                healthChange: 0,
                friendshipChange: 0,
                inventoryGain: [{ name: 'Donut', quantity: 1 }],
                flagsSet: { foundDonut: true },
                once: true,
            },
        ],
    },
    hallway: {
        id: 'hallway',
        title: 'The Hallway',
        text: 'You are now in a narrow hallway. The air feels tense. A faint noise comes from down the corridor.',
        artHTML: '<div class="scene-art">🚪 A narrow hallway stretches ahead.</div>',
        options: [
            {
                id: 'move-forward',
                text: 'Move forward toward the noise.',
                nextScene: 'scary-room',
                healthChange: 0,
                friendshipChange: 0,
                inventoryGain: [],
                flagsSet: {},
            },
            {
                id: 'talk-to-brian',
                text: 'Talk to Brian before moving on.',
                nextScene: 'hallway',
                healthChange: 0,
                friendshipChange: 2,
                inventoryGain: [],
                flagsSet: { talkedToBrian: true },
                once: true,
            },
            {
                id: 'go-back',
                text: 'Go back to the start room.',
                nextScene: 'start',
                healthChange: 0,
                friendshipChange: 0,
                inventoryGain: [],
                flagsSet: {},
            },
        ],
    },
    'scary-room': {
        id: 'scary-room',
        title: 'A Scary Room',
        text: 'A shadow leaps at you from the darkness! You try to dodge, but the shock hurts.',
        artHTML: '<div class="scene-art">👻 Shadows move in the dark.</div>',
        options: [
            {
                id: 'fight-shadow',
                text: 'Fight the shadow.',
                nextScene: 'victory',
                healthChange: -8,
                friendshipChange: 0,
                inventoryGain: [],
                flagsSet: { foughtShadow: true },
            },
            {
                id: 'escape',
                text: 'Run back to the hallway.',
                nextScene: 'hallway',
                healthChange: -2,
                friendshipChange: 0,
                inventoryGain: [],
                flagsSet: {},
            },
        ],
    },
    victory: {
        id: 'victory',
        title: 'Victory!',
        text: 'You survived the encounter and found a safe path forward. Brian smiles as the danger passes.',
        artHTML: '<div class="scene-art">🏆 You have survived this encounter.</div>',
        options: [
            {
                id: 'restart-after-win',
                text: 'Restart the game from the beginning.',
                nextScene: 'start',
                healthChange: 0,
                friendshipChange: 0,
                inventoryGain: [],
                flagsSet: {},
            },
        ],
        endingType: 'win',
    },
    'game-over': {
        id: 'game-over',
        title: 'Game Over',
        text: 'You have fallen in battle. The story ends here unless you restart and try again.',
        artHTML: '<div class="scene-art">💀 Game over. Try again.</div>',
        options: [
            {
                id: 'restart-after-loss',
                text: 'Restart the game.',
                nextScene: 'start',
                healthChange: 0,
                friendshipChange: 0,
                inventoryGain: [],
                flagsSet: {},
            },
        ],
        endingType: 'loss',
    },
    fallback: {
        id: 'fallback',
        title: 'Unknown Path',
        text: 'This part of the game has not been written yet. Please choose another path or restart.',
        artHTML: '<div class="scene-art">❓ This scene is still under construction.</div>',
        options: [
            {
                id: 'fallback-restart',
                text: 'Restart the game.',
                nextScene: 'start',
                healthChange: 0,
                friendshipChange: 0,
                inventoryGain: [],
                flagsSet: {},
            },
        ],
    },
};

const engineState = {
    currentSceneId: 'start',
    health: 0,
    maxHealth: 0,
    isAlive: true,
    friendship: 0,
    inventory: [],
    flags: {},
    visitedScenes: [],
};

const DEFAULT_STATE = JSON.parse(JSON.stringify(engineState));

function getSceneById(sceneId) {
    return scenes[sceneId] || scenes.fallback;
}

function getCurrentScene() {
    return getSceneById(engineState.currentSceneId);
}

function getCurrentSceneChoices() {
    return getCurrentScene().options.filter(isOptionAvailable).map(option => ({
        id: option.id,
        text: option.text,
        nextScene: option.nextScene,
    }));
}

function isOptionAvailable(option) {
    if (option.requiredFlags) {
        return Object.keys(option.requiredFlags).every(key => engineState.flags[key] === option.requiredFlags[key]);
    }
    if (option.once && engineState.flags[`usedOption:${option.id}`]) {
        return false;
    }
    return true;
}

function getState() {
    return {
        currentSceneId: engineState.currentSceneId,
        health: engineState.health,
        maxHealth: engineState.maxHealth,
        isAlive: engineState.isAlive,
        friendship: engineState.friendship,
        inventory: engineState.inventory.map(item => ({ ...item })),
        flags: { ...engineState.flags },
        visitedScenes: [...engineState.visitedScenes],
        currentScene: getCurrentScene(),
        choices: getCurrentSceneChoices(),
        isGameOver: checkGameOver(),
    };
}

function restartGame() {
    Object.keys(engineState).forEach(key => {
        if (DEFAULT_STATE.hasOwnProperty(key)) {
            engineState[key] = JSON.parse(JSON.stringify(DEFAULT_STATE[key]));
        }
    });
    engineState.currentSceneId = 'start';
    engineState.visitedScenes = ['start'];
    return getState();
}

function setScene(sceneId) {
    const resolvedScene = getSceneById(sceneId);
    engineState.currentSceneId = resolvedScene.id;
    engineState.visitedScenes.push(resolvedScene.id);
    return resolvedScene;
}

function checkGameOver() {
    if (!engineState.isAlive) {
        return true;
    }
    const currentScene = getCurrentScene();
    return currentScene.endingType === 'loss';
}

function applyOptionEffects(option) {
    if (typeof option.healthChange === 'number') {
        changeHealth(option.healthChange);
    }
    if (typeof option.friendshipChange === 'number') {
        changeFriendship(option.friendshipChange);
    }
    if (Array.isArray(option.inventoryGain)) {
        option.inventoryGain.forEach(item => addInventoryItem(item.name, item.quantity || 1));
    }
    if (Array.isArray(option.inventoryLose)) {
        option.inventoryLose.forEach(item => removeInventoryItem(item.name, item.quantity || 1));
    }
    if (option.flagsSet) {
        Object.keys(option.flagsSet).forEach(key => {
            engineState.flags[key] = option.flagsSet[key];
        });
    }
    if (option.once) {
        engineState.flags[`usedOption:${option.id}`] = true;
    }
}

function changeHealth(amount) {
    engineState.health += amount;
    if (engineState.health > engineState.maxHealth) {
        engineState.health = engineState.maxHealth;
    }
    if (engineState.health <= 0) {
        engineState.health = 0;
        engineState.isAlive = false;
        setScene('game-over');
    }
}

function changeFriendship(amount) {
    engineState.friendship += amount;
    if (engineState.friendship > 10) engineState.friendship = 10;
    if (engineState.friendship < 1) engineState.friendship = 1;
}

function addInventoryItem(name, quantity = 1) {
    const item = engineState.inventory.find(entry => entry.name === name);
    if (item) {
        item.quantity += quantity;
    } else {
        engineState.inventory.push({ name, quantity });
    }
}

function removeInventoryItem(name, quantity = 1) {
    const itemIndex = engineState.inventory.findIndex(entry => entry.name === name);
    if (itemIndex === -1) {
        return false;
    }
    const item = engineState.inventory[itemIndex];
    if (item.quantity <= quantity) {
        engineState.inventory.splice(itemIndex, 1);
    } else {
        item.quantity -= quantity;
    }
    return true;
}

function chooseOption(optionId) {
    const scene = getCurrentScene();
    const option = scene.options.find(o => o.id === optionId && isOptionAvailable(o));
    if (!option) {
        return {
            error: 'OPTION_NOT_AVAILABLE',
            message: 'That choice is not available in the current scene.',
            state: getState(),
        };
    }
    applyOptionEffects(option);
    if (option.nextScene) {
        setScene(option.nextScene);
    }
    return getState();
}

function getAllSceneIds() {
    return Object.keys(scenes);
}

function validateAllSceneIds() {
    return getAllSceneIds().every(sceneId => {
        const scene = scenes[sceneId];
        return Array.isArray(scene.options) && scene.options.every(option => typeof option.nextScene === 'string');
    });
}

function getFallbackScene() {
    return scenes.fallback;
}

function initializeEngine() {
    restartGame();
    return getState();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getState,
        chooseOption,
        restartGame,
        getCurrentScene,
        getCurrentSceneChoices,
        getSceneById,
        getAllSceneIds,
        validateAllSceneIds,
        getFallbackScene,
        initializeEngine,
    };
}
