const boxiState = {
    health: {
        current: 0,
        max: 0,
        isAlive: true,
    },
    inventory: [],
    location: 'start',
    brianFriendship: 0,
    flags: {},
};

function resetBoxiState() {
    boxiState.health.current = 0;
    boxiState.health.max = 0;
    boxiState.health.isAlive = true;
    boxiState.inventory = [];
    boxiState.location = 'start';
    boxiState.brianFriendship = 0;
    boxiState.flags = {};
}

function takeDamage(amount) {
    boxiState.health.current -= amount;
    if (boxiState.health.current <= 0) {
        boxiState.health.current = 0;
        boxiState.health.isAlive = false;
    }
}

function heal(amount) {
    if (!boxiState.health.isAlive) {
        return;
    }
    boxiState.health.current += amount;
    if (boxiState.health.current > boxiState.health.max) {
        boxiState.health.current = boxiState.health.max;
    }
}

function setLocation(newLocation) {
    boxiState.location = newLocation;
}

function addItemToInventory(itemName, quantity = 1) {
    const item = boxiState.inventory.find(i => i.name === itemName);
    if (item) {
        item.quantity += quantity;
    } else {
        boxiState.inventory.push({ name: itemName, quantity });
    }
}

function removeItemFromInventory(itemName, quantity = 1) {
    const itemIndex = boxiState.inventory.findIndex(i => i.name === itemName);
    if (itemIndex === -1) return false;
    const item = boxiState.inventory[itemIndex];
    if (item.quantity <= quantity) {
        boxiState.inventory.splice(itemIndex, 1);
    } else {
        item.quantity -= quantity;
    }
    return true;
}

function hasInventoryItem(itemName, quantity = 1) {
    const item = boxiState.inventory.find(i => i.name === itemName);
    return item && item.quantity >= quantity;
}

function changeBrianFriendship(amount) {
    boxiState.brianFriendship += amount;
    if (boxiState.brianFriendship > 10) {
        boxiState.brianFriendship = 10;
    }
    if (boxiState.brianFriendship < 1) {
        boxiState.brianFriendship = 1;
    }
}

function setFlag(flagName, value) {
    boxiState.flags[flagName] = value;
}

function getFlag(flagName) {
    return boxiState.flags[flagName];
}

function getBoxiState() {
    return boxiState;
}

module.exports = {
    boxiState,
    resetBoxiState,
    takeDamage,
    heal,
    setLocation,
    addItemToInventory,
    removeItemFromInventory,
    hasInventoryItem,
    changeBrianFriendship,
    setFlag,
    getFlag,
    getBoxiState,
};
