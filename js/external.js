const upperContainerEl = document.querySelector(".upper-container");

export const giveRandomNoun = async () => {
    const jsonData = await fetch("https://random-word-form.herokuapp.com/random/noun");
    // const jsonData = await fetch("https://random-words-api.vercel.app/word");
    const data = await jsonData.json();
    // console.log(data[0]);
    return await data[0];
}


export const giveRandomAnimal = async () => {
    const jsonData = await fetch("https://random-word-form.herokuapp.com/random/animal");
    const data = await jsonData.json();
    // console.log(data[0]);
    return await data[0];
}

export const giveRandomPokemon = async () => {
    const num = Math.floor(Math.random() * 899);
    const jsonData = await fetch(`https://pokeapi.co/api/v2/pokemon/${num}`);
    const data = await jsonData.json();
    // console.log(data.name);
    return await data.name;
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

export let game = {
    totalLives: 12,
    currentLives: 12,
    difficulty: 1,
    hasStarted: 0,
    remainingLetters: 0,
    Type: "noun",
    // currentType: game.types[0],
    colors: generateBackgroundColors(12),
    decreaseLives: () => {
        if((game.currentLives-1) <= 0) {
            game.currentLives = 0;
            game.hasStarted = 0;
        } else game.currentLives--;
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

        upperContainerEl.style.backgroundColor = 
        `hsl(${game.colors[game.totalLives-nr][0]}, 
            ${game.colors[game.totalLives-nr][1]}%, 
            ${game.colors[game.totalLives-nr][2]}%)`;
    }
}

