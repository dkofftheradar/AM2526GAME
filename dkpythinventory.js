let inventory = [];

const itemEffects = {
    Donut: 0,
    Lasagna: 0
};
const keyItemName = 'Key';

function hasItem(itemName, quantity = 1) {
    let item = inventory.find(i => i.name === itemName);
    return item && item.quantity >= quantity;
}

function addItem(itemName) {
    let existingItem = inventory.find(item => item.name === itemName);
    if (existingItem) {
        existingItem.quantity = existingItem.quantity + 1;
    } else {
        inventory.push({ name: itemName, quantity: 1 });
    }

    return true;
}

function useItem(itemName) {
    if (!hasItem(itemName, 1)) {
        return false;
    }

    if (itemEffects[itemName]) {
        heal(itemEffects[itemName]);
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

function unlockThirdPath() {
    let itemIndex = inventory.findIndex(item => item.name === keyItemName);
    if (inventory[itemIndex].quantity > 1) {
        inventory[itemIndex].quantity = inventory[itemIndex].quantity - 1;
    } else {
        inventory.splice(itemIndex, 1);
    }
    return true;
}

function getInventory() {
    return inventory.slice();
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

