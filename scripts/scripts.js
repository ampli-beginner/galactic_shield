const defaultCount = 20;
const ufosCount = 10;
let shootCount = defaultCount;
let translateX = 0;
let translateY = 0;
let maxMove = window.screen.width / 2 - 200;

let containerX = 10;
let containerY = 0;
let destroyed = 0;

let moving;

function handleKeyPress(event) {
    let img = document.getElementById("ship");
    let key = event.key;

    if(key === "ArrowLeft") {
        if(translateX > -maxMove) {
            translateX = translateX - 10;
        }
        img.style.transform = `translate(${translateX}px, ${translateY}px)`;
    }
    else if(key === "ArrowRight") {
        if(translateX < maxMove) {
            translateX = translateX + 10;
        }
        img.style.transform = `translate(${translateX}px, ${translateY}px)`;
    }
    else if(key === " ") {
        if(shootCount > 0) {
            shootCount = shootCount - 1;
            shot();
        }
        else {
            alert("You are out of shoots");
        }
    }
}

function startGame() {
    let button = document.getElementById("startButton");
    button.style.display = "none";

    let img = document.getElementById("ship");
    translateY += 350;
    img.style.transform = "translateY(" + translateY + "px)";

    const imageNames = ["ufo1.png", "ufo2.png", "ufo3.png"];
    const imageContainer = document.getElementById("imageContainer");
    let imageId = 0;
    for(let i = 0; i < ufosCount; i++) {
        const image = document.createElement("img");
        const imageName = imageNames[imageId];
        image.src = imageName;
        image.className = "ufo";
        imageContainer.appendChild(image);

        imageId++;
        if(imageId == 3) {
            imageId = 0;
        }
    }

    moving = setInterval(function() {
        containerY += 5;
        containerX *= -1;
        imageContainer.style.transform = `translate(${containerX}px,${containerY}px)`;

        const divRect = imageContainer.getBoundingClientRect();
        const shipRect = ship.getBoundingClientRect();

        if(divRect.bottom > shipRect.top) {
            resetGame("The game is over!")
        }
    }, 1000 / 4);

    window.addEventListener("keydown", handleKeyPress);
}

function shot() {
    const splashContainer = document.getElementById("splashContainer");
    const imageContainer = document.getElementById("imageContainer");
    const ship = document.getElementById("ship");

    let splash = document.createElement("div");
    splash.className = "splash";
    splash.style.left = window.screen.width / 2 + translateX + "px";
    splash.style.bottom = 200 + "px";
    splashContainer.appendChild(splash);

    const movingInterval = setInterval(function() {
        for(let i = 0; i < imageContainer.children.length; i++) {
            const childElement = imageContainer.children[i];
            if(childElement.style.visibility == "hidden")
                continue;

            const divRect = childElement.getBoundingClientRect();
            const splashRect = splash.getBoundingClientRect();

            if(divRect.right >= splashRect.right 
                && divRect.left <= splashRect.left
                && splashRect.top < divRect.bottom) {
                    clearInterval(movingInterval);
                    splashContainer.removeChild(splash);
                    childElement.style.visibility = "hidden";
                    destroyed++;
                    if(destroyed == ufosCount) {
                        resetGame("You are the Winner!");
                    }
                    break;
                }
        }

        const splashPositionY = parseFloat(getComputedStyle(splash).bottom);
        const step = 10;

        if(splashPositionY >= window.innerHeight) {
            clearInterval(movingInterval);
            splashContainer.removeChild(splash);            
        }
        else {
            splash.style.bottom = splashPositionY + step + "px";
        }
    }, 1000 / 60);

}

function resetGame(message) {
    alert(message);

    clearInterval(moving);
    
    let button = document.getElementById("startButton");
    button.style.display = "block";

    translateX = 0;
    translateY = 0;
    containerX = 10;
    containerY = 0;
    destroyed = 0;

    shootCount = defaultCount;
    
    ship.style.transform = "translate(0px, 0px)";
    imageContainer.style.transform = "translate(0px, 0px)";
    imageContainer.innerHTML = "";
}