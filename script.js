const plane = document.getElementById('plane');
const gameContainer = document.getElementById('gameContainer');
const moveSpeed = 20; // Uçağın Hızı
const rocketImage = 'rocket2.png'; // Roket resmi
const monsterImage = 'monster.png'; // Uzaylı resmi
const ripImage = 'rip.png'; // Oyun bittiğinde gösterilecek resim
const ammoDisplay = document.createElement('div'); // Cephane sayısı metni
let posX = 0;
let posY = 0;
let moveInterval;
let ammoCount = 50; // Başlangıç cephanesi
const maxAmmo = 50; // Maksimum cephane sınırı
let pressedKeys = {};
let gameOver = false; // Oyunun bitip bitmediğini kontrol etmek için
let isFirstRocketFire = true; // İlk roket fırlatıldığını kontrol etmek için

// BOOM sesini çalacak fonksiyon
function playRocketSound() {
    const rocketSound = new Audio('rocketD.mp3'); // Ses dosyasının yolu
    rocketSound.play();
}

// Cephane sayısı göstergesi
ammoDisplay.id = 'ammoDisplay';
ammoDisplay.textContent = `Cephane: ${ammoCount}/${maxAmmo}`;
ammoDisplay.style.position = 'absolute';
ammoDisplay.style.left = '50%';
ammoDisplay.style.top = '20px';
ammoDisplay.style.transform = 'translateX(-50%)';
ammoDisplay.style.fontSize = '18px';
ammoDisplay.style.color = 'white';
gameContainer.appendChild(ammoDisplay);

// Cephane sayısını güncelleyen fonksiyon
function updateAmmoDisplay() {
    ammoDisplay.textContent = `Cephane: ${ammoCount}/${maxAmmo}`;
}

// 20 saniyede bir cephaneyi artır ve sesi çal
setInterval(() => {
    if (ammoCount < maxAmmo) {
        const ammoToAdd = Math.min(25, maxAmmo - ammoCount); // Cephaneyi sınırı aşmadan artır
        ammoCount += ammoToAdd;
        updateAmmoDisplay();

        // Ses dosyasını çal
        const ammoSound = new Audio('ammo2.mp3');
        ammoSound.play();
    }
}, 20000); // 20 Saniye

// BOOM sesini çalacak fonksiyon
function playBoomSound() {
    const boomSound = new Audio('sounds/boom.mp3'); // Ses dosyasının yolu
    boomSound.play();
}

// Uçağın pozisyonunu güncelleyen fonksiyon
function updatePlanePosition() {
    plane.style.left = `${posX}px`;
    plane.style.top = `${posY}px`;
}

// BOOM sesini çalacak fonksiyon
function playRocketSound() {
    const rocketSound = new Audio('rocket.mp3'); // Ses dosyasının yolu
    rocketSound.play();
}

// Roketleri ekleyen ve hareket ettiren fonksiyon
function fireRocket() {
    if (ammoCount > 0 && !gameOver) {
        // İlk roket fırlatıldığında rocket.mp3 çal
        if (isFirstRocketFire) {
            playRocketSound();
            isFirstRocketFire = false; // İlk çalmayı tamamladıktan sonra tekrar çalmasın
        }

        const rocket = document.createElement('img');
        rocket.src = rocketImage;
        rocket.style.position = 'absolute';
        rocket.style.width = '30px'; // Roket Boyutu
        rocket.style.left = `${posX + 50}px`;
        rocket.style.top = `${posY + 20}px`;
        gameContainer.appendChild(rocket);

        let rocketPosX = posX + 50;
        let rocketInterval = setInterval(() => {
            rocketPosX += 20;
            rocket.style.left = `${rocketPosX}px`;

            // Roket ekranın dışına çıkarsa temizle
            if (rocketPosX > gameContainer.clientWidth) {
                clearInterval(rocketInterval);
                gameContainer.removeChild(rocket);
            }

            // Uzaylı çarpışması kontrolü
            const monsters = document.querySelectorAll('img[src="monster.png"]');
            monsters.forEach(monster => {
                const monsterRect = monster.getBoundingClientRect();
                const rocketRect = rocket.getBoundingClientRect();

                if (
                    rocketRect.top < monsterRect.bottom &&
                    rocketRect.bottom > monsterRect.top &&
                    rocketRect.left < monsterRect.right &&
                    rocketRect.right > monsterRect.left
                ) {
                    // Uzaylıya çarptıysa uzaylıyı ve roketi temizle
                    clearInterval(rocketInterval);
                    gameContainer.removeChild(rocket);
                    gameContainer.removeChild(monster);

                    // BOOM sesini çal
                    playBoomSound();
                }
            });
        }, 50);

        ammoCount--;
        updateAmmoDisplay();
    }
}

// Cephane ekranını güncelleyen fonksiyon
function updateAmmoDisplay() {
    ammoDisplay.textContent = `Cephane: ${ammoCount}`;
    if (ammoCount === 0) {
        ammoDisplay.classList.add('red');
    } else {
        ammoDisplay.classList.remove('red');
    }
}

// Uzaylı çarpışması kontrolü
function checkCollisions() {
    const monsters = document.querySelectorAll('img[src="monster.png"]');
    monsters.forEach(monster => {
        const monsterRect = monster.getBoundingClientRect();
        const planeRect = plane.getBoundingClientRect();

        if (
            monsterRect.top < planeRect.bottom &&
            monsterRect.bottom > planeRect.top &&
            monsterRect.left < planeRect.right &&
            monsterRect.right > planeRect.left
        ) {
            endGame();
            gameContainer.removeChild(monster);
        }
    });
}

