import { characters } from './characters.js';
import { gameState } from './game_state.js';
import {
    additionalScenes,
    inventorySystem,
    characterStats,
    questSystem,
    initSystems,
    applyAbilityBonus,
    runStatCheck,
    resetCharacterStats
} from './additional_scenes.js';

const SAVE_KEY = 'lww_game_save_v1';

function persistSave() {
    try {
        const data = {
            currentScene: gameState.currentScene,
            selectedCharacter: gameState.selectedCharacter,
            inventory: [...gameState.inventory],
            relationships: JSON.parse(JSON.stringify(gameState.relationships)),
            gameProgress: { ...gameState.gameProgress },
            edmundPath: gameState.edmundPath,
            completedQuestIds: [...gameState.completedQuestIds],
            secretHesitation: gameState.secretHesitation,
            forestExploreTurns: gameState.forestExploreTurns
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (_) {
        /* ignore */
    }
}

function loadSave() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        gameState.currentScene = data.currentScene || gameState.currentScene;
        gameState.selectedCharacter = data.selectedCharacter ?? null;
        gameState.inventory.length = 0;
        (data.inventory || []).forEach((id) => inventorySystem.addItem(id));
        if (data.relationships) Object.assign(gameState.relationships, data.relationships);
        if (data.gameProgress) Object.assign(gameState.gameProgress, data.gameProgress);
        gameState.edmundPath = data.edmundPath || 'none';
        gameState.completedQuestIds = data.completedQuestIds || [];
        gameState.secretHesitation = data.secretHesitation || 0;
        gameState.forestExploreTurns = data.forestExploreTurns || 0;
        for (const qid of gameState.completedQuestIds) {
            const q = questSystem.quests.main[qid] || questSystem.quests.side[qid];
            if (q) q.status = 'completed';
        }
        if (questSystem.quests.main.defeatWitch) {
            if (gameState.completedQuestIds.includes('defeatWitch')) {
                questSystem.quests.main.defeatWitch.status = 'completed';
            } else if (gameState.completedQuestIds.includes('meetAslan')) {
                questSystem.quests.main.defeatWitch.status = 'available';
            }
        }
    } catch (_) {
        /* ignore */
    }
}

function resetQuestStatuses() {
    questSystem.quests.main.meetAslan.status = 'available';
    questSystem.quests.main.defeatWitch.status = 'locked';
    questSystem.quests.side.helpBeavers.status = 'available';
}

function resetStory() {
    gameState.selectedCharacter = null;
    gameState.inventory.length = 0;
    gameState.relationships.tumnus = 0;
    gameState.relationships.beaver = 0;
    gameState.relationships.aslan = 0;
    gameState.relationships.witch = 0;
    gameState.relationships.siblings.peter = 50;
    gameState.relationships.siblings.susan = 50;
    gameState.relationships.siblings.edmund = 50;
    gameState.relationships.siblings.lucy = 50;
    Object.assign(gameState.gameProgress, {
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
    });
    gameState.edmundPath = 'none';
    gameState.completedQuestIds.length = 0;
    gameState.secretHesitation = 0;
    gameState.forestExploreTurns = 0;
    gameState.currentScene = 'character_selection';
    resetCharacterStats();
    resetQuestStatuses();
    try {
        localStorage.removeItem(SAVE_KEY);
    } catch (_) {
        /* ignore */
    }
}

function refreshHUD() {
    const el = document.getElementById('game-hud');
    if (!el) return;
    const id = gameState.selectedCharacter;
    const inv = gameState.inventory.length ? gameState.inventory.join(', ') : '—';
    const rel = `Tumnus ${gameState.relationships.tumnus} · Beavers ${gameState.relationships.beaver} · Aslan ${gameState.relationships.aslan}`;
    const prog = Object.entries(gameState.gameProgress)
        .filter(([, v]) => v === true)
        .map(([k]) => k)
        .slice(0, 6)
        .join(', ');
    const q = questSystem.getAvailableQuests().map((q) => q.title).slice(0, 2).join('; ') || '—';
    el.innerHTML = `<div class="hud-row"><strong>Character:</strong> ${id ? characters[id].name : '—'}</div>
    <div class="hud-row"><strong>Inventory:</strong> ${inv}</div>
    <div class="hud-row"><strong>Relations:</strong> ${rel}</div>
    <div class="hud-row"><strong>Milestones:</strong> ${prog || '—'}</div>
    <div class="hud-row"><strong>Open quests:</strong> ${q}</div>
    ${gameState.edmundPath !== 'none' ? `<div class="hud-row"><strong>Edmund arc:</strong> ${gameState.edmundPath}</div>` : ''}`;
}

