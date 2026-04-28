const canvas= document.getElementById("game");
const ctx = canvas.getContext("2d");

const map = [
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1],
[1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,1],
[1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,1],
[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1],
[1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1],
[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1],
[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1],
[1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,1],
[1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,1],
[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1],
[1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1],
[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1],
[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1],
[1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,1],
[1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,1],
[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1],
[1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const FOV = Math.PI/4;
const wallh = 600;
const tileSize = 2;
const moveSpeed = 0.015; 
const turnSpeed = 0.01; 
const playerRadius = 0.20;
const rayStepWidth = 2;
const numRays = Math.floor(canvas.width / rayStepWidth);
const player = {x: 3, y: 3, angle: 0};
const gameState = "PLAYING";
const zBuffer = new Array(numRays).fill(0);
const wallTexture = new Image();
let wallTextureReady = false;

wallTexture.onload = () => {
    wallTextureReady = true;
};
wallTexture.src = "wall.png"
const slime = 'slime.mp3'.play()
const breath =  'breath.mp3'.play()


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

    } else {
        ctx.fillStyle = "black"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(render);
}
render();