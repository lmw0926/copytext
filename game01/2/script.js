window.onload = function() {
    const gameArea = document.getElementById('gameArea');
    const coops = document.querySelectorAll('.chickenCoop');
    const scoreSpan = document.getElementById('score');
    const endMessage = document.getElementById('endMessage');
    let score = 0;
    let filledCoops = 0; // 记录已经被填满的鸡舍数量
    const originalSize = 80; // 小鸡的初始宽度和高度为80px

    const maxX = gameArea.clientWidth - originalSize;
    const maxY = gameArea.clientHeight - originalSize;

    function getRandomPosition() {
        return {
            left: Math.random() * maxX,
            top: Math.random() * maxY
        };
    }

    function createChicken() {
        const chicken = document.createElement('img');
        chicken.src = '../chicken.png'; // 初始小鸡图片
        chicken.className = 'chicken';
        chicken.dataset.clicks = 0; // 初始化点击次数
        chicken.dataset.size = 1; // 初始化大小比例
        chicken.style.width = originalSize + 'px';
        chicken.style.height = originalSize + 'px';
        const position = getRandomPosition();
        chicken.style.left = `${position.left}px`;
        chicken.style.top = `${position.top}px`;
        gameArea.appendChild(chicken);

        chicken.addEventListener('mousedown', function(e) {
            e.preventDefault();

            let shiftX = e.clientX - chicken.getBoundingClientRect().left;
            let shiftY = e.clientY - chicken.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                chicken.style.left = pageX - shiftX + 'px';
                chicken.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(e) {
                moveAt(e.pageX, e.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            chicken.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                chicken.onmouseup = null;
                checkIfInCoop(chicken);
            };
        });

        chicken.ondragstart = function() {
            return false; // 阻止默认的拖拽行为
        };
    }

    function checkIfInCoop(chicken) {
        coops.forEach(coop => {
            const coopRect = coop.getBoundingClientRect();
            const chickenRect = chicken.getBoundingClientRect();

            const coopCenterX = coopRect.left + coopRect.width / 2;
            const coopCenterY = coopRect.top + coopRect.height / 2;

            const distanceX = Math.abs((chickenRect.left + chickenRect.width / 2) - coopCenterX);
            const distanceY = Math.abs((chickenRect.top + chickenRect.height / 2) - coopCenterY);

            const inCenterRangeX = distanceX < coopRect.width * 0.25; // 中央50%范围的X方向
            const inCenterRangeY = distanceY < coopRect.height * 0.25; // 中央50%范围的Y方向

            if (inCenterRangeX && inCenterRangeY && !coop.dataset.filled) {
                score++;
                scoreSpan.textContent = score;

                // 将小鸡移到鸡舍正中间
                chicken.style.left = `${coopCenterX - chickenRect.width / 2}px`;
                chicken.style.top = `${coopCenterY - chickenRect.height / 2}px`;

                // 禁止小鸡再次被拖曳
                chicken.style.pointerEvents = 'none'; 

                // 标记这个鸡舍已经被填满
                coop.dataset.filled = true;
                filledCoops++; // 更新已填满的鸡舍数量

                if (filledCoops === coops.length) {
                    endGame(); // 如果所有鸡舍都被填满，则结束游戏
                }
            }
        });
    }

    function endGame() {
        endMessage.style.display = 'block';
        setTimeout(() => {
            endMessage.style.display = 'none';
            activateNextLevel();
        }, 2000); // 2秒后移除结束消息并启动下一关
    }

    function activateNextLevel() {
        const chickens = document.querySelectorAll('.chicken');
        chickens.forEach(chicken => {
            chicken.style.pointerEvents = 'auto'; // 重新启用小鸡的点击功能
            chicken.addEventListener('click', function() {
                chicken.dataset.clicks = parseInt(chicken.dataset.clicks) + 1;
                if (chicken.dataset.clicks == 2) { // 每点击2次
                    const currentWidth = chicken.clientWidth;
                    const currentHeight = chicken.clientHeight;
                    const newSize = currentWidth * 1.1;

                    chicken.style.width = newSize + 'px'; // 等比例增加10%
                    chicken.style.height = newSize + 'px';

                    chicken.dataset.size = parseFloat(chicken.dataset.size) * 1.1; // 更新大小比例
                    chicken.dataset.clicks = 0; // 重置点击计数

                    // 当小鸡大小达到100%（即原始大小的两倍）时，随机变成公鸡或母鸡
                    if (parseFloat(chicken.dataset.size) >= 2) {
                        const isRooster = Math.random() > 0.5; // 随机决定是公鸡还是母鸡
                        chicken.src = isRooster ? '../rooster.png' : '../hen.png'; // 更改图片为公鸡或母鸡
                    }
                }
            });
        });
    }

    function initGame() {
        for (let i = 0; i < 5; i++) {
            createChicken();
        }
    }

    initGame(); // 开始游戏
};
