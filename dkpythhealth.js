// Player health tracking variables
let maxHealth = 100; // Maximum health the player can have
let currentHealth = 100; // Current health of the player
let isAlive = true; // Boolean to check if the player is alive

// Function to take damage
function takeDamage(amount) {
    currentHealth = currentHealth - amount;
    if (currentHealth <= 0) {
        currentHealth = 0;
        isAlive = false;
        console.log("Boxi has died!");
    }
}

// Function to heal
function heal(amount) {
    currentHealth = currentHealth + amount;
    if (currentHealth > maxHealth) {
        currentHealth = maxHealth;
    }
}

// Function to check health status
function getHealthStatus() {
    return {
        current: currentHealth,
        max: maxHealth,
        percentage: (currentHealth / maxHealth) * 100,
        alive: isAlive
    };
}