// Player inventory system
let inventory = []; // Array to hold inventory items

// Item effect definitions
const itemEffects = {
    Donut: 0,
    Lasagna: 0 
};
const keyItemName = 'Key';

// Function to check if player has an item
function hasItem(itemName, quantity = 1) {
    let item = inventory.find(i => i.name === itemName);
    return item && item.quantity >= quantity;
}

// Function to add an item to inventory
function addItem(itemName) {
    
    // Check if item already exists
    let existingItem = inventory.find(item => item.name === itemName);
    if (existingItem) {
        existingItem.quantity = existingItem.quantity + 1;
    } else {
        inventory.push({ name: itemName, quantity: 1 });
    }

    return true;
}

// Function to use an item
function useItem(itemName) {
    if (!hasItem(itemName, 1)) {
        return false;
    }

    if (itemEffects[itemName]) {
        // Use heal function from health system
        heal(itemEffects[itemName]);
        // Remove one item
        let itemIndex = inventory.findIndex(item => item.name === itemName);
        if (inventory[itemIndex].quantity > 1) {
            inventory[itemIndex].quantity = inventory[itemIndex].quantity - 1;
        } else {
            inventory.splice(itemIndex, 1);
        }
        return true;
    }

    if (itemName === keyItemName) {
        unlockThirdPath();
        return true;
    }

    return false;
}

// Function to consume a key and unlock the third path
function unlockThirdPath() {
    // Remove one key
    let itemIndex = inventory.findIndex(item => item.name === keyItemName);
    if (inventory[itemIndex].quantity > 1) {
        inventory[itemIndex].quantity = inventory[itemIndex].quantity - 1;
    } else {
        inventory.splice(itemIndex, 1);
    }
    return true;
}

// Function to get inventory list
function getInventory() {
    return inventory.slice(); // Return a copy
}

function resetInventory() {
    inventory = [];
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        inventory,
        hasItem,
        addItem,
        useItem,
        getInventory,
        resetInventory,
    };
}

