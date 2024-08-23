window.onload = function() {
    const gameArea = document.getElementById('gameArea');
    const scoreSpan = document.getElementById('score');
    const timeSpan = document.getElementById('time');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const finalScore = document.getElementById('finalScore');
    let score = 0;
    let timeLeft = 20; // 30 seconds countdown
    let chickenCount = 0;
    let gameOver = false; // Flag to indicate if the game is over

    const maxX = gameArea.clientWidth - 100; // Assuming chicken width is 100px
    const maxY = gameArea.clientHeight - 100; // Assuming chicken height is 100px

    function getRandomMovement() {
        const movement = Math.floor(Math.random() * 21) + 30; // Random value between 30 and 50
        return (Math.random() > 0.5 ? movement : -movement); // Random direction
    }

    function slideChickenContinuously(chicken) {
        setInterval(() => {
            if (gameOver) return; // Stop moving if the game is over

            const currentLeft = parseInt(chicken.style.left, 10);
            const currentTop = parseInt(chicken.style.top, 10);
            const newLeft = Math.min(Math.max(currentLeft + getRandomMovement(), 0), maxX);
            const newTop = Math.min(Math.max(currentTop + getRandomMovement(), 0), maxY);

            chicken.style.left = `${newLeft}px`;
            chicken.style.top = `${newTop}px`;
        }, 2000); // Move every 2 seconds to allow the smooth sliding effect
    }

    function createChicken() {
        if (gameOver) return; // Stop creating chickens if the game is over

        const chicken = document.createElement('img');
        chicken.src = 'chicken.png';
        chicken.className = 'chicken';
        chicken.style.left = `${Math.random() * maxX}px`;
        chicken.style.top = `${Math.random() * maxY}px`;
        gameArea.appendChild(chicken);
        chickenCount++;

        // Start the continuous sliding movement
        slideChickenContinuously(chicken);

        chicken.onclick = function() {
            if (gameOver) return; // Prevent interaction if the game is over

            score++;
            scoreSpan.textContent = score;

            // Add clicked effect
            chicken.classList.add('clicked');
            
            // Remove the chicken after a short delay
            setTimeout(() => {
                if (gameArea.contains(chicken)) {
                    gameArea.removeChild(chicken);
                    chickenCount--;
                    maintainChickenCount(); // Maintain chicken count after one is removed
                }
            }, 200); // Wait 300ms for the effect to play out
        };

     }

    function maintainChickenCount() {
        const targetChickenCount = Math.floor(Math.random() * 5) + 3; // Randomly choose between 3 and 7 chickens
        while (chickenCount < targetChickenCount && !gameOver) {
            createChicken();
        }
    }

    function startCountdown() {
        const countdownInterval = setInterval(() => {
            timeLeft--;
            timeSpan.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                endGame();
            }
        }, 1000); // Decrease time by 1 second intervals
    }

    function endGame() {
        gameOver = true; // Set game over flag to true

        // Show game over message
        finalScore.textContent = score;
        gameOverMessage.style.display = 'block';

        // Remove all chickens
        const chickens = document.querySelectorAll('.chicken');
        chickens.forEach(chicken => {
            gameArea.removeChild(chicken); // Remove all chickens
        });
    }

    maintainChickenCount(); // Initialize chickens on game load
    startCountdown(); // Start the countdown timer
};
