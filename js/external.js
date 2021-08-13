import {showMenu, gameEnded} from "./main.js";

const upperContainerEl = document.querySelector(".upper-container");
const livesDiv = document.querySelector(".lives");
// const upperCanvas = document.querySelector(".upper-canvas");

export let nextWord = ["-", false, "noun"];


export const giveRandomNoun = async () => {
    const jsonData = await fetch("https://random-word-form.herokuapp.com/random/noun");
    const data = await jsonData.json();
    return await data[0];
}

export const giveRandomAnimal = async () => {
    const jsonData = await fetch("https://random-word-form.herokuapp.com/random/animal");
    const data = await jsonData.json();
    return await data[0];
}

export const giveRandomPokemon = async () => {
    const num = Math.floor(Math.random() * 899);
    const jsonData = await fetch(`https://pokeapi.co/api/v2/pokemon/${num}`);
    const data = await jsonData.json();
    return await data.name;
}

export const prepareNextWord = async () => {
    const currentType = game.type;
    switch(currentType){
        case "noun":
            nextWord[0] = await giveRandomNoun();
            break;
        case "animal":
            nextWord[0] = await giveRandomAnimal();
            break;
        case "pokemon":
            nextWord[0] = await giveRandomPokemon();
            break;
        default:
            nextWord = await giveRandomPokemon();
    }
    nextWord[1] = true;
    nextWord[2] = game.type;
}

const generateColorShades = (...baseColor) => {
    const gradientColor1 = `hsl(${parseInt(baseColor[0])}, ${parseInt(baseColor[1])}%, ${baseColor[2]}%)`;
    const gradientColor2 = `hsl(${parseInt(baseColor[0])}, ${parseInt(baseColor[1])}%, ${baseColor[2] + 15}%)`;
    const gradientColor3 = `hsl(${parseInt(baseColor[0])}, ${parseInt(baseColor[1])}%, ${baseColor[2] - 12}%)`;

    return [gradientColor1, gradientColor2, gradientColor3];
}

const generateBackgroundColors = (lives) => {
    const baseColor = [105, 60, 35];
    const finalColor = [0, 82, 35];
    let gradients = [baseColor];
    const hDifference = parseFloat((Math.abs(baseColor[0] - finalColor[0]) / (lives-1) ).toFixed(3));
    const sDifference = parseFloat((Math.abs(baseColor[1] - finalColor[1]) / (lives-1) ).toFixed(3));

    for(let i = 1; i < lives; i++){
        const hValue = parseFloat((parseFloat(gradients[i-1][0])-hDifference).toFixed(3));
        const sValue = parseFloat((parseFloat(gradients[i-1][1])+sDifference).toFixed(3));
        const lValue = baseColor[2];

        gradients.push([hValue, sValue, lValue]);
    }

    return gradients;
}

// function prepareStates() {
//     const colors = generateBackgroundColors(12);
//     // console.log(colors);

//     let colorShades = generateColorShades(colors[0][0], colors[0][1], colors[0][2]);
//     // console.log(colorShades);

//     let states = "{";
//     states += `
//         "default-state": {
//             gradients: [
//                 [${colorShades[0]}, ${colorShades[1]}],
//                 [${colorShades[2]}, ${colorShades[0]}]
//             ],
//             transitionSpeed: 1500,
//             loop: true
//         },`

//     for(let i = 0; i < colors.length; i++){
//         colorShades = generateColorShades(colors[i][0], colors[i][1], colors[i][2]);

//         states += `
//             "state-${i+1}": {
//                 gradients: [
//                     [${colorShades[0]}, ${colorShades[1]}],
//                     [${colorShades[2]}, ${colorShades[0]}]
//                 ],
//                 transitionSpeed: 1500,
//                 loop: true
//             },`
//     }
//     states = states.substring(0, states.length - 1);
//     states += "}";
//     console.log(states);
//     return states;
// }

function prepareStates() {
    const colors = generateBackgroundColors(12);
    // console.log(colors);

    let colorShades = generateColorShades(colors[0][0], colors[0][1], colors[0][2]);
    // console.log(colorShades);
    let tempObject;
    
    tempObject = {
        gradient: [ [colorShades[0], colorShades[1]], [colorShades[2], colorShades[0]] ], 
        transitionSpeed: 1500,
        loop: true
    };

    let states = {
        "default-state": tempObject
    }
    states["state-1"] = tempObject;

    // for(let i = 0; i < colors.length; i++){
    //     colorShades = generateColorShades(colors[i][0], colors[i][1], colors[i][2]);

    //     states += `
    //         "state-${i+1}": {
    //             gradients: [
    //                 [${colorShades[0]}, ${colorShades[1]}],
    //                 [${colorShades[2]}, ${colorShades[0]}]
    //             ],
    //             transitionSpeed: 1500,
    //             loop: true
    //         },`
    // }
    // states = states.substring(0, states.length - 1);
    // console.log(states);
    return states;
}
////////////////////////////

let canvasGradient = new Granim({
    element: ".upper-canvas",
    direction: "diagonal",
    isPausedWhenNotInView: true,
    states: {
        "default-state": {
            gradients: [ 
                ["#942119", "#942119"],  
                ["#942119", "#942119"] 
            ],  
        }
    }
});


export let game = {
    totalLives: 12,
    currentLives: 12,
    difficulty: 2,
    hasStarted: 0,
    remainingLetters: 0,
    type: "noun",
    colors: generateBackgroundColors(12),
    decreaseLives: () => {
        if((game.currentLives-1) <= 0) {
            game.currentLives = 0;
            livesDiv.textContent = `lives: 0`;
            setTimeout(() => game.hasStarted = 0, 1000);
            gameEnded();
        } else {
            game.currentLives--;
            livesDiv.textContent = `${game.currentLives}`;
        }
    },
    decreaseLetters: () => {
        game.remainingLetters--;

        if(game.remainingLetters <= 0){
            game.remainingLetters = 0;
            setTimeout(() => game.hasStarted = 0, 1000);
            gameEnded();
        }
    },
    changeDifficulty: (nr= 1) => {
        if(nr === 1 || nr < 1 || nr === "easy"){
            game.totalLives = 12;
            game.currentLives = game.totalLives;
            game.difficulty = 1;
        } else if (nr === 2 || nr === "normal") {
            game.totalLives = 9;
            game.currentLives = game.totalLives;
            game.difficulty = 2;
        } else {
            game.totalLives = 6;
            game.currentLives = game.totalLives;
            game.difficulty = 3;
        }

        game.colors = generateBackgroundColors(game.totalLives);
    },
    changeBackgroundColor: (nr) => {
        if(!(game.totalLives-nr < game.totalLives)) return;

        // upperContainerEl.style.backgroundColor = 
        // `hsl(${game.colors[game.totalLives-nr][0]}, 
        //     ${game.colors[game.totalLives-nr][1]}%, 
        //     ${game.colors[game.totalLives-nr][2]}%)`;

        const gradientColor = generateColorShades(
            game.colors[game.totalLives-nr][0],
            game.colors[game.totalLives-nr][1],
            game.colors[game.totalLives-nr][2]
        )
            
        console.log(canvasGradient.states);
    }
}