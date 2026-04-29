const canvas= document.getElementById("game");
const ctx = canvas.getContext("2d");

const map = [
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,0,0,1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,1],
[1,0,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
[1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
[1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1],
[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
[1,0,1,0,1,0,1,1,1,0,1,0,0,0,1,0,0,0,1,1,0,0,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1,1,0,1],
[1,0,1,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,0,1,1,0,0,0,1,0,1,0,1,0,0,0,1,0,0,1,0,1],
[1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,1,0,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1,0,1],
[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,0,1],
[1,1,1,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,1,0,0,1,1,0,0,1,1,0,0,1,1,0,1,0,1,0,1],
[1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1],
[1,0,1,0,0,0,1,1,1,0,1,0,0,0,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,0,1,0,0,0,1,1,1,0,1,1],
[1,0,1,1,0,1,1,0,1,0,1,1,0,1,1,0,1,0,0,0,1,0,1,1,0,1,1,0,1,0,1,1,0,1,0,0,0,0,0,1],
[1,0,0,1,0,0,0,0,1,0,0,1,0,0,1,0,1,0,1,0,1,0,0,1,0,0,0,0,1,0,0,1,0,1,0,1,1,1,0,1],
[1,1,0,1,1,1,0,1,1,1,0,1,1,0,1,0,1,0,1,0,1,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,0,0,0,1],
[1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,1],
[1,0,1,1,0,1,1,1,1,1,0,1,1,0,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,0,1,0,1],
[1,0,1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1],
[1,0,1,0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0,1,1,1,0,1],
[1,0,1,0,1,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,1],
[1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,0,1,1,0,1,1,0,1,0,1,0,1,0,1,0,1],
[1,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
[1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1],
[1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
[1,0,1,0,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1],
[1,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,1],
[1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,1],
[1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,1],
[1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,0,1,1,0,0,1,1,0,0,1,0,1,1,1,1,0,1],
[1,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1,0,1],
[1,0,1,0,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,0,1],
[1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1],
[1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const armImg = new Image();
armImg.src = 'player.png'; 
const FOV = Math.PI/4;
const wallh = 600;
const tileSize = 2;
const moveSpeed = 0.055; 
const turnSpeed = 0.03; 
const playerRadius = 0.20;
const rayStepWidth = 2;
const numRays = Math.floor(canvas.width / rayStepWidth);
const player = {x: 0.5, y: 0.5, angle: 0};
const gameState = "PLAYING";
const zBuffer = new Array(numRays).fill(0);
const wallTexture = new Image();
let wallTextureReady = false;

//-- Minimap constants --
const minimapTileSize = 6; // Each maze cell in pixels on minimap // this line is AI generated
const minimapMargin = 8;   // Padding for the minimap in the canvas // this line is AI generated
//-----------------------

wallTexture.onload = () => {
    wallTextureReady = true;
};
wallTexture.src = "wall.png";

function isWallAt(x, y) {
    const cellX = Math.floor(x / tileSize);
    const cellY = Math.floor(y / tileSize);
    if (cellY < 0 || cellY >= map.length || cellX < 0 || cellX >= map[0].length) return true;
    return map[cellY][cellX] !== 0;
}

function canMoveTo(x, y) {
    return (
        !isWallAt(x - playerRadius, y - playerRadius) &&
        !isWallAt(x + playerRadius, y - playerRadius) &&
        !isWallAt(x - playerRadius, y + playerRadius) &&
        !isWallAt(x + playerRadius, y + playerRadius)
    );
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
    let hit = 0, side = 0;
    while (hit === 0) {
        if (sDX < sDY) { sDX += deltaDistX; mapX += stepX; side = 0; }
        else { sDY += deltaDistY; mapY += stepY; side = 1; }
        if (mapY < 0 || mapY >= map.length || mapX < 0 || mapX >= map[0].length) break;
        if (map[mapY][mapX] > 0) hit = 1;
    }
    let d = (side === 0) ? (sDX - deltaDistX) : (sDY - deltaDistY);
    const wallX = (side === 0)
        ? py + d * rayDirY
        : px + d * rayDirX;
    const wallXFrac = wallX - Math.floor(wallX);
    const distance = d * tileSize * Math.cos(angle - player.angle);
    return { distance, wallH: wallh / Math.max(distance, 0.0001), side, wallX: wallXFrac, rayDirX, rayDirY };
}

const keys = {};
window.addEventListener("keydown", (e) => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);

// -------- Minimap Drawing Function (AI generated) --------
function drawMinimap() { // this line is AI generated
    const mapWidth = map[0].length; // this line is AI generated
    const mapHeight = map.length; // this line is AI generated
    const mmX = minimapMargin; // this line is AI generated
    const mmY = minimapMargin; // this line is AI generated
    const mmW = mapWidth * minimapTileSize; // this line is AI generated
    const mmH = mapHeight * minimapTileSize; // this line is AI generated

    // Background // this line is AI generated
    ctx.save(); // this line is AI generated
    ctx.globalAlpha = 0.85; // this line is AI generated
    ctx.fillStyle = "#353535"; // this line is AI generated
    ctx.fillRect(mmX-2, mmY-2, mmW+4, mmH+4); // this line is AI generated
    ctx.globalAlpha = 1.0; // this line is AI generated

    // Maze cells // this line is AI generated
    for (let y = 0; y < mapHeight; y++) { // this line is AI generated
        for (let x = 0; x < mapWidth; x++) { // this line is AI generated
            ctx.fillStyle = map[y][x] === 1 ? "#555" : "#eee"; // this line is AI generated
            ctx.fillRect( // this line is AI generated
                mmX + x * minimapTileSize, // this line is AI generated
                mmY + y * minimapTileSize, // this line is AI generated
                minimapTileSize, minimapTileSize // this line is AI generated
            ); // this line is AI generated
        } // this line is AI generated
    } // this line is AI generated
    // Player // this line is AI generated
    ctx.fillStyle = "#fc3c3c"; // this line is AI generated
    ctx.beginPath(); // this line is AI generated
    ctx.arc( // this line is AI generated
        mmX + (player.x / tileSize) * minimapTileSize, // this line is AI generated
        mmY + (player.y / tileSize) * minimapTileSize, // this line is AI generated
        minimapTileSize * 0.4, // this line is AI generated
        0, Math.PI * 2 // this line is AI generated
    ); // this line is AI generated
    ctx.fill(); // this line is AI generated

    // Player facing direction // this line is AI generated
    ctx.strokeStyle = "#d11"; // this line is AI generated
    ctx.lineWidth = 2; // this line is AI generated
    ctx.beginPath(); // this line is AI generated
    ctx.moveTo( // this line is AI generated
        mmX + (player.x / tileSize) * minimapTileSize, // this line is AI generated
        mmY + (player.y / tileSize) * minimapTileSize // this line is AI generated
    ); // this line is AI generated
    ctx.lineTo( // this line is AI generated
        mmX + (player.x / tileSize + Math.cos(player.angle) * 0.7) * minimapTileSize, // this line is AI generated
        mmY + (player.y / tileSize + Math.sin(player.angle) * 0.7) * minimapTileSize // this line is AI generated
    ); // this line is AI generated
    ctx.stroke(); // this line is AI generated
    ctx.restore(); // this line is AI generated
} // this line is AI generated
// -------- End Minimap Drawing --------

function render() {
    if (gameState === "PLAYING") {
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

            if (wallTextureReady) {
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
                ctx.fillStyle = `rgb(${shade * 0.2}, ${shade * 0.3}, ${shade * 0.5})`;
                ctx.fillRect(screenX, wallTop, rayStepWidth, ray.wallH);
            }
        }

        // ------- Draw minimap ---------
        drawMinimap(); // this line is AI generated
        // ------------------------------
        const centerX = canvas.width / 2;
        const rightarmX = canvas.width * 0.75;
        const bottom = canvas.height;
        const armSize = 350; // Adjust this to change arm size on screen

        if (armImg.complete) {
            ctx.save();
            ctx.translate(rightarmX, bottom);
            ctx.drawImage(armImg, -armSize / 2, -350, 250, 350);
            ctx.restore();
        }

    } else {
        ctx.fillStyle = "black"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(render);
}
render();