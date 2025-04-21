export let currentScene = 'character_selection';
export let selectedCharacter = null;
export let inventory = [];
export let relationships = {
    siblings: {
        peter: 50,
        susan: 50,
        edmund: 50,
        lucy: 50
    },
    tumnus: 0,
    beaver: 0,
    aslan: 0
};
export let gameProgress = {
    discoveredNarnia: false,
    metTumnus: false,
    metBeaver: false,
    metAslan: false,
    foundLampPost: false,
    foundCairParavel: false
}; 