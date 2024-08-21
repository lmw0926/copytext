
// 圖片數據
const data = [
    'https://static.wixstatic.com/media/10732d_09cfd5fa4df74d5c9f49eba60592b28b~mv2.jpg',
    'https://static.wixstatic.com/media/10732d_53f4bf9441ad4e04b5f47abf1428bbf0~mv2.jpg',
    'https://static.wixstatic.com/media/10732d_5164296d14fc4631bb27b8c06100bd64~mv2.jpg',
    'https://static.wixstatic.com/media/10732d_6eba2879929a4ef3964339a43c21109c~mv2.jpg',
    'https://static.wixstatic.com/media/10732d_6791ff0616984325b5f09120fb6aafe9~mv2.jpg'
];


let gameBoard = document.getElementById('game-board');
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let matchedCards = 0; // 已成功配對的卡片數量

// 初始化遊戲
function initGame() {
    // 將圖片數據隨機排列
    let cardArray = [];
    data.forEach(img => {
        cardArray.push(img);
        cardArray.push(img);  // 每個圖片需要兩張
    });
    cardArray.sort(() => Math.random() - 0.5);

    // 創建遊戲卡片
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

// 點擊卡片時的邏輯
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

// 檢查是否配對成功
function checkForMatch() {
    let isMatch = firstCard.dataset.image === secondCard.dataset.image;

    isMatch ? keepCardsRevealed() : unflipCards();
}

// 如果配對成功，保持卡片顯示
function keepCardsRevealed() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedCards += 2; // 增加已成功配對的卡片數量
    checkWinCondition();
    resetBoard();
}

// 如果配對不成功
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.querySelector('img').classList.add('hidden');
        secondCard.querySelector('img').classList.add('hidden');
        firstCard.classList.remove('revealed');
        secondCard.classList.remove('revealed');
        resetBoard();
    }, 1000);
}

// 檢查是否全部配對成功
function checkWinCondition() {
    if (matchedCards === cards.length) {
        showCongratulations();
    }
}

// 顯示恭喜圖片
function showCongratulations() {
    let overlay = document.createElement('div');
    overlay.classList.add('overlay');
    let congratsImg = document.createElement('img');
    congratsImg.src = 'https://static.wixstatic.com/media/10732d_817e924bed0746708627cb3f9f543337~mv2.jpg'; // 替換為實際的恭喜圖片路徑
    overlay.appendChild(congratsImg);
    document.body.appendChild(overlay);

    // 點擊遮罩層時，移除恭喜圖片
    overlay.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
}

// 重置遊戲狀態
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// 初始化遊戲
initGame();
