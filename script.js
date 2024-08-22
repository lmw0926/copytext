
// 圖片數據
const data = [
    'img1.jpg',
    'img2.jpg',
    'img3.jpg',
    'img4.jpg',
    'img5.jpg'
];

let gameBoard = document.getElementById('game-board');
let cards = [];
let firstCard, secondCard;
let lockBoard = false;

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

// 重置遊戲狀態
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// 初始化遊戲
initGame();


// 初始化遊戲
initGame();
