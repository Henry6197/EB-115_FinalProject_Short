const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let map = [
[0,0,0,1,0,0,0,0,1,0,0,0,0,1],
[0,1,0,1,0,1,1,0,1,1,0,1,0,1],
[0,1,0,0,0,1,0,0,0,0,0,1,0,0],
[0,1,1,1,0,1,0,1,1,1,1,1,1,0],
[0,1,0,1,0,1,0,0,0,0,0,0,1,0],
[0,1,0,1,0,1,0,1,0,1,1,0,1,0],
[0,1,0,0,0,1,0,1,0,0,1,0,0,0],
[0,1,1,1,1,1,1,1,1,0,1,1,1,1],
[0,0,0,0,0,0,0,1,1,0,1,0,1,2],
[1,1,1,0,1,1,0,1,0,0,0,0,1,0],
[1,0,1,0,1,0,0,1,0,1,1,1,1,0],
[1,0,0,0,1,0,1,1,0,1,1,1,1,0],
[1,0,1,1,1,0,1,0,0,0,0,0,1,0],
[1,0,0,0,1,0,1,0,1,1,1,0,1,0],
[1,1,1,0,0,0,1,0,0,0,1,0,0,0],
];

class Snail {
    constructor(x, y, speed, color) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.color = color;
        this.heightScale = 0.15;
        this.widthScale = 0.25;
        this.hitRadiusGrid = 0.12;
        this.path = [];
        this.lastPathUpdate = 0;
        this.gridRes = 6; //snails grid is 4x per cell so that they can move more smooth
    }

    findPath(targetX, targetY) {
        const isBlocked = (gx, gy) => {
            const mX = Math.floor(gx / this.gridRes);
            const mY = Math.floor(gy / this.gridRes);
            return (
                mY < 0 || mY >= map.length ||
                mX < 0 || mX >= map[0].length ||
                map[mY][mX] === 1
            );
        };

        const start = { x: Math.floor(this.x * this.gridRes), y: Math.floor(this.y * this.gridRes) };
        const end = { x: Math.floor(targetX * this.gridRes), y: Math.floor(targetY * this.gridRes) };
        const openList = [{ ...start, g: 0, h: 0, f: 0, parent: null }];
        const closedList = new Set();
        while (openList.length > 0) {
            let lowIdx = 0;
            for (let i = 0; i < openList.length; i++) {
                if (openList[i].f < openList[lowIdx].f) {
                    lowIdx = i;
                }
            }
            let curr = openList[lowIdx];
            if (curr.x === end.x && curr.y === end.y) {
                const path = [];
                while (curr.parent) {
                    path.push(curr);
                    curr = curr.parent;
                }
                return path.reverse();
            }
            openList.splice(lowIdx, 1);
            closedList.add(`${curr.x},${curr.y}`);
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (dx === 0 && dy === 0) continue;
                    const nx = curr.x + dx;
                    const ny = curr.y + dy;
                    if (isBlocked(nx, ny) || closedList.has(`${nx},${ny}`)) continue;
                    // Prevent diagonal corner cutting so snails don't clip through wall corners.
                    if (dx !== 0 && dy !== 0) {
                        if (isBlocked(curr.x + dx, curr.y) || isBlocked(curr.x, curr.y + dy)) continue;
                    }
                    const moveCost = (dx !== 0 && dy !== 0) ? 1.414 : 1;
                    const gScore = curr.g + moveCost;
                    const hScore = Math.sqrt((nx - end.x) ** 2 + (ny - end.y) ** 2);
                    const openNode = openList.find((node) => node.x === nx && node.y === ny);
                    if (!openNode || gScore < openNode.g) {
                        if (!openNode) {
                            openList.push({
                                x: nx,
                                y: ny,
                                g: gScore,
                                h: hScore,
                                f: gScore + hScore,
                                parent: curr,
                            });
                        } else {
                            openNode.g = gScore;
                            openNode.f = gScore + hScore;
                            openNode.parent = curr;
                        }
                    }
                }
            }
        }
        return [];
    }

    update(player) {
        const now = Date.now();
        if (now - this.lastPathUpdate > 400) {
            this.path = this.findPath(player.x, player.y);
            this.lastPathUpdate = now;
        }
        if (this.path.length > 0) {
            const target = this.path[0];
            const tx = (target.x + 0.5) / this.gridRes;
            const ty = (target.y + 0.5) / this.gridRes;
            const dx = tx - this.x;
            const dy = ty - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 0.05) {
                this.path.shift();
            } else {
                this.x += (dx / dist) * this.speed;
                this.y += (dy / dist) * this.speed;
            }
        }
    }
}
class LargeSnail extends Snail {
    constructor(x, y) {
        super(x, y, 0.01, "#556B2F");
        this.heightScale = 0.4;
        this.widthScale = 2.5;
        this.hitRadiusGrid = 0.11;
    }
}
class TurboSnail extends Snail {
    constructor(x, y) {
        super(x, y, 0.012, "#00FF7F");
        this.heightScale = 0.4;
        this.widthScale = 1.0;
        this.hitRadiusGrid = 0.09;
    }
}
function loadImage(src, onLoad) {
    const image = new Image();
    image.onload = onLoad;
    image.src = src;
    return image;
}
function tryPlay(audio) {
    const playAttempt = audio.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
        playAttempt.catch(() => {});
    }
}
function stopAudio(audio, reset = true) {
    if (audio.paused) return;
    audio.pause();
    if (reset) {
        audio.currentTime = 0;
    }
}
let snailImgReady = false;
const snailImg = loadImage("snail.png", () => {
    snailImgReady = true;
});
let snails = [
    new LargeSnail(1, 10),
    new TurboSnail(12, 1)
];
const armImg = loadImage("player.png");
const armImgLeft = loadImage("player.png");
const FOV = Math.PI / 4;
const wallh =700;
const tileSize = 2.5;
const moveSpeed = 0.045;
const turnSpeed = 0.025;
const playerRadius = 0.20;
const snailAudioDistance = 3.5;
const breathIntervalMs = 7000;
const rayStepWidth = 2;
const numRays = Math.floor(canvas.width / rayStepWidth);
const player = {
    x: (0.5) * tileSize,
    y: (0.5) * tileSize,
    angle: 0
};
let gameState = "PLAYING";
let gameStartTimeMs = null;
let elapsedTimeMs = 0;
const zBuffer = new Array(numRays).fill(0);
const wallTexture = new Image();
let wallTextureReady = false;
const slimeAudio = new Audio("slime.mp3");
slimeAudio.loop = true;
slimeAudio.preload = "auto";
const breathAudio = new Audio("breath.mp3");
breathAudio.loop = false;
breathAudio.preload = "auto";
const runAudio = new Audio("run.mp3");
runAudio.loop = true;
runAudio.volume = 0.2;
runAudio.preload = "auto";
let lastBreathPlayAt = 0;
let armBobPhase = 0;
const armBobAmplitude = 12;
const armBobSpeed = 0.12;
let mazeReady = false;

