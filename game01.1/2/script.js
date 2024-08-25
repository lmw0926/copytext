window.onload = function() {
    const gameArea = document.getElementById('gameArea');
    const coops = document.querySelectorAll('.chickenCoop');
    const scoreSpan = document.getElementById('score');
    const endMessage = document.getElementById('endMessage');
    let score = 0, filledCoops = 0;
    const originalSize = 80;
    const maxX = gameArea.clientWidth - originalSize, maxY = gameArea.clientHeight - originalSize;

    const getRandomPosition = () => ({ left: Math.random() * maxX, top: Math.random() * maxY });

    function createChicken() {
        const chicken = document.createElement('img');
        chicken.src = '../chicken.png';
        chicken.className = 'chicken';
        chicken.dataset.clicks = 0;
        chicken.dataset.size = 1;
        chicken.dataset.gender = '';
        const position = getRandomPosition();
        Object.assign(chicken.style, { width: `${originalSize}px`, height: `${originalSize}px`, left: `${position.left}px`, top: `${position.top}px`, position: 'absolute', zIndex: '1' });
        gameArea.appendChild(chicken);

        chicken.addEventListener('mousedown', startDragging);
        chicken.ondragstart = () => false;
    }

    function startDragging(e) {
        e.preventDefault();
        const chicken = e.target;
        const shiftX = e.clientX - chicken.getBoundingClientRect().left;
        const shiftY = e.clientY - chicken.getBoundingClientRect().top;

        const moveAt = (pageX, pageY) => {
            chicken.style.left = `${pageX - shiftX}px`;
            chicken.style.top = `${pageY - shiftY}px`;
        };

        const onMouseMove = (e) => {
            moveAt(e.pageX, e.pageY);
            if (filledCoops === coops.length) checkRoosterHenCollision(chicken);
        };

        document.addEventListener('mousemove', onMouseMove);

        chicken.onmouseup = () => {
            document.removeEventListener('mousemove', onMouseMove);
            chicken.onmouseup = null;
            if (filledCoops < coops.length) checkIfInCoop(chicken);
        };
    }

    function checkIfInCoop(chicken) {
        coops.forEach(coop => {
            const coopRect = coop.getBoundingClientRect(), chickenRect = chicken.getBoundingClientRect();
            const distanceX = Math.abs((chickenRect.left + chickenRect.width / 2) - (coopRect.left + coopRect.width / 2));
            const distanceY = Math.abs((chickenRect.top + chickenRect.height / 2) - (coopRect.top + coopRect.height / 2));

            if (distanceX < coopRect.width * 0.25 && distanceY < coopRect.height * 0.25 && !coop.dataset.filled) {
                scoreSpan.textContent = ++score;
                Object.assign(chicken.style, { left: `${coopRect.left + coopRect.width / 2 - chickenRect.width / 2}px`, top: `${coopRect.top + coopRect.height / 2 - chickenRect.height / 2}px`, pointerEvents: 'none' });
                coop.dataset.filled = true;
                if (++filledCoops === coops.length) endGame();
            }
        });
    }

    function checkRoosterHenCollision(chicken) {
        const chickenRect = chicken.getBoundingClientRect();
        document.querySelectorAll('.chicken').forEach(otherChicken => {
            if (chicken !== otherChicken && chicken.dataset.gender && otherChicken.dataset.gender) {
                const otherRect = otherChicken.getBoundingClientRect();
                if (chickenRect.left < otherRect.right && chickenRect.right > otherRect.left && chickenRect.top < otherRect.bottom && chickenRect.bottom > otherRect.top) {
                    chicken.dataset.gender !== otherChicken.dataset.gender ? createChick(chickenRect) : repelChickens(chicken, otherChicken);
                }
            }
        });
    }

    function repelChickens(chicken1, chicken2) {
        const distance = 100;
        const move = (chicken, xShift, yShift) => {
            chicken.style.left = `${Math.max(Math.min(parseFloat(chicken.style.left) + xShift, maxX), 0)}px`;
            chicken.style.top = `${Math.max(Math.min(parseFloat(chicken.style.top) + yShift, maxY), 0)}px`;
        };

        const [rect1, rect2] = [chicken1, chicken2].map(chicken => chicken.getBoundingClientRect());
        move(chicken1, rect1.left < rect2.left ? -distance : distance, rect1.top < rect2.top ? -distance : distance);
        move(chicken2, rect1.left < rect2.left ? distance : -distance, rect1.top < rect2.top ? distance : -distance);
    }

    function createChick(position) {
        const chick = document.createElement('img');
        chick.src = '../chicken.png';
        Object.assign(chick.style, { width: '40px', height: '40px', position: 'absolute', zIndex: '0' });
        const safePosition = findSafePosition(position);
        chick.style.left = `${safePosition.left}px`;
        chick.style.top = `${safePosition.top}px`;
        gameArea.appendChild(chick);
        moveChick(chick);
    }

    function findSafePosition(initialPosition) {
        for (let attempts = 0; attempts < 100; attempts++) {
            const newPosition = getRandomPosition();
            const chickRect = { left: newPosition.left, top: newPosition.top, right: newPosition.left + 40, bottom: newPosition.top + 40 };
            const isSafe = [...document.querySelectorAll('.chicken')].every(chicken => {
                if (chicken.dataset.gender) {
                    const chickenRect = chicken.getBoundingClientRect();
                    return chickRect.right < chickenRect.left || chickRect.left > chickenRect.right || chickRect.bottom < chickenRect.top || chickRect.top > chickenRect.bottom;
                }
                return true;
            });
            if (isSafe) return newPosition;
        }
        return initialPosition;
    }

    const moveChick = (chick) => setInterval(() => {
        chick.style.left = `${Math.min(Math.max(parseFloat(chick.style.left) + (Math.random() - 0.5) * 20, 0), maxX)}px`;
        chick.style.top = `${Math.min(Math.max(parseFloat(chick.style.top) + (Math.random() - 0.5) * 20, 0), maxY)}px`;
    }, 100);

    function endGame() {
        endMessage.style.display = 'block';
        setTimeout(() => {
            endMessage.style.display = 'none';
            activateNextLevel();
        }, 2000);
    }

    function activateNextLevel() {
        document.querySelectorAll('.chicken').forEach(chicken => {
            chicken.style.pointerEvents = 'auto';
            chicken.removeEventListener('click', growChicken);
            chicken.removeEventListener('contextmenu', dragChicken);
            chicken.addEventListener('click', growChicken);
            chicken.addEventListener('contextmenu', dragChicken);
        });
    }

    function growChicken(e) {
        const chicken = e.target;
        if (chicken.dataset.gender) return;
        if (++chicken.dataset.clicks == 2) {
            const newSize = chicken.clientWidth * 1.3;
            Object.assign(chicken.style, { width: `${newSize}px`, height: `${newSize}px` });
            chicken.dataset.size = parseFloat(chicken.dataset.size) * 1.3;
            if (parseFloat(chicken.dataset.size) >= 2) {
                chicken.src = Math.random() > 0.5 ? '../rooster.png' : '../hen.png';
                chicken.dataset.gender = chicken.src.includes('rooster') ? 'rooster' : 'hen';
            }
            chicken.dataset.clicks = 0;
        }
    }

    function dragChicken(e) {
        e.preventDefault();
        const chicken = e.target;
        if (!chicken.dataset.gender) return;
        startDragging(e);
    }

    initGame();

    function initGame() {
        for (let i = 0; i < 5; i++) createChicken();
    }
};
