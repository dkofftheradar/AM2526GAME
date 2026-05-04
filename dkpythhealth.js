let maxHealth = 0;
let currentHealth = 0;
let isAlive = true;

function takeDamage(amount) {
    currentHealth = currentHealth - amount;
    if (currentHealth <= 0) {
        currentHealth = 0;
        isAlive = false;
        console.log("Boxi has died!");
    }
}

function heal(amount) {
    currentHealth = currentHealth + amount;
    if (currentHealth > maxHealth) {
        currentHealth = maxHealth;
    }
}

function getHealthStatus() {
    return {
        current: currentHealth,
        max: maxHealth,
        percentage: (currentHealth / maxHealth) * 100,
        alive: isAlive
    };
}