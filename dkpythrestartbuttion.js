let engineModule;
let boxiModule;
let inventoryModule;
let friendshipModule;

try {
    if (typeof require === 'function') {
        engineModule = require('./dkpythgameengine');
        boxiModule = require('./dkpythboxi');
        inventoryModule = require('./dkpythinventory');
        friendshipModule = require('./dkpythfriendshipbar');
    }
} catch (error) {
    
}

function restartGame() {
    if (engineModule && typeof engineModule.restartGame === 'function') {
        return engineModule.restartGame();
    }

    if (boxiModule && typeof boxiModule.resetBoxiState === 'function') {
        boxiModule.resetBoxiState();
    } else if (typeof resetBoxiState === 'function') {
        resetBoxiState();
    }

    if (inventoryModule && typeof inventoryModule.resetInventory === 'function') {
        inventoryModule.resetInventory();
    } else if (typeof resetInventory === 'function') {
        resetInventory();
    }

    if (friendshipModule && typeof friendshipModule.resetFriendship === 'function') {
        friendshipModule.resetFriendship();
    } else if (typeof resetFriendship === 'function') {
        resetFriendship();
    }

    return {
        status: 'reset',
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        restartGame,
    };
}