// Oyunu bitiren fonksiyon
function endGame() {
    gameOver = true;
    const rip = document.createElement('img');
    rip.src = ripImage;
    rip.style.position = 'absolute';
    rip.style.left = `${posX}px`;
    rip.style.top = `${posY}px`;
    rip.style.width = '100px';
    rip.style.height = '100px';
    gameContainer.appendChild(rip);
    plane.style.display = 'none';
}

// Hareket ve tuş kontrolü
document.addEventListener('keydown', (event) => {
    pressedKeys[event.key] = true;

    if (!moveInterval) {
        moveInterval = setInterval(movePlane, 80);
    }

    if (event.key === 'f') {
        fireRocket();
    }
});

document.addEventListener('keyup', (event) => {
    pressedKeys[event.key] = false;

    if (Object.values(pressedKeys).every(value => !value)) {
        clearInterval(moveInterval);
        moveInterval = null;
    }
});

// Hareket fonksiyonu
function movePlane() {
    if (pressedKeys['d']) {
        posX = Math.min(posX + moveSpeed, gameContainer.clientWidth - plane.offsetWidth);
    }
    if (pressedKeys['a']) {
        posX = Math.max(posX - moveSpeed, 0);
    }
    if (pressedKeys['s']) {
        posY = Math.min(posY + moveSpeed, gameContainer.clientHeight - plane.offsetHeight);
    }
    if (pressedKeys['w']) {
        posY = Math.max(posY - moveSpeed, 0);
    }

    updatePlanePosition();
}

// Uzaylı oluşturma
function spawnEnemyMonster() {
    if (gameOver) return;

    const monster = document.createElement('img');
    monster.src = monsterImage;
    monster.style.position = 'absolute';
    monster.style.width = '50px';
    monster.style.right = '0';
    monster.style.top = `${Math.random() * (gameContainer.clientHeight - 50)}px`;
    gameContainer.appendChild(monster);

    let monsterPosX = gameContainer.clientWidth;
    let monsterInterval = setInterval(() => {
        monsterPosX -= 10;
        monster.style.left = `${monsterPosX}px`;

        if (monsterPosX < -50) {
            clearInterval(monsterInterval);
            gameContainer.removeChild(monster);
        }
    }, 50);
}

setInterval(spawnEnemyMonster, 300);
setInterval(checkCollisions, 50);

// BOOM sesini çalacak fonksiyon
function playBoomSound() {
    const boomSound = new Audio('boom.mp3'); // Ses dosyasının yolu
    boomSound.play();
}

// Cephane yokken çalacak ses fonksiyonu
function playAmmoSound() {
    const ammoSound = new Audio('ammo.mp3'); // Ses dosyasının yolu
    ammoSound.play();
}

// Roketleri ekleyen ve hareket ettiren fonksiyon
function fireRocket() {
    if (ammoCount > 0 && !gameOver) {
        const rocket = document.createElement('img');
        rocket.src = rocketImage;
        rocket.style.position = 'absolute';
        rocket.style.width = '30px'; // Roket Boyutu
        rocket.style.left = `${posX + 50}px`;
        rocket.style.top = `${posY + 20}px`;
        gameContainer.appendChild(rocket);

        let rocketPosX = posX + 50;
        let rocketInterval = setInterval(() => {
            rocketPosX += 20;
            rocket.style.left = `${rocketPosX}px`;

            // Roket ekranın dışına çıkarsa temizle
            if (rocketPosX > gameContainer.clientWidth) {
                clearInterval(rocketInterval);
                gameContainer.removeChild(rocket);
            }

            // Uzaylı çarpışması kontrolü
            const monsters = document.querySelectorAll('img[src="monster.png"]');
            monsters.forEach(monster => {
                const monsterRect = monster.getBoundingClientRect();
                const rocketRect = rocket.getBoundingClientRect();

                if (
                    rocketRect.top < monsterRect.bottom &&
                    rocketRect.bottom > monsterRect.top &&
                    rocketRect.left < monsterRect.right &&
                    rocketRect.right > monsterRect.left
                ) {
                    // Uzaylıya çarptıysa uzaylıyı ve roketi temizle
                    clearInterval(rocketInterval);
                    gameContainer.removeChild(rocket);
                    gameContainer.removeChild(monster);

                    // BOOM sesini çal
                    playBoomSound();
                }
            });
        }, 50);

        ammoCount--;
        updateAmmoDisplay();
    } else if (ammoCount === 0 && !gameOver) {
        // Cephane sıfırsa ve oyun bitmemişse ses çal
        playAmmoSound();
    }
}

// BOOM2 sesini çalacak fonksiyon
function playBoom2Sound() {
    const boom2Sound = new Audio('boom3.mp3'); // Ses dosyasının yolu
    boom2Sound.play();
}

// Oyunu bitiren fonksiyon
function endGame() {
    if (!gameOver) {
        gameOver = true;

        // BOOM2 sesini çal
        playBoom2Sound();

        const rip = document.createElement('img');
        rip.src = ripImage;
        rip.style.position = 'absolute';
        rip.style.left = `${posX}px`;
        rip.style.top = `${posY}px`;
        rip.style.width = '100px';
        rip.style.height = '100px';
        gameContainer.appendChild(rip);
        plane.style.display = 'none';
    }
}

// Cephane yokken çalacak ses fonksiyonu
function playAmmoSound() {
    const ammoSound = new Audio('ammo.mp3'); // Ses dosyasının yolu
    ammoSound.play();
}


