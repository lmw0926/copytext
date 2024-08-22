// 圖片配對數據，使用兩張不同的圖片進行配對
const data = [
    { img1: 'https://static.wixstatic.com/media/10d41b_2e74a0e53ae1426f8eff964cd588fd76~mv2.jpg/v1/fill/w_500,h_750,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/10d41b_2e74a0e53ae1426f8eff964cd588fd76~mv2.jpg', img2: 'https://static.wixstatic.com/media/10d41b_3f3f952b2c3f48cd85d9e097ecc2eb00~mv2.jpg/v1/fill/w_500,h_750,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/10d41b_3f3f952b2c3f48cd85d9e097ecc2eb00~mv2.jpg' },
    { img1: 'https://static.wixstatic.com/media/10d41b_51df68a706ac4d36b7eceb731c02924b~mv2.jpg/v1/fill/w_500,h_750,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/10d41b_51df68a706ac4d36b7eceb731c02924b~mv2.jpg', img2: 'https://static.wixstatic.com/media/10d41b_2c4c815236ed425b97b01102ca76f668~mv2.jpg/v1/fill/w_500,h_750,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/10d41b_2c4c815236ed425b97b01102ca76f668~mv2.jpg' },
    { img1: 'https://static.wixstatic.com/media/10d41b_5991830f5a4547e581c6e3c48a8f938c~mv2.jpg/v1/fill/w_500,h_750,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/10d41b_5991830f5a4547e581c6e3c48a8f938c~mv2.jpg', img2: 'https://static.wixstatic.com/media/10d41b_a1edfb7e25df4604a87fabc3aab7b488~mv2.jpg/v1/fill/w_500,h_750,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/10d41b_a1edfb7e25df4604a87fabc3aab7b488~mv2.jpg    ' },
    { img1: 'https://static.wixstatic.com/media/10d41b_297e8571a7cd4b5c8f3d99d140c18dc5~mv2.jpg/v1/fill/w_500,h_333,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/10d41b_297e8571a7cd4b5c8f3d99d140c18dc5~mv2.jpg', img2: 'https://static.wixstatic.com/media/10d41b_7a93291f5ea049dfb8d05dc7d72d4e06~mv2.jpg/v1/fill/w_500,h_333,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/10d41b_7a93291f5ea049dfb8d05dc7d72d4e06~mv2.jpg' },
    { img1: 'https://static.wixstatic.com/media/10d41b_b0dfe506e562478b864305cde66f6c6a~mv2.jpg/v1/fill/w_500,h_750,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/10d41b_b0dfe506e562478b864305cde66f6c6a~mv2.jpg', img2: 'https://static.wixstatic.com/media/10d41b_c6ed08534460474f958a25898e24ed8d~mv2.jpg/v1/fill/w_500,h_750,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/10d41b_c6ed08534460474f958a25898e24ed8d~mv2.jpg' },
    { img1: 'https://static.wixstatic.com/media/10d41b_eb2e9190d8ec4c09aa6cb72c5484a2dd~mv2.jpg/v1/fill/w_500,h_750,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/10d41b_eb2e9190d8ec4c09aa6cb72c5484a2dd~mv2.jpg', img2: 'https://static.wixstatic.com/media/10d41b_d60729573afa48039da7bb83d4b3faee~mv2.jpg/v1/fill/w_500,h_750,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/10d41b_d60729573afa48039da7bb83d4b3faee~mv2.jpg' },
];

let gameBoard = document.getElementById('game-board');
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let matchedCards = 0; // 已成功配对的卡片数量

// 初始化游戏
function initGame() {
    // 创建两个卡片组，每组包含两张不同的图片
    let cardArray = [];
    data.forEach(pair => {
        cardArray.push(pair.img1);
        cardArray.push(pair.img2);
    });
    cardArray.sort(() => Math.random() - 0.5);

    // 创建游戏卡片
    cardArray.forEach(img => {
        let card = document.createElement('div');
        card.classList.add('card');
        let imgElement = document.createElement('img');
        imgElement.src = img;
        imgElement.classList.add('hidden');
        card.appendChild(imgElement);
        card.dataset.image = img;
        card.addEventListener('click', revealCard);
        gameBoard.appendChild(card);
        cards.push(card);
    });
}

// 点击卡片时的逻辑
function revealCard() {
    if (lockBoard || this === firstCard || this.classList.contains('matched')) return;

    let imgElement = this.querySelector('img');
    imgElement.classList.remove('hidden');
    this.classList.add('revealed');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

// 检查是否配对成功
function checkForMatch() {
    // 查找这两张图片是否构成有效的配对
    let isMatch = data.some(pair => 
        (pair.img1 === firstCard.dataset.image && pair.img2 === secondCard.dataset.image) ||
        (pair.img2 === firstCard.dataset.image && pair.img1 === secondCard.dataset.image)
    );

    isMatch ? keepCardsRevealed() : unflipCards();
}

// 如果配对成功，保持卡片显示
function keepCardsRevealed() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedCards += 2; // 增加已成功配对的卡片数量
    checkWinCondition();
    resetBoard();
}

// 如果配对不成功
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.querySelector('img').classList.add('hidden');
        secondCard.querySelector('img').classList.add('hidden');
        firstCard.classList.remove('revealed');
        secondCard.classList.remove('revealed');
        resetBoard();
    }, 500);
}

// 检查是否全部配对成功
function checkWinCondition() {
    if (matchedCards === cards.length) {
        showCongratulations();
    }
}


function showCongratulations() {
    // 创建恭喜图片的 overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    const congratsImage = document.createElement('img');
    congratsImage.src = 'https://static.wixstatic.com/media/10d41b_d3a1432eb54a4174b4e53994705c335a~mv2.png'; // 替换为实际的恭喜图片路径
    overlay.appendChild(congratsImage);

    // 添加点击事件监听器，点击恭喜图片时返回游戏完成画面
    congratsImage.addEventListener('click', () => {
        document.body.removeChild(overlay);
        showGameBoard(); // 显示游戏完成画面
    });

    // 将 overlay 添加到 body
    document.body.appendChild(overlay);
}

function showGameBoard() {
    // 假设游戏完成画面的容器是 #game-board
    const gameBoard = document.getElementById('game-board');
    gameBoard.style.display = 'grid'; // 显示游戏画面
    gameBoard.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            showZoomedImage(card.querySelector('img').src);
        });
    });
}

function showZoomedImage(src) {
    // 创建放大图的 overlay
    const zoomedOverlay = document.createElement('div');
    zoomedOverlay.className = 'zoomed-image';
    const zoomedImage = document.createElement('img');
    zoomedImage.src = src; // 使用传入的图片路径
    zoomedOverlay.appendChild(zoomedImage);
    

    // 点击图片时关闭放大图
    zoomedImage.addEventListener('click', () => {
        document.body.removeChild(zoomedOverlay);
    });

    // 将 zoomedOverlay 添加到 body
    document.body.appendChild(zoomedOverlay);
}

// 游戏启动的函数
function startGame() {
    // 游戏初始化的代码
    // 游戏完成的逻辑中调用 showCongratulations
    // 例如，所有卡片匹配成功后调用：
    // showCongratulations();
}

// 启动游戏
startGame();


function startGame() {
    // 初始化游戏的代码
    // 游戏完成的逻辑中调用 showCongratulations
    // 例如，所有卡片匹配成功后调用：
    // showCongratulations();
}

// 启动游戏
startGame();

// 重置游戏状态
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// 初始化游戏
initGame();
