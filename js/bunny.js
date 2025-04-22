document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('game-area');
    const bunny = document.getElementById('bunny');
    const message = document.getElementById('message');

    // Check if elements exist
    if (!gameArea || !bunny || !message) {
        console.error("Game elements not found!");
        return;
    }

    // Game state
    let carrotX = window.innerWidth / 2;
    let carrotY = window.innerHeight / 2;
    let bunnyX = bunny.offsetLeft + bunny.offsetWidth / 2;
    let bunnyY = bunny.offsetTop + bunny.offsetHeight / 2;
    let gameOver = false;
    let gameLoopInterval = null;

    // --- Configuration ---
    const bunnySpeed = 2.5; // Adjust for difficulty (pixels per frame)
    const collisionDistance = 30; // How close the bunny needs to be to catch (pixels)
    const updateRate = 16; // Roughly 60fps (1000ms / 60fps ≈ 16.67ms)

    // Track carrot (cursor) position
    gameArea.addEventListener('mousemove', (event) => {
        if (!gameOver) {
            carrotX = event.clientX;
            carrotY = event.clientY;
        }
    });

    // Prevent cursor from leaving the window easily (optional)
    // document.addEventListener('mouseleave', () => {
    //     // You could pause the game or handle this differently
    //     // For simplicity, we'll let the bunny keep moving to the last known position
    // });

    // Game loop function
    function gameLoop() {
        if (gameOver) return;

        // --- Bunny Movement ---
        // Get current bunny center position
        // Use offsetLeft/Top which are relative to the offsetParent (gameArea)
        bunnyX = bunny.offsetLeft + bunny.offsetWidth / 2;
        bunnyY = bunny.offsetTop + bunny.offsetHeight / 2;

        // Calculate direction towards carrot
        let dx = carrotX - bunnyX;
        let dy = carrotY - bunnyY;

        // Calculate distance
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Check for collision
        if (distance < collisionDistance) {
            endGame();
            return; // Stop processing this frame
        }

        // Normalize direction vector (make its length 1)
        // Add a small epsilon to prevent division by zero if distance is exactly 0
        const normalizationFactor = distance + 0.001;
        let moveX = (dx / normalizationFactor) * bunnySpeed;
        let moveY = (dy / normalizationFactor) * bunnySpeed;

        // Calculate new bunny top-left position
        let newBunnyLeft = bunny.offsetLeft + moveX;
        let newBunnyTop = bunny.offsetTop + moveY;

        // --- Boundary Collision (Optional but recommended) ---
        const gameAreaRect = gameArea.getBoundingClientRect();
        newBunnyLeft = Math.max(0, Math.min(newBunnyLeft, gameAreaRect.width - bunny.offsetWidth));
        newBunnyTop = Math.max(0, Math.min(newBunnyTop, gameAreaRect.height - bunny.offsetHeight));
        // --- End Boundary Collision ---

        // Update bunny position using style.left/top for CSS transitions
        bunny.style.left = `${newBunnyLeft}px`;
        bunny.style.top = `${newBunnyTop}px`;
    }

    // Function to end the game
    function endGame() {
        gameOver = true;
        clearInterval(gameLoopInterval); // Stop the game loop
        message.classList.remove('hidden'); // Show game over message
        gameArea.style.cursor = 'auto'; // Restore default cursor
        // Optional: Add a delay before allowing restart or add a restart button
        console.log("Game Over!");
    }

    // Function to start the game
    function startGame() {
        gameOver = false;
        message.classList.add('hidden'); // Hide message
        gameArea.style.cursor = `url('carrot.png') 16 16, auto`; // Set carrot cursor

        // Reset bunny position (optional)
        const startX = gameArea.offsetWidth / 2 - bunny.offsetWidth / 2;
        const startY = gameArea.offsetHeight / 2 - bunny.offsetHeight / 2;
        bunny.style.left = `${startX}px`;
        bunny.style.top = `${startY}px`;
        bunnyX = startX + bunny.offsetWidth / 2;
        bunnyY = startY + bunny.offsetHeight / 2;


        // Clear any existing interval before starting a new one
        if (gameLoopInterval) {
            clearInterval(gameLoopInterval);
        }
        // Start the game loop
        gameLoopInterval = setInterval(gameLoop, updateRate); // Update approx 60 times per second
    }

    // --- Start the game ---
    startGame(); // Initial start when the script loads

    // Optional: Add a way to restart the game, e.g., clicking the message
    message.addEventListener('click', startGame);

}); // End DOMContentLoaded