initSystems();
loadSave();

document.getElementById('btn-save')?.addEventListener('click', () => {
    persistSave();
    refreshHUD();
});
document.getElementById('btn-load')?.addEventListener('click', () => {
    loadSave();
    updateScene();
});
document.getElementById('btn-reset')?.addEventListener('click', () => {
    if (window.confirm('Start a new story? Unsaved progress will be lost.')) {
        resetStory();
        updateScene();
    }
});

const chessContainer = document.getElementById('chess-container');
const chessBoard = document.getElementById('chess-board');
const closeChessButton = document.getElementById('close-chess');

// Add this event listener after the game initialization
closeChessButton.addEventListener('click', () => {
    chessContainer.classList.add('hidden');
    // Clear the chess board
    chessBoard.innerHTML = '';
});

// Story scenes
const scenes = {
    character_selection: {
        text: "Choose your character to begin the adventure:",
        choices: Object.entries(characters).map(([key, char]) => ({
            text: `${char.name}: ${char.description}\nTraits: ${char.traits.join(", ")}\nSpecial Ability: ${char.specialAbility}`,
            nextScene: "start",
            onSelect: () => {
                gameState.selectedCharacter = key;
                return `You have chosen to be ${char.name}. ${char.description}`;
            }
        }))
    },
    start: {
        text: function() {
            if (!gameState.selectedCharacter || !characters[gameState.selectedCharacter]) {
                return "Please select a character to begin your adventure.";
            }
            const char = characters[gameState.selectedCharacter];
            return `You are ${char.name} Pevensie, ${char.description.toLowerCase()} You and your siblings have been sent to live with Professor Kirke in his mysterious country house during World War II. One rainy day, while exploring the house, you discover a spare room with nothing in it but a large wardrobe...`;
        },
        choices: [
            {
                text: "Open the wardrobe and step inside",
                nextScene: "wardrobe",
                onSelect: () => {
                    gameState.gameProgress.discoveredNarnia = true;
                    return "You step into the wardrobe, feeling the soft fur coats brush against your skin...";
                }
            },
            {
                text: "Leave the room and continue exploring the house",
                nextScene: "explore_house",
                onSelect: () => {
                    return "You decide to explore more of the Professor's mysterious house...";
                }
            }
        ]
    },
    wardrobe: {
        text: function() {
            const char = characters[gameState.selectedCharacter];
            return `As you step into the wardrobe, you feel something strange. The coats seem to be getting thicker and softer. You push further in, and suddenly you find yourself standing in a snowy forest. The air is crisp and cold, and you can see your breath in front of you. In the distance, you notice a lamppost glowing in the middle of the woods. ${char.name === 'lucy' ? 'Your heart races with excitement at this magical discovery.' : 'You can hardly believe what you\'re seeing.'}`;
        },
        choices: function () {
            const base = [
                {
                    text: 'Approach the lamppost',
                    nextScene: 'lamppost',
                    onSelect: () => {
                        gameState.gameProgress.foundLampPost = true;
                        return 'You walk towards the mysterious lamppost, your footsteps crunching in the snow...';
                    }
                },
                {
                    text: 'Explore the surrounding forest',
                    nextScene: 'forest_explore',
                    onSelect: () => {
                        return 'You decide to explore the magical forest around you...';
                    }
                }
            ];
            if (gameState.selectedCharacter === 'edmund' && gameState.edmundPath === 'none') {
                base.push({
                    text: 'Wander off toward movement in the trees (you smell something sweet)',
                    nextScene: 'edmund_temptation_start',
                    onSelect: () => {
                        return 'Pride and hunger pull you sideways, away from the lamppost light.';
                    }
                });
            }
            return base;
        }
    },
    lamppost: {
        text: function() {
            const char = characters[gameState.selectedCharacter];
            return `As you approach the lamppost, you hear a rustling in the bushes. A small figure emerges - it's a faun! He introduces himself as Mr. Tumnus and invites you to his home for tea. ${char.name === 'lucy' ? 'You feel an immediate connection with this kind creature.' : 'You\'re cautious but intrigued by this strange being.'}`;
        },
        choices: [
            {
                text: "Accept Mr. Tumnus's invitation",
                nextScene: "tea_with_tumnus",
                onSelect: () => {
                    gameState.gameProgress.metTumnus = true;
                    gameState.relationships.tumnus += 20;
                    return "You follow Mr. Tumnus through the snowy forest to his cozy home...";
                }
            },
            {
                text: "Politely decline and explore further",
                nextScene: "forest_explore",
                onSelect: () => {
                    return "You thank Mr. Tumnus but decide to continue your exploration...";
                }
            }
        ]
    },
    tea_with_tumnus: {
        text: function() {
            const char = characters[gameState.selectedCharacter];
            return `Mr. Tumnus's home is cozy and warm. As you enjoy tea and toast, he tells you about Narnia and the White Witch who has made it always winter but never Christmas. ${char.name === 'lucy' ? 'You listen with wide-eyed wonder.' : 'You try to process this incredible information.'} Suddenly, he begins to cry, confessing that he was supposed to capture you for the White Witch!`;
        },
        choices: [
            {
                text: "Forgive Mr. Tumnus and promise to keep his secret",
                nextScene: "tumnus_friendship",
                onSelect: () => {
                    gameState.relationships.tumnus += 30;
                    return "You show compassion to Mr. Tumnus, understanding his difficult position...";
                }
            },
            {
                text: "Run back to the wardrobe",
                nextScene: "escape_tumnus",
                onSelect: () => {
                    gameState.relationships.tumnus -= 20;
                    return "You quickly make your way back through the snowy forest...";
                }
            }
        ]
    },
    tumnus_friendship: {
        text: function() {
            const char = characters[gameState.selectedCharacter];
            return `Mr. Tumnus is deeply moved by your forgiveness. He promises to help you and your siblings in the future. ${char.name === 'lucy' ? 'You feel a strong bond forming with this kind faun.' : 'You appreciate his honesty and courage.'} As you prepare to leave, he gives you a small token of friendship - a carved wooden figure of a lion.`;
        },
        choices: [
            {
                text: "Return to the Professor's house",
                nextScene: "return_to_house",
                onSelect: () => {
                    inventorySystem.addItem('wooden_lion');
                    return "You make your way back through the wardrobe...";
                }
            },
            {
                text: "Ask Mr. Tumnus to show you more of Narnia",
                nextScene: "narnia_tour",
                onSelect: () => {
                    return "Mr. Tumnus agrees to show you some of the wonders of Narnia...";
                }
            }
        ]
    },
    explore_house: {
        text: "You decide to continue exploring the house. In the next room, you find a collection of old books and a chess set. The rain continues to patter against the windows.",
        choices: [
            {
                text: "Play a game of chess",
                nextScene: "chess"
            },
            {
                text: "Return to the wardrobe room",
                nextScene: "start"
            }
        ]
    },
    forest_explore: {
        text: function () {
            gameState.forestExploreTurns += 1;
            if (gameState.forestExploreTurns >= 3) {
                return 'The wood cannot confuse you forever: you spot the lamppost again—a fixed point in a shifting world.';
            }
            return 'You explore the magical forest. The trees are tall; the air is cold and clean. Somewhere, a bird calls.';
        },
        choices: function () {
            const out = [];
            if (gameState.forestExploreTurns >= 3) {
                out.push({
                    text: 'Go toward the lamppost',
                    nextScene: 'lamppost',
                    onSelect: () => {
                        gameState.gameProgress.foundLampPost = true;
                        return 'Your boots find a path you did not notice before.';
                    }
                });
            }
            out.push({
                text: 'Keep exploring',
                nextScene: 'forest_explore',
                onSelect: () => {
                    return 'Snow crunches; branches scrape your sleeve.';
                }
            });
            out.push({
                text: 'Head back toward the wardrobe',
                nextScene: 'wardrobe',
                onSelect: () => {
                    gameState.forestExploreTurns = 0;
                    return 'You retrace your steps until the wardrobe’s dark mouth opens before you.';
                }
            });
            return out;
        }
    },
    chess: {
        text: "You sit down at the chess set. Would you like to play a game?",
        choices: [
            {
                text: "Play a quick game on Lichess",
                nextScene: "chess",
                action: () => {
                    chessContainer.classList.remove('hidden');
                    // Initialize a new game
                    const gameId = Math.random().toString(36).substring(2, 15);
                    chessBoard.innerHTML = '<iframe src="https://lichess.org/embed/' + gameId + '?theme=auto&bg=auto" width="600" height="397" frameborder="0"></iframe>';
                    return "The chess board appears before you. Play a game or return when you're done!";
                }
            },
            {
                text: "Return to exploring",
                nextScene: "explore_house"
            }
        ]
    },
    return_to_house: {
        text: "You make your way back through the wardrobe and find yourself in the spare room again. The wardrobe looks perfectly ordinary now.",
        choices: [
            {
                text: "Tell your siblings about your adventure",
                nextScene: "siblings"
            },
            {
                text: "Keep it to yourself for now",
                nextScene: "secret"
            }
        ]
    },
    secret: {
        text: function () {
            gameState.secretHesitation += 1;
            if (gameState.secretHesitation >= 2) {
                return 'You cannot swallow wonder forever. The spare room seems smaller; the wardrobe larger.';
            }
            return "You decide to keep your adventure to yourself for now. It's still early days, and you're not sure what to make of it all.";
        },
        choices: function () {
            if (gameState.secretHesitation >= 2) {
                return [
                    {
                        text: 'Tell your siblings—now',
                        nextScene: 'siblings',
                        onSelect: () => {
                            gameState.secretHesitation = 0;
                            return 'You gather them—words tumbling, then steadying.';
                        }
                    }
                ];
            }
            return [
                {
                    text: 'Tell your siblings about your adventure',
                    nextScene: 'siblings',
                    onSelect: () => {
                        gameState.secretHesitation = 0;
                        return 'You gather them—words tumbling, then steadying.';
                    }
                },
                {
                    text: 'Go downstairs and clear your head',
                    nextScene: 'explore_house',
                    onSelect: () => {
                        return 'The house is full of ordinary sounds; Narnia still burns behind your eyes.';
                    }
                }
            ];
        }
    },
    siblings: {
        text: function() {
            const char = characters[gameState.selectedCharacter];
            return `You gather your siblings and tell them about your incredible adventure. ${char.name === 'peter' ? 'As the eldest, you take charge of the situation.' : char.name === 'susan' ? 'You try to explain everything logically.' : char.name === 'edmund' ? "You're skeptical but intrigued." : "You're excited to share your discovery."}`;
        },
        choices: [
            {
                text: "Lead your siblings to the wardrobe",
                nextScene: "group_wardrobe"
            },
            {
                text: "Wait until tomorrow to show them",
                nextScene: "next_day"
            }
        ]
    },
    group_wardrobe: {
        text: "You lead your siblings to the wardrobe room. They look at you skeptically as you open the wardrobe door...",
        choices: [
            {
                text: "Step inside first to show them it's safe",
                nextScene: "group_narnia"
            },
            {
                text: "Let one of your siblings go first",
                nextScene: "sibling_first"
            }
        ]
    },
    group_narnia: {
        text: "You lead your siblings into the wardrobe and step into Narnia. The wardrobe door closes behind you, and you find yourself in a snowy forest. The air is crisp and cold, and you can see your breath in front of you. In the distance, you notice a lamppost glowing in the middle of the woods.",
        choices: [
            {
                text: "Approach the lamppost",
                nextScene: "lamppost"
            },
            {
                text: "Turn back to the wardrobe",
                nextScene: "return"
            }
        ]
    },
    sibling_first: {
        text: "You let one of your siblings go first. They step into the wardrobe and you follow them into Narnia. The wardrobe door closes behind you, and you find yourself in a snowy forest. The air is crisp and cold, and you can see your breath in front of you. In the distance, you notice a lamppost glowing in the middle of the woods.",
        choices: [
            {
                text: "Approach the lamppost",
                nextScene: "lamppost"
            },
            {
                text: "Turn back to the wardrobe",
                nextScene: "return"
            }
        ]
    },
    next_day: {
        text: "You decide to wait until tomorrow to show your siblings about your adventure. It's still early days, and you're not sure what to make of it all.",
        choices: [
            {
                text: "Tell your siblings about your adventure",
                nextScene: "siblings"
            },
            {
                text: "Keep it to yourself for now",
                nextScene: "secret"
            }
        ]
    },
    escape_tumnus: {
        text: "You quickly run back through the snowy forest, your heart pounding. As you reach the wardrobe, you glance back to see Mr. Tumnus watching you sadly from a distance...",
        choices: [
            {
                text: "Step back into the wardrobe",
                nextScene: "return"
            }
        ]
    },
    narnia_tour: {
        text: function() {
            const char = characters[gameState.selectedCharacter];
            return `Mr. Tumnus shows you some of the wonders of Narnia. You see the beauty of the land and the kindness of its people. ${char.name === 'lucy' ? 'Your heart swells with joy at the magic around you.' : 'You\'re amazed by the beauty of this land.'} As you walk, you notice a small house by a frozen river.`;
        },
        choices: [
            {
                text: "Investigate the house by the river",
                nextScene: "beavers_house",
                onSelect: () => {
                    gameState.gameProgress.metBeaver = true;
                    return "You approach the cozy-looking house by the frozen river...";
                }
            },
            {
                text: "Continue exploring with Mr. Tumnus",
                nextScene: "narnia_explore",
                onSelect: () => {
                    gameState.relationships.tumnus += 10;
                    return "You and Mr. Tumnus continue your exploration of Narnia...";
                }
            }
        ]
    },
    beavers_house: {
        text: function() {
            const char = characters[gameState.selectedCharacter];
            return `As you approach the house, a kind-looking beaver pokes his head out. "Hello there!" he says cheerfully. "I'm Mr. Beaver, and this is my wife, Mrs. Beaver." They invite you inside for a warm meal. ${char.name === 'lucy' ? 'You immediately feel at home with these friendly creatures.' : 'You\'re cautious but intrigued by these talking animals.'}`;
        },
        choices: [
            {
                text: "Accept their invitation",
                nextScene: "beavers_story",
                onSelect: () => {
                    gameState.relationships.beaver += 20;
                    return "You step inside the cozy beaver home...";
                }
            },
            {
                text: "Ask about the White Witch",
                nextScene: "witch_info",
                onSelect: () => {
                    return "The Beavers look around nervously before speaking...";
                }
            }
        ]
    },
    beavers_story: {
        text: function() {
            const char = characters[gameState.selectedCharacter];
            const prophecy = `Mr. Beaver leans close. "They say—when Adam's flesh and Adam's bone sits at Cair Paravel in throne, the evil time will be over and done." Mrs. Beaver shushes him gently, eyes on the window.`;
            return `Over a warm meal, the Beavers tell you about Aslan, the true king of Narnia, and how he's returning to defeat the White Witch. ${prophecy} ${char.name === 'peter' ? 'You feel a sense of responsibility to help.' : char.name === 'susan' ? 'You\'re skeptical but intrigued.' : char.name === 'edmund' ? 'You\'re not sure what to believe.' : 'You believe in Aslan with all your heart.'}`;
        },
        choices: function () {
            const arr = [
                {
                    text: 'Ask to meet Aslan',
                    nextScene: 'journey_to_aslan',
                    onSelect: () => {
                        const hb = questSystem.quests.side.helpBeavers;
                        if (hb && hb.status === 'available') {
                            questSystem.startQuest('helpBeavers');
                            questSystem.completeQuest('helpBeavers');
                        }
                        gameState.gameProgress.metAslan = true;
                        return 'The Beavers agree to take you toward Aslan’s camp...';
                    }
                },
                {
                    text: 'Return to tell your siblings',
                    nextScene: 'return_with_news',
                    onSelect: () => {
                        return 'You thank the Beavers and head back to the wardrobe...';
                    }
                }
            ];
            if (gameState.selectedCharacter === 'edmund' && gameState.edmundPath === 'tempted') {
                arr.push({
                    text: 'Slip out when the others sleep—you know what you mean to do',
                    nextScene: 'edmund_betrayal_night',
                    onSelect: () => {
                        return 'The fire dies to embers. Your shame and craving argue in whispers.';
                    }
                });
            }
            return arr;
        }
    },
    journey_to_aslan: {
        text: function() {
            const char = characters[gameState.selectedCharacter];
            return `The journey to Aslan's camp is long and dangerous. You must avoid the White Witch's patrols and cross frozen rivers. ${char.name === 'peter' ? 'You take charge of the group, ensuring everyone stays safe.' : char.name === 'susan' ? 'You use your wisdom to help navigate the dangers.' : char.name === 'edmund' ? 'You struggle with doubts but keep going.' : 'Your faith keeps you going through the difficult journey.'}`;
        },
        choices: [
            {
                text: "Continue the journey",
                nextScene: "aslans_camp",
                onSelect: () => {
                    return "You press on through the snow...";
                }
            },
            {
                text: "Take a shortcut through the woods",
                nextScene: "shortcut_danger",
                onSelect: () => {
                    return "You decide to take a riskier path...";
                }
            }
        ]
    },
    shortcut_danger: {
        text: function() {
            const char = characters[gameState.selectedCharacter];
            return `As you take the shortcut through the woods, you encounter a group of the White Witch's wolves! ${char.name === 'peter' ? 'You quickly organize a defense.' : char.name === 'susan' ? 'You look for a way to outsmart them.' : char.name === 'edmund' ? 'You consider running away.' : 'You stand your ground bravely.'}`;
        },
        choices: [
            {
                text: "Fight the wolves",
                nextScene: "wolf_battle",
                onSelect: () => {
                    return "You prepare to face the wolves...";
                }
            },
            {
                text: "Try to sneak past them",
                nextScene: "sneak_past",
                onSelect: () => {
                    return "You attempt to move quietly through the trees...";
                }
            }
        ]
    },
    wolf_battle: {
        text: function() {
            const char = characters[gameState.selectedCharacter];
            const lead = applyAbilityBonus('leadership');
            const extra = lead ? ' Your voice steadies others—your leadership cuts through fear.' : '';
            return `The battle with the wolves is fierce! ${char.name === 'peter' ? 'You lead the charge against them.' : char.name === 'susan' ? 'You use your bow to keep them at bay.' : char.name === 'edmund' ? 'You fight with determination.' : 'You defend your siblings bravely.'}${extra}`;
        },
        choices: [
            {
                text: "Continue to Aslan's camp",
                nextScene: "aslans_camp",
                onSelect: () => {
                    gameState.gameProgress.defeatedWolves = true;
                    if (applyAbilityBonus('leadership')) {
                        gameState.relationships.aslan += 3;
                    }
                    return "After defeating the wolves, you continue your journey...";
                }
            }
        ]
    },
    sneak_past: {
        text: function() {
            const id = gameState.selectedCharacter;
            const char = characters[id];
            const stat = char && char.abilityStat === 'stealth' ? 'stealth' : 'courage';
            const ok = runStatCheck(stat, 8);
            if (!ok) {
                characterStats.takeDamage(id, 12);
                return `A wolf’s ear twitches toward you. You bolt, branches clawing at your coat—${char.name === 'edmund' ? 'you escape, shaking, more ashamed than hurt.' : 'you escape, breathless, with new bruises to show for it.'}`;
            }
            return `You manage to sneak past the wolves undetected. ${char.name === 'peter' ? 'You guide your siblings safely through.' : char.name === 'susan' ? 'Your careful planning pays off.' : char.name === 'edmund' ? 'You feel relieved to have avoided a fight.' : 'You\'re proud of your stealth skills.'}`;
        },
        choices: [
            {
                text: "Continue to Aslan's camp",
                nextScene: "aslans_camp",
                onSelect: () => {
                    return "You continue your journey to Aslan's camp...";
                }
            }
        ]
    },
    aslans_camp: {
        text: function() {
            const char = characters[gameState.selectedCharacter];
            return `You finally reach Aslan's camp. The great lion himself welcomes you. ${char.name === 'peter' ? 'You feel a deep sense of responsibility.' : char.name === 'susan' ? 'You\'re in awe of his wisdom.' : char.name === 'edmund' ? 'You feel both fear and hope.' : 'You feel pure joy at meeting the great lion.'}`;
        },
        choices: function () {
            const base = [
                {
                    text: 'Ask about the prophecy and what must be done',
                    nextScene: 'prophecy_reveal',
                    onSelect: () => {
                        if (!gameState.completedQuestIds.includes('meetAslan')) {
                            if (questSystem.startQuest('meetAslan')) {
                                questSystem.completeQuest('meetAslan');
                            }
                        }
                        gameState.relationships.aslan += 5;
                        return 'Aslan speaks of the prophecy and of a deeper magic.';
                    }
                }
            ];
            if (gameState.gameProgress.witnessedStoneTable) {
                base.push({
                    text: 'Skip ahead to battle plans (you have walked this road before)',
                    nextScene: 'battle_preparation',
                    onSelect: () => {
                        return 'You already know the shape of the cost.';
                    }
                });
            }
            return base;
        }
    },
    battle_preparation: {
        text: function() {
            const char = characters[gameState.selectedCharacter];
            return `Aslan and his army prepare for the final battle against the White Witch. ${char.name === 'peter' ? 'You\'re given command of a unit.' : char.name === 'susan' ? 'You\'re assigned to the archers.' : char.name === 'edmund' ? 'You\'re given a special mission.' : 'You help tend to the wounded.'}`;
        },
        choices: [
            {
                text: "Lead the charge",
                nextScene: "final_battle",
                onSelect: () => {
                    return "You prepare to face the White Witch's army...";
                }
            },
            {
                text: "Support from the rear",
                nextScene: "battle_support",
                onSelect: () => {
                    return "You take up a supporting position...";
                }
            }
        ]
    },
    final_battle: {
        text: function() {
            const char = characters[gameState.selectedCharacter];
            let cordial = '';
            if (
                gameState.selectedCharacter === 'lucy' &&
                inventorySystem.hasItem('cordial') &&
                gameState.edmundPath === 'betrayed'
            ) {
                inventorySystem.removeItem('cordial');
                gameState.gameProgress.edmundHealed = true;
                characterStats.heal('edmund', 40);
                cordial =
                    ' Edmund falls gasping; you are there at once with the cordial—one drop, then another—until color returns. ';
            }
            if (!gameState.completedQuestIds.includes('defeatWitch')) {
                const started = questSystem.startQuest('defeatWitch');
                if (started) {
                    questSystem.completeQuest('defeatWitch');
                } else {
                    gameState.completedQuestIds.push('defeatWitch');
                }
            }
            return `The battle is fierce, but with Aslan's help, you emerge victorious. The White Witch is defeated, and spring returns to Narnia.${cordial}${char.name === 'peter' ? 'Your leadership was crucial to the victory.' : char.name === 'susan' ? 'Your wisdom guided many to safety.' : char.name === 'edmund' ? 'Your redemption is complete.' : 'Your faith inspired others.'}`;
        },
        choices: [
            {
                text: "Attend the coronation",
                nextScene: "coronation",
                onSelect: () => {
                    return "You prepare for your coronation as a king/queen of Narnia...";
                }
            },
            {
                text: "Explore the newly freed Narnia",
                nextScene: "spring_exploration",
                onSelect: () => {
                    return "You set out to see Narnia in spring...";
                }
            }
        ]
    },
    coronation: {
        text: function() {
            const char = characters[gameState.selectedCharacter];
            return `At Cair Paravel, you and your siblings are crowned as the Kings and Queens of Narnia. ${char.name === 'peter' ? 'You are crowned High King Peter the Magnificent.' : char.name === 'susan' ? 'You are crowned Queen Susan the Gentle.' : char.name === 'edmund' ? 'You are crowned King Edmund the Just.' : 'You are crowned Queen Lucy the Valiant.'}`;
        },
        choices: [
            {
                text: "Begin your reign",
                nextScene: "narnia_rule",
                onSelect: () => {
                    return "You take up your responsibilities as a ruler of Narnia...";
                }
            },
            {
                text: "Return to the wardrobe",
                nextScene: "return_home",
                onSelect: () => {
                    return "You decide to check on the wardrobe...";
                }
            }
        ]
    },
    narnia_rule: {
        text: function() {
            const char = characters[gameState.selectedCharacter];
            return `As a ruler of Narnia, you face many challenges and opportunities. ${char.name === 'peter' ? 'You establish just laws and protect the borders.' : char.name === 'susan' ? 'You promote peace and diplomacy.' : char.name === 'edmund' ? 'You ensure justice is served fairly.' : 'You spread joy and kindness throughout the land.'}`;
        },
        choices: [
            {
                text: "Continue ruling Narnia",
                nextScene: "narnia_rule",
                onSelect: () => {
                    return "You continue your reign, making Narnia a better place...";
                }
            },
            {
                text: "Return to the wardrobe",
                nextScene: "return_home",
                onSelect: () => {
                    return "You decide to check on the wardrobe...";
                }
            },
            {
                text: 'End the tale and return to England',
                nextScene: 'epilogue_wardrobe',
                onSelect: () => {
                    return 'Years in Narnia can be a lifetime; the wardrobe door is still there.';
                }
            }
        ]
    },
    return_home: {
        text: function() {
            const char = characters[gameState.selectedCharacter];
            return `You return to the wardrobe, only to find that time has barely passed in the real world. ${char.name === 'peter' ? 'You know you must return to Narnia one day.' : char.name === 'susan' ? 'You wonder if it was all a dream.' : char.name === 'edmund' ? 'You know the truth of Narnia in your heart.' : 'You can\'t wait to tell your siblings about your adventure.'}`;
        },
        choices: [
            {
                text: 'Step into the epilogue',
                nextScene: 'epilogue_wardrobe',
                onSelect: () => {
                    return 'Coats, mothballs, and the Professor’s quiet house.';
                }
            }
        ]
    },
};

