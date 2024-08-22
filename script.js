// 圖片數據
const data = [
    'https://static.wixstatic.com/media/10d41b_2e74a0e53ae1426f8eff964cd588fd76~mv2.jpg/v1/fill/w_500,h_750,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/10d41b_2e74a0e53ae1426f8eff964cd588fd76~mv2.jpg',
    'https://static.wixstatic.com/media/10d41b_51df68a706ac4d36b7eceb731c02924b~mv2.jpg/v1/fill/w_500,h_750,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/10d41b_51df68a706ac4d36b7eceb731c02924b~mv2.jpg',
    'https://static.wixstatic.com/media/10d41b_5991830f5a4547e581c6e3c48a8f938c~mv2.jpg/v1/fill/w_500,h_750,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/10d41b_5991830f5a4547e581c6e3c48a8f938c~mv2.jpg',
    'https://static.wixstatic.com/media/10d41b_297e8571a7cd4b5c8f3d99d140c18dc5~mv2.jpg/v1/fill/w_500,h_333,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/10d41b_297e8571a7cd4b5c8f3d99d140c18dc5~mv2.jpg',
    'https://static.wixstatic.com/media/10d41b_b0dfe506e562478b864305cde66f6c6a~mv2.jpg/v1/fill/w_500,h_750,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/10d41b_b0dfe506e562478b864305cde66f6c6a~mv2.jpg'
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
    congratsImg.src = 'congratulations.jpg'; // 替換為實際的恭喜圖片路徑
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
