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
    siblingsBelieve: false,
    edmundLied: false,
    tumnusSafe: false,
    /** Shown once on the next scene render, then cleared */
    lastChoiceResult: null
};

/**
 * Ending thresholds (v1):
 * - ending_joyous: high-trust / mercy path
 * - ending_hollow: Witch residue / abandoned allies / unredeemed betrayal
 * - ending_bittersweet: default victory with scars
 */
export function resolveEndingId() {
    const rel = gameState.relationships;
    const id = gameState.selectedCharacter;

    if (id === 'edmund') {
        // Witch residue / cold mercy: victory without warmth
        if (rel.witch >= 20 && rel.aslan < 10) {
            return 'ending_hollow';
        }
        if (gameState.edmundPath === 'betrayed' && rel.aslan < 8) {
            return 'ending_hollow';
        }
        if (
            (gameState.edmundPath === 'redeemed' || gameState.edmundPath === 'none') &&
            rel.aslan >= 10 &&
            !gameState.edmundLied
        ) {
            return 'ending_joyous';
        }
        if (gameState.edmundPath === 'redeemed' && rel.aslan >= 8 && rel.witch < 15) {
            return 'ending_joyous';
        }
        return 'ending_bittersweet';
    }

    // Lucy
    if (gameState.tumnusSafe && gameState.siblingsBelieve && rel.aslan >= 5) {
        return 'ending_joyous';
    }
    if (gameState.siblingsBelieve && rel.tumnus >= 30) {
        return 'ending_joyous';
    }
    // Abandoned Tumnus / never built trust, and siblings never believed
    if (!gameState.tumnusSafe && rel.tumnus < 20 && !gameState.siblingsBelieve) {
        return 'ending_hollow';
    }
    if (!gameState.gameProgress.metTumnus && !gameState.siblingsBelieve) {
        return 'ending_hollow';
    }
    return 'ending_bittersweet';
}