//-- Minimap constants --
// const minimapTileSize = 6; // Each maze cell in pixels on minimap // this line is AI generated
// const minimapMargin = 8;   // Padding for the minimap in the canvas // this line is AI generated
//-----------------------

wallTexture.onload = () => {
    wallTextureReady = true;
};
wallTexture.src = "wall.png";

function isWallAt(x, y) {
    const cellX = Math.floor(x / tileSize);
    const cellY = Math.floor(y / tileSize);
    if (cellY < 0 || cellY >= map.length || cellX < 0 || cellX >= map[0].length) return true;
    return map[cellY][cellX] === 1;
}

function checkEscapeTile() {
    const cellX = Math.floor(player.x / tileSize);
    const cellY = Math.floor(player.y / tileSize);
    if (cellY < 0 || cellY >= map.length || cellX < 0 || cellX >= map[0].length) return;
    if (map[cellY][cellX] === 2) {
        gameState = "ESCAPED";
    }
}

function canMoveTo(x, y) {
    return (
        !isWallAt(x - playerRadius, y - playerRadius) &&
        !isWallAt(x + playerRadius, y - playerRadius) &&
        !isWallAt(x - playerRadius, y + playerRadius) &&
        !isWallAt(x + playerRadius, y + playerRadius)
    );
}

function checkSnailCollisions() {
    const playerGridX = player.x / tileSize;
    const playerGridY = player.y / tileSize;
    const playerRadiusGrid = playerRadius / tileSize;

    for (const snail of snails) {
        const dx = snail.x - playerGridX;
        const dy = snail.y - playerGridY;
        const snailRadiusGrid = snail.hitRadiusGrid;
        const hitDist = snailRadiusGrid + playerRadiusGrid;

        if ((dx * dx) + (dy * dy) <= hitDist * hitDist) {
            gameState = "LOST";
            return;
        }
    }
}

function updateSnailAudio() {
    const playerGridX = player.x / tileSize;
    const playerGridY = player.y / tileSize;
    let nearest = Infinity;

    for (const snail of snails) {
        const dx = snail.x - playerGridX;
        const dy = snail.y - playerGridY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < nearest) nearest = dist;
    }

    if (nearest <= snailAudioDistance) {
        if (slimeAudio.paused) {
            tryPlay(slimeAudio);
        }
    } else {
        stopAudio(slimeAudio);
    }
}