// Merge additional scenes with base scenes
Object.assign(scenes, additionalScenes);

// Function to update the game display
function updateScene() {
    const scene = scenes[gameState.currentScene];
    const storyText = document.getElementById('story-text');
    const choicesDiv = document.getElementById('choices');
    if (!scene || !storyText || !choicesDiv) {
        return;
    }

    storyText.textContent = typeof scene.text === 'function' ? scene.text() : scene.text;

    choicesDiv.innerHTML = '';

    const rawChoices = typeof scene.choices === 'function' ? scene.choices() : scene.choices;
    const choiceList = (rawChoices || []).filter((c) => !c.condition || c.condition());

    choiceList.forEach((choice) => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.type = 'button';
        button.textContent = choice.text;
        button.onclick = () => {
            if (choice.onSelect) {
                const result = choice.onSelect();
                if (result) {
                    storyText.textContent = result;
                }
            }
            if (choice.action) {
                const result = choice.action();
                if (result) {
                    storyText.textContent = result;
                    refreshHUD();
                    persistSave();
                    return;
                }
            }
            if (choice.nextScene === 'character_selection') {
                resetStory();
            } else {
                gameState.currentScene = choice.nextScene;
            }
            refreshHUD();
            persistSave();
            updateScene();
        };
        choicesDiv.appendChild(button);
    });
    refreshHUD();
}

updateScene(); 