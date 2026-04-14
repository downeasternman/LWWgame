/**
 * Single source of truth for mutable game state (ES modules safe).
 */
export const gameState = {
    currentScene: 'character_selection',
    selectedCharacter: null,
    /** Item ids; kept in sync with inventorySystem */
    inventory: [],
    relationships: {
        siblings: { peter: 50, susan: 50, edmund: 50, lucy: 50 },
        tumnus: 0,
        beaver: 0,
        aslan: 0,
        witch: 0
    },
    gameProgress: {
        discoveredNarnia: false,
        metTumnus: false,
        metBeaver: false,
        metAslan: false,
        foundLampPost: false,
        foundCairParavel: false,
        defeatedWolves: false,
        receivedChristmasGifts: false,
        witnessedStoneTable: false,
        maugrimDefeated: false,
        edmundHealed: false
    },
    /** none | tempted | betrayed | redeemed */
    edmundPath: 'none',
    secretHesitation: 0,
    forestExploreTurns: 0,
    completedQuestIds: [],
    /** Persisted quest statuses mirror questSystem ids */
    activeQuestId: null
};