function updateBreathAudio() {
    const now = Date.now();
    if (now - lastBreathPlayAt >= breathIntervalMs) {
        breathAudio.currentTime = 0;
        lastBreathPlayAt = now;
        tryPlay(breathAudio);
    }
}

function updateRunAudio() {
    const isMoving = !!(keys["w"] || keys["s"]);
    if (isMoving) {
        if (runAudio.paused) {
            tryPlay(runAudio);
        }
    } else {
        stopAudio(runAudio);
    }
}

function castRays(angle) {
    const px = player.x / tileSize;
    const py = player.y / tileSize;
    let mapX = Math.floor(px), mapY = Math.floor(py);
    const rayDirX = Math.cos(angle), rayDirY = Math.sin(angle);
    const deltaDistX = Math.abs(1 / rayDirX), deltaDistY = Math.abs(1 / rayDirY);
    let stepX = rayDirX < 0 ? -1 : 1, stepY = rayDirY < 0 ? -1 : 1;
    let sDX = rayDirX < 0 ? (px - mapX) * deltaDistX : (mapX + 1.0 - px) * deltaDistX;
    let sDY = rayDirY < 0 ? (py - mapY) * deltaDistY : (mapY + 1.0 - py) * deltaDistY;
    let hit = 0, side = 0, hitTile = 0;
    while (hit === 0) {
        if (sDX < sDY) { sDX += deltaDistX; mapX += stepX; side = 0; }
        else { sDY += deltaDistY; mapY += stepY; side = 1; }
        if (mapY < 0 || mapY >= map.length || mapX < 0 || mapX >= map[0].length) break;
        if (map[mapY][mapX] > 0) { hit = 1; hitTile = map[mapY][mapX]; }
    }
    let d = (side === 0) ? (sDX - deltaDistX) : (sDY - deltaDistY);
    const wallX = (side === 0)
        ? py + d * rayDirY
        : px + d * rayDirX;
    const wallXFrac = wallX - Math.floor(wallX);
    const distance = d * tileSize * Math.cos(angle - player.angle);
    return { distance, wallH: wallh / Math.max(distance, 0.0001), side, wallX: wallXFrac, rayDirX, rayDirY, hitTile };
}

function formatElapsedTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
}

function drawTimer(ms) {
    const label = `${formatElapsedTime(ms)}`;
    ctx.save();
    ctx.font = "24px 'Times New Roman', serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";

    const metrics = ctx.measureText(label);
    const boxWidth = metrics.width + 20;
    const boxHeight = 36;
    const x = canvas.width - 12;
    const y = 12;

    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(x - boxWidth, y - 6, boxWidth, boxHeight);

    ctx.fillStyle = "#ddc49a";
    ctx.fillText(label, x - 10, y);
    ctx.restore();
}

function formatElapsedTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
}

function drawTimer(ms) {
    const label = `${formatElapsedTime(ms)}`;
    ctx.save();
    ctx.font = "24px 'Times New Roman', serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";

    const metrics = ctx.measureText(label);
    const boxWidth = metrics.width + 20;
    const boxHeight = 36;
    const x = canvas.width - 12;
    const y = 12;

    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(x - boxWidth, y - 6, boxWidth, boxHeight);

    ctx.fillStyle = "#ddc49a";
    ctx.fillText(label, x - 10, y);
    ctx.restore();
}

const keys = {};
window.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;
});
window.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
});

// // -------- Minimap Drawing Function (AI generated) --------
// function drawMinimap() { // this line is AI generated
//     const mapWidth = map[0].length; // this line is AI generated
//     const mapHeight = map.length; // this line is AI generated
//     const mmX = minimapMargin; // this line is AI generated
//     const mmY = minimapMargin; // this line is AI generated
//     const mmW = mapWidth * minimapTileSize; // this line is AI generated
//     const mmH = mapHeight * minimapTileSize; // this line is AI generated

//     // Background // this line is AI generated
//     ctx.save(); // this line is AI generated
//     ctx.globalAlpha = 0.85; // this line is AI generated
//     ctx.fillStyle = "#353535"; // this line is AI generated
//     ctx.fillRect(mmX-2, mmY-2, mmW+4, mmH+4); // this line is AI generated
//     ctx.globalAlpha = 1.0; // this line is AI generated

