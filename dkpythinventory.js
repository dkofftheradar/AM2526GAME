// Player inventory system
let inventory = []; // Array to hold inventory items

// Item effect definitions
const itemEffects = {
    Donut: { type: 'heal', amount: 15 },
    Lasagna: { type: 'heal', amount: 35 } // most of the variables are random for now until i get the exact amounts for each item, but the donut will heal 15 health and the lasagna will heal 35 health
};
const keyItemName = 'Key';

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

    let effect = itemEffects[itemName];
    if (effect && effect.type === 'heal') {
        // Use heal function from health system
        heal(effect.amount);
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