//     // Maze cells // this line is AI generated
//     for (let y = 0; y < mapHeight; y++) { // this line is AI generated
//         for (let x = 0; x < mapWidth; x++) { // this line is AI generated
//             if (map[y][x] === 1) ctx.fillStyle = "#555"; // this line is AI generated
//             else if (map[y][x] === 2) ctx.fillStyle = "#32CD32"; // this line is AI generated
//             else ctx.fillStyle = "#eee"; // this line is AI generated
//             ctx.fillRect( // this line is AI generated
//                 mmX + x * minimapTileSize, // this line is AI generated
//                 mmY + y * minimapTileSize, // this line is AI generated
//                 minimapTileSize, minimapTileSize // this line is AI generated
//             ); // this line is AI generated
//         } // this line is AI generated
//     } // this line is AI generated


//     // Snails on minimap // this line is AI generated
//     for (const snail of snails) { // this line is AI generated
//         ctx.fillStyle = snail.color; // this line is AI generated
//         const sx = mmX + snail.x * minimapTileSize; // this line is AI generated
//         const sy = mmY + snail.y * minimapTileSize; // this line is AI generated
//         ctx.beginPath(); // this line is AI generated
//         ctx.arc(sx, sy, minimapTileSize * 0.6, 0, Math.PI * 2); // this line is AI generated
//         ctx.fill(); // this line is AI generated
//     } // this line is AI generated

//     // Player facing direction // this line is AI generated
//     ctx.strokeStyle = "#d11"; // this line is AI generated
//     ctx.lineWidth = 2; // this line is AI generated
//     ctx.beginPath(); // this line is AI generated
//     ctx.moveTo( // this line is AI generated
//         mmX + (player.x / tileSize) * minimapTileSize, // this line is AI generated
//         mmY + (player.y / tileSize) * minimapTileSize // this line is AI generated
//     ); // this line is AI generated
//     ctx.lineTo( // this line is AI generated
//         mmX + (player.x / tileSize + Math.cos(player.angle) * 0.7) * minimapTileSize, // this line is AI generated
//         mmY + (player.y / tileSize + Math.sin(player.angle) * 0.7) * minimapTileSize // this line is AI generated
//     ); // this line is AI generated
//     ctx.stroke(); // this line is AI generated
//     ctx.restore(); // this line is AI generated
// } // this line is AI generated
// // -------- End Minimap Drawing --------

function drawSnails() {
    for (const snail of snails) {
        const worldX = snail.x * tileSize;
        const worldY = snail.y * tileSize;
        const relX = worldX - player.x;
        const relY = worldY - player.y;
        const distance = Math.sqrt(relX * relX + relY * relY);
        if (distance <= 0.001) continue;
        let angleToSnail = Math.atan2(relY, relX) - player.angle;
        while (angleToSnail < -Math.PI) angleToSnail += Math.PI * 2;
        while (angleToSnail > Math.PI) angleToSnail -= Math.PI * 2;
        if (Math.abs(angleToSnail) > FOV / 2 + 0.2) continue;
        const screenX = ((angleToSnail + FOV / 2) / FOV) * canvas.width;
        const zIndex = Math.floor(screenX / rayStepWidth);
        if (zIndex < 0 || zIndex >= zBuffer.length) continue;
        if (distance > zBuffer[zIndex] + 0.03) continue;
        const spriteHeight = (wallh / distance) * snail.heightScale;
        const spriteWidth = spriteHeight * (snail.widthScale / Math.max(snail.heightScale, 0.001));
        const groundY = canvas.height / 2 + wallh / (2 * distance);
        const left = screenX - spriteWidth / 2;
        const top = groundY - spriteHeight;
        const stripW = Math.max(1, rayStepWidth);
        if (snailImgReady) {
            // Clip spritegainst walls
            for (let sx = left; sx < left + spriteWidth; sx += stripW) {
                const sampleX = sx + stripW * 0.5;
                const rayIdx = Math.floor(sampleX / rayStepWidth);
                if (rayIdx < 0 || rayIdx >= zBuffer.length) continue;
                if (distance > zBuffer[rayIdx] + 0.03) continue;
                const srcX = ((sx - left) / spriteWidth) * snailImg.width;
                const srcW = (stripW / spriteWidth) * snailImg.width;
                if (srcW <= 0) continue;
                ctx.drawImage(
                    snailImg,
                    srcX,
                    0,
                    srcW,
                    snailImg.height,
                    sx,
                    top,
                    stripW,
                    spriteHeight
                );
            }
        } else {
            ctx.fillStyle = snail.color;
            for (let sx = left; sx < left + spriteWidth; sx += stripW) {
                const sampleX = sx + stripW * 0.5;
                const rayIdx = Math.floor(sampleX / rayStepWidth);
                if (rayIdx < 0 || rayIdx >= zBuffer.length) continue;
                if (distance > zBuffer[rayIdx] + 0.03) continue;
                ctx.fillRect(sx, top, stripW, spriteHeight);
            }
        }
    }
}

function render() {


    if (gameState === "PLAYING") {
        if (gameStartTimeMs === null) {
            gameStartTimeMs = Date.now();
        }
        elapsedTimeMs = Date.now() - gameStartTimeMs;

        if (keys["a"]) player.angle -= turnSpeed;
        if (keys["d"]) player.angle += turnSpeed;
        const moveAmount = (keys["w"] ? moveSpeed : 0) + (keys["s"] ? -moveSpeed : 0);
        const moveX = Math.cos(player.angle) * moveAmount;
        const moveY = Math.sin(player.angle) * moveAmount;
        const nextX = player.x + moveX;
        const nextY = player.y + moveY;
        // Resolve movement axis-by-axis to keep smooth wall sliding.
        if (canMoveTo(nextX, player.y)) player.x = nextX;
        if (canMoveTo(player.x, nextY)) player.y = nextY;

        checkEscapeTile();
        if (gameState !== "PLAYING") {
            requestAnimationFrame(render);
            return;
        }

        for (const snail of snails) {
            snail.update({ x: player.x / tileSize, y: player.y / tileSize });
        }
        updateRunAudio();
        updateBreathAudio();
        updateSnailAudio();
        checkSnailCollisions();

        // Draw Environment
        ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, canvas.width, canvas.height/2);
        ctx.fillStyle = "#9f9f9f"; ctx.fillRect(0, canvas.height/2, canvas.width, canvas.height/2);

        // Draw Walls
        for (let i = 0; i < numRays; i++) {
            let ray = castRays((player.angle - FOV / 2) + (i / numRays) * FOV);
            zBuffer[i] = ray.distance;
            let shade = Math.max(20, 200 - ray.distance * 40) * (ray.side === 1 ? 0.7 : 1);
            const wallTop = (canvas.height - ray.wallH) / 2;
            const screenX = i * rayStepWidth;

            if (wallTextureReady && ray.hitTile !== 2) {
                let texX = Math.floor(ray.wallX * wallTexture.width);
                if ((ray.side === 0 && ray.rayDirX > 0) || (ray.side === 1 && ray.rayDirY < 0)) {
                    texX = wallTexture.width - texX - 1;
                }

                ctx.drawImage(
                    wallTexture,
                    texX,
                    0,
                    1,
                    wallTexture.height,
                    screenX,
                    wallTop,
                    rayStepWidth,
                    ray.wallH
                );

                ctx.fillStyle = `rgba(0, 0, 0, ${0.45 - shade / 500})`;
                ctx.fillRect(screenX, wallTop, rayStepWidth, ray.wallH);
            } else {
                ctx.fillStyle = `rgb(${255}, ${255}, ${shade * 0.5})`;
                ctx.fillRect(screenX, wallTop, rayStepWidth, ray.wallH);
            }
        }

        drawSnails();

        // ------- Draw minimap ---------
        // drawMinimap(); // this line is AI generated
        // ------------------------------
        const leftArmX = canvas.width * 0.25;
        const rightArmX = canvas.width * 0.75;
        const bottom = canvas.height;
        const armSize = 350; // Adjust this to change arm size on screen
        const isWalking = !!(keys["w"] || keys["s"]);
        if (isWalking) armBobPhase += armBobSpeed;
        else armBobPhase = 0;
        const rightArmYOffset = isWalking ? Math.sin(armBobPhase) * armBobAmplitude : 0;
        const leftArmYOffset = -rightArmYOffset;

        if (armImgLeft.complete) {
            ctx.save();
            ctx.translate(leftArmX, bottom);
            ctx.scale(-1, 1);
            ctx.drawImage(armImgLeft, -armSize / 2, -350 + leftArmYOffset, 250, 350);
            ctx.restore();
        }

        if (armImg.complete) {
            ctx.save();
            ctx.translate(rightArmX, bottom);
            ctx.drawImage(armImg, -armSize / 2, -350 + rightArmYOffset, 250, 350);
            ctx.restore();
        }

        drawTimer(elapsedTimeMs);

    } else {
        stopAudio(slimeAudio);
        stopAudio(breathAudio);
        stopAudio(runAudio);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = "center";
        ctx.fillText("The snails caught you", canvas.width / 2, canvas.height / 2);
        ctx.font = "24px sans-serif";
        ctx.fillText(`You lasted ${formatElapsedTime(elapsedTimeMs)}`, canvas.width / 2, canvas.height / 2 + 42);
    }
    requestAnimationFrame(render);
}
render();