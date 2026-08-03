import { characters } from './characters.js';
import { gameState } from './game_state.js';
import {
    additionalScenes,
    inventorySystem,
    initSystems
} from './additional_scenes.js';

const SAVE_KEY = 'lww_game_save_v2';

function persistSave() {
    try {
        const data = {
            currentScene: gameState.currentScene,
            selectedCharacter: gameState.selectedCharacter,
            inventory: [...gameState.inventory],
            relationships: JSON.parse(JSON.stringify(gameState.relationships)),
            gameProgress: { ...gameState.gameProgress },
            edmundPath: gameState.edmundPath,
            secretHesitation: gameState.secretHesitation,
            siblingsBelieve: gameState.siblingsBelieve,
            edmundLied: gameState.edmundLied,
            tumnusSafe: gameState.tumnusSafe
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
        gameState.secretHesitation = data.secretHesitation || 0;
        gameState.siblingsBelieve = !!data.siblingsBelieve;
        gameState.edmundLied = !!data.edmundLied;
        gameState.tumnusSafe = !!data.tumnusSafe;
        gameState.lastChoiceResult = null;
    } catch (_) {
        /* ignore */
    }
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
    gameState.secretHesitation = 0;
    gameState.siblingsBelieve = false;
    gameState.edmundLied = false;
    gameState.tumnusSafe = false;
    gameState.lastChoiceResult = null;
    gameState.currentScene = 'character_selection';
    try {
        localStorage.removeItem(SAVE_KEY);
        localStorage.removeItem('lww_game_save_v1');
    } catch (_) {
        /* ignore */
    }
}

function inventoryLabel() {
    if (!gameState.inventory.length) return '—';
    return gameState.inventory.map((id) => inventorySystem.getItemName(id)).join(', ');
}

function refreshHUD() {
    const el = document.getElementById('game-hud');
    if (!el) return;
    const id = gameState.selectedCharacter;
    const rel = `Tumnus ${gameState.relationships.tumnus} · Beavers ${gameState.relationships.beaver} · Aslan ${gameState.relationships.aslan}`;
    let extra = '';
    if (id === 'edmund' && gameState.edmundPath !== 'none') {
        extra += `<div class="hud-row"><strong>Edmund arc:</strong> ${gameState.edmundPath}</div>`;
    }
    if (id === 'lucy') {
        extra += `<div class="hud-row"><strong>Siblings:</strong> ${gameState.siblingsBelieve ? 'believe you' : 'doubt you'} · <strong>Tumnus:</strong> ${gameState.tumnusSafe ? 'safe' : 'at risk'}</div>`;
    }
    el.innerHTML = `<div class="hud-row"><strong>Character:</strong> ${id ? characters[id].name : '—'}</div>
    <div class="hud-row"><strong>Inventory:</strong> ${inventoryLabel()}</div>
    <div class="hud-row"><strong>Relations:</strong> ${rel}</div>
    ${extra}`;
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

const scenes = {
    character_selection: {
        text: 'Choose your character. Lucy and Edmund are fully playable. Peter and Susan are coming soon.',
        choices: Object.entries(characters).map(([key, char]) => {
            if (char.playable) {
                return {
                    text: `${char.name}: ${char.description}\nTraits: ${char.traits.join(', ')}\nSpecial Ability: ${char.specialAbility}`,
                    nextScene: 'start',
                    onSelect: () => {
                        gameState.selectedCharacter = key;
                        return `You have chosen to be ${char.name}. ${char.description}`;
                    }
                };
            }
            return {
                text: `${char.name}: Coming soon`,
                nextScene: 'character_selection',
                disabled: true,
                onSelect: () => {
                    return `${char.name}'s campaign is not available yet.`;
                }
            };
        })
    },
    start: {
        text: function () {
            if (!gameState.selectedCharacter || !characters[gameState.selectedCharacter]) {
                return 'Please select a character to begin your adventure.';
            }
            const char = characters[gameState.selectedCharacter];
            return `You are ${char.name} Pevensie, ${char.description.toLowerCase()} You and your siblings have been sent to live with Professor Kirke in his mysterious country house during World War II. One rainy day, while exploring the house, you discover a spare room with nothing in it but a large wardrobe...`;
        },
        choices: [
            {
                text: 'Open the wardrobe and step inside',
                nextScene: 'wardrobe',
                onSelect: () => {
                    gameState.gameProgress.discoveredNarnia = true;
                    return 'You step into the wardrobe, feeling the soft fur coats brush against your skin...';
                }
            },
            {
                text: 'Wander the house a little longer',
                nextScene: 'house_rain',
                onSelect: () => {
                    return 'Rain, corridors, and the sense that something upstairs is waiting.';
                }
            }
        ]
    },
    wardrobe: {
        text: function () {
            const char = characters[gameState.selectedCharacter];
            if (gameState.selectedCharacter === 'lucy') {
                return `As you step into the wardrobe, the coats grow thicker and softer. Suddenly you stand in a snowy forest. The air is crisp; a lamppost glows ahead. Your heart races with excitement at this magical discovery.`;
            }
            if (gameState.selectedCharacter === 'edmund') {
                return `Snow. Silence. A lamppost in the wrong world. Something in you bristles—left out again, always second. Far off, a jingle that is not quite merry pulls at your attention.`;
            }
            return `You find yourself standing in a snowy forest. In the distance, a lamppost glows. ${char.name} can hardly believe what they are seeing.`;
        },
        choices: function () {
            if (gameState.selectedCharacter === 'edmund') {
                return [
                    {
                        text: 'Follow the sweet sound / movement in the trees',
                        nextScene: 'edmund_temptation_start',
                        onSelect: () => {
                            return 'Pride and hunger pull you sideways, away from the lamppost light.';
                        }
                    },
                    {
                        text: 'Approach the lamppost instead',
                        nextScene: 'lamppost',
                        onSelect: () => {
                            gameState.gameProgress.foundLampPost = true;
                            return 'You walk toward the light, jaw set.';
                        }
                    }
                ];
            }
            return [
                {
                    text: 'Approach the lamppost',
                    nextScene: 'lamppost',
                    onSelect: () => {
                        gameState.gameProgress.foundLampPost = true;
                        return 'You walk towards the mysterious lamppost, your footsteps crunching in the snow...';
                    }
                },
                {
                    text: 'Take in the forest for a moment',
                    nextScene: 'forest_moment',
                    onSelect: () => {
                        return 'Cold air. Tall trees. Wonder, sharp as frost.';
                    }
                }
            ];
        }
    },
    forest_moment: {
        text: function () {
            return `You stand still long enough to know this is not a dream you will shrug off. The lamppost waits like a patient star. Somewhere, a bird calls once and falls quiet.`;
        },
        choices: [
            {
                text: 'Go to the lamppost',
                nextScene: 'lamppost',
                onSelect: () => {
                    gameState.gameProgress.foundLampPost = true;
                    return 'Your boots find a path you did not notice before.';
                }
            },
            {
                text: 'Return toward the wardrobe',
                nextScene: 'return',
                onSelect: () => {
                    return 'You retrace your steps until the wardrobe’s dark mouth opens before you.';
                }
            }
        ]
    },
    lamppost: {
        text: function () {
            const id = gameState.selectedCharacter;
            if (id === 'lucy') {
                return `As you approach the lamppost, a small figure emerges—a faun! He introduces himself as Mr. Tumnus and invites you to his home for tea. You feel an immediate connection with this kind creature.`;
            }
            if (id === 'edmund') {
                return `The lamppost hums with ordinary magic. No faun steps out for you—not yet. You may push deeper into Narnia, or go home and decide what face to wear for your siblings.`;
            }
            return `A faun emerges and introduces himself as Mr. Tumnus.`;
        },
        choices: function () {
            if (gameState.selectedCharacter === 'edmund') {
                return [
                    {
                        text: 'Go home and face your siblings',
                        nextScene: 'return_to_house',
                        onSelect: () => {
                            return 'England first. Questions second.';
                        }
                    },
                    {
                        text: 'Wander toward the frozen river (Beavers)',
                        nextScene: 'beavers_house',
                        onSelect: () => {
                            gameState.gameProgress.metBeaver = true;
                            return 'Smoke rises from a small house by the ice.';
                        }
                    },
                    {
                        text: 'Follow a sweet scent on the wind',
                        nextScene: 'edmund_temptation_start',
                        condition: () => gameState.edmundPath === 'none',
                        onSelect: () => {
                            return 'You already know what you are walking toward.';
                        }
                    }
                ];
            }
            return [
                {
                    text: "Accept Mr. Tumnus's invitation",
                    nextScene: 'tea_with_tumnus',
                    onSelect: () => {
                        gameState.gameProgress.metTumnus = true;
                        gameState.relationships.tumnus += 20;
                        return 'You follow Mr. Tumnus through the snowy forest to his cozy home...';
                    }
                },
                {
                    text: 'Politely decline and turn back',
                    nextScene: 'return',
                    onSelect: () => {
                        gameState.relationships.tumnus -= 5;
                        return 'You thank Mr. Tumnus but step away from the tea and the danger he has not yet named.';
                    }
                }
            ];
        }
    },
    tea_with_tumnus: {
        text: function () {
            return `Mr. Tumnus's home is cozy and warm. As you enjoy tea and toast, he tells you about Narnia and the White Witch who has made it always winter but never Christmas. You listen with wide-eyed wonder. Suddenly, he begins to cry, confessing that he was supposed to capture you for the White Witch!`;
        },
        choices: [
            {
                text: 'Forgive Mr. Tumnus and promise to keep his secret',
                nextScene: 'tumnus_friendship',
                onSelect: () => {
                    gameState.relationships.tumnus += 30;
                    gameState.tumnusSafe = true;
                    return 'You show compassion to Mr. Tumnus, understanding his difficult position...';
                }
            },
            {
                text: 'Run back to the wardrobe',
                nextScene: 'escape_tumnus',
                onSelect: () => {
                    gameState.relationships.tumnus -= 20;
                    gameState.tumnusSafe = false;
                    return 'You quickly make your way back through the snowy forest...';
                }
            }
        ]
    },
    tumnus_friendship: {
        text: function () {
            return `Mr. Tumnus is deeply moved by your forgiveness. He promises to help you and your siblings in the future. You feel a strong bond forming with this kind faun. As you prepare to leave, he gives you a small token of friendship—a carved wooden figure of a lion.`;
        },
        choices: [
            {
                text: "Return to the Professor's house",
                nextScene: 'return_to_house',
                onSelect: () => {
                    inventorySystem.addItem('wooden_lion');
                    return 'You make your way back through the wardrobe...';
                }
            },
            {
                text: 'Ask Mr. Tumnus to show you more of Narnia',
                nextScene: 'narnia_tour',
                onSelect: () => {
                    inventorySystem.addItem('wooden_lion');
                    return 'Mr. Tumnus agrees to show you some of the wonders of Narnia...';
                }
            }
        ]
    },
    return_to_house: {
        text: 'You make your way back through the wardrobe and find yourself in the spare room again. The wardrobe looks perfectly ordinary now.',
        choices: function () {
            if (gameState.selectedCharacter === 'edmund' && gameState.edmundPath === 'tempted') {
                return [
                    {
                        text: 'Face your siblings’ questions',
                        nextScene: 'edmund_lie_to_siblings',
                        onSelect: () => {
                            return 'They are already gathering. The air feels thin.';
                        }
                    }
                ];
            }
            if (gameState.selectedCharacter === 'edmund' && gameState.edmundPath === 'redeemed' && !gameState.edmundLied) {
                return [
                    {
                        text: 'Tell them the truth about the snow—and the Witch',
                        nextScene: 'edmund_confess',
                        onSelect: () => {
                            return 'Better a hard truth than another secret.';
                        }
                    },
                    {
                        text: 'Say little; keep the edge of pride',
                        nextScene: 'edmund_lie_to_siblings',
                        onSelect: () => {
                            return 'You are not ready to be small in front of them.';
                        }
                    }
                ];
            }
            return [
                {
                    text: 'Tell your siblings about your adventure',
                    nextScene: 'siblings',
                    onSelect: () => {
                        return 'You gather them—words tumbling, then steadying.';
                    }
                },
                {
                    text: 'Keep it to yourself for now',
                    nextScene: 'secret',
                    onSelect: () => {
                        gameState.secretHesitation += 1;
                        gameState.siblingsBelieve = false;
                        return 'The spare room holds your secret like a closed fist.';
                    }
                }
            ];
        }
    },
    secret: {
        text: function () {
            if (gameState.secretHesitation >= 2) {
                return 'You cannot swallow wonder forever. The spare room seems smaller; the wardrobe larger. Hesitation has already cooled their trust.';
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
                            gameState.siblingsBelieve = false;
                            gameState.relationships.siblings.peter -= 5;
                            gameState.relationships.siblings.susan -= 5;
                            gameState.relationships.siblings.edmund -= 5;
                            return 'You gather them—too late for easy belief, but not too late for truth.';
                        }
                    }
                ];
            }
            return [
                {
                    text: 'Tell your siblings about your adventure',
                    nextScene: 'siblings',
                    onSelect: () => {
                        return 'You gather them—words tumbling, then steadying.';
                    }
                },
                {
                    text: 'Go downstairs and clear your head',
                    nextScene: 'house_rain',
                    onSelect: () => {
                        gameState.secretHesitation += 1;
                        gameState.siblingsBelieve = false;
                        return 'The house is full of ordinary sounds; Narnia still burns behind your eyes.';
                    }
                }
            ];
        }
    },
    siblings: {
        text: function () {
            const id = gameState.selectedCharacter;
            if (id === 'lucy') {
                if (!gameState.siblingsBelieve && gameState.secretHesitation > 0) {
                    return `You tell them everything. Peter tries to be fair. Susan looks doubtful. Edmund’s smile is unkind. Because you waited, the story sounds like a game you invented.`;
                }
                return `You gather your siblings and tell them about your incredible adventure. You are excited to share your discovery—and something in your voice makes Peter listen.`;
            }
            return `You gather your siblings and speak of snow and lampposts and danger.`;
        },
        choices: function () {
            if (gameState.selectedCharacter === 'lucy') {
                return [
                    {
                        text: 'See how they receive it',
                        nextScene: 'lucy_believe_siblings',
                        onSelect: () => {
                            if (gameState.secretHesitation > 0) {
                                gameState.siblingsBelieve = false;
                            } else {
                                gameState.siblingsBelieve = true;
                                gameState.relationships.siblings.peter += 5;
                                gameState.relationships.siblings.susan += 5;
                            }
                            gameState.secretHesitation = 0;
                            return 'Their faces will tell you what words cannot.';
                        }
                    }
                ];
            }
            return [
                {
                    text: 'Lead your siblings to the wardrobe',
                    nextScene: 'group_wardrobe'
                },
                {
                    text: 'Wait until tomorrow to show them',
                    nextScene: 'next_day'
                }
            ];
        }
    },
    group_wardrobe: {
        text: 'You lead your siblings to the wardrobe room. They look at you with mixed faces as you open the wardrobe door...',
        choices: [
            {
                text: 'Step inside first to show them it\'s safe',
                nextScene: 'group_narnia',
                onSelect: () => {
                    return 'You go first. Courage is easier when someone is watching.';
                }
            },
            {
                text: 'Let one of your siblings go first',
                nextScene: 'sibling_first',
                onSelect: () => {
                    if (gameState.siblingsBelieve) {
                        gameState.relationships.siblings.peter += 3;
                    }
                    return 'Trust goes both ways—for a moment.';
                }
            }
        ]
    },
    group_narnia: {
        text: function () {
            const believe = gameState.siblingsBelieve
                ? 'This time they do not laugh when the snow bites their cheeks.'
                : 'Shock wipes the skepticism off their faces—too late for easy apologies.';
            return `You lead your siblings into the wardrobe and step into Narnia. The door closes behind you. A lamppost glows in the woods. ${believe}`;
        },
        choices: function () {
            const arr = [
                {
                    text: 'Approach the lamppost',
                    nextScene: 'lamppost_group',
                    onSelect: () => {
                        gameState.gameProgress.foundLampPost = true;
                        return 'Together, you walk toward the light.';
                    }
                }
            ];
            if (gameState.selectedCharacter === 'lucy' && gameState.tumnusSafe && inventorySystem.hasItem('wooden_lion')) {
                arr.push({
                    text: 'Clutch the wooden lion and insist you find Mr. Tumnus first',
                    nextScene: 'lucy_return_for_tumnus',
                    onSelect: () => {
                        gameState.relationships.tumnus += 5;
                        return 'The carved lion warms in your glove. Friendship first.';
                    }
                });
            }
            if (gameState.selectedCharacter === 'edmund' && gameState.edmundPath === 'tempted') {
                arr.push({
                    text: 'Let the others go ahead—you have somewhere else in mind',
                    nextScene: 'edmund_temptation_start',
                    condition: () => !inventorySystem.hasItem('turkishDelight'),
                    onSelect: () => {
                        return 'Old sweetness pulls harder than lamppost light.';
                    }
                });
            }
            arr.push({
                text: 'Turn back to the wardrobe',
                nextScene: 'return'
            });
            return arr;
        }
    },
    sibling_first: {
        text: function () {
            return `You let one of your siblings go first. They step into the wardrobe and you follow into Narnia. Snow. Lamppost. ${gameState.siblingsBelieve ? 'Belief becomes footprints.' : 'Astonishment arrives late.'}`;
        },
        choices: [
            {
                text: 'Approach the lamppost together',
                nextScene: 'lamppost_group',
                onSelect: () => {
                    gameState.gameProgress.foundLampPost = true;
                    return 'You move as a small, cold company.';
                }
            },
            {
                text: 'Turn back to the wardrobe',
                nextScene: 'return'
            }
        ]
    },
    lamppost_group: {
        text: function () {
            if (gameState.selectedCharacter === 'lucy' && gameState.gameProgress.metTumnus) {
                return `The lamppost is familiar now. Your siblings huddle close. From here you can seek the Beavers—or keep a promise to a faun.`;
            }
            return `At the lamppost, Narnia feels larger with four pairs of eyes. Rumors of talking animals and a Witch travel on the wind. A low house by a frozen river offers warmth—and answers.`;
        },
        choices: function () {
            const arr = [
                {
                    text: 'Seek the house by the frozen river',
                    nextScene: 'beavers_house',
                    onSelect: () => {
                        gameState.gameProgress.metBeaver = true;
                        return 'You follow chimney-smoke and courage.';
                    }
                }
            ];
            if (gameState.selectedCharacter === 'lucy' && (gameState.tumnusSafe || gameState.relationships.tumnus >= 30)) {
                arr.unshift({
                    text: 'Go to Mr. Tumnus first',
                    nextScene: 'lucy_return_for_tumnus',
                    onSelect: () => {
                        return 'You will not leave a friend to the winter.';
                    }
                });
            }
            if (gameState.selectedCharacter === 'edmund' && gameState.edmundPath === 'tempted') {
                arr.push({
                    text: 'Slip away toward the Witch’s road',
                    nextScene: 'edmund_at_witch_castle',
                    onSelect: () => {
                        gameState.edmundPath = 'betrayed';
                        gameState.relationships.aslan -= 5;
                        gameState.relationships.witch += 10;
                        return 'You leave footprints you cannot unsay.';
                    }
                });
            }
            return arr;
        }
    },
    next_day: {
        text: 'You decide to wait until tomorrow. Morning does not make the wardrobe less strange—or your silence kinder.',
        choices: [
            {
                text: 'Tell your siblings about your adventure',
                nextScene: 'siblings',
                onSelect: () => {
                    gameState.secretHesitation += 1;
                    gameState.siblingsBelieve = false;
                    return 'A day late already.';
                }
            },
            {
                text: 'Keep it to yourself longer',
                nextScene: 'secret'
            }
        ]
    },
    escape_tumnus: {
        text: 'You quickly run back through the snowy forest, your heart pounding. As you reach the wardrobe, you glance back to see Mr. Tumnus watching you sadly from a distance...',
        choices: [
            {
                text: 'Step back into the wardrobe',
                nextScene: 'return',
                onSelect: () => {
                    gameState.tumnusSafe = false;
                    return 'Guilt follows you through the coats.';
                }
            }
        ]
    },
    narnia_tour: {
        text: function () {
            return `Mr. Tumnus shows you some of the wonders of Narnia. Your heart swells with joy at the magic around you. As you walk, you notice a small house by a frozen river.`;
        },
        choices: [
            {
                text: 'Investigate the house by the river',
                nextScene: 'beavers_house',
                onSelect: () => {
                    gameState.gameProgress.metBeaver = true;
                    return 'You approach the cozy-looking house by the frozen river...';
                }
            },
            {
                text: 'Continue exploring with Mr. Tumnus',
                nextScene: 'narnia_explore',
                onSelect: () => {
                    gameState.relationships.tumnus += 10;
                    return 'You and Mr. Tumnus continue your exploration of Narnia...';
                }
            },
            {
                text: 'Hold the wooden lion and ask if he will be safe',
                nextScene: 'lucy_return_for_tumnus',
                condition: () => inventorySystem.hasItem('wooden_lion'),
                onSelect: () => {
                    gameState.tumnusSafe = true;
                    gameState.relationships.tumnus += 5;
                    return 'He looks at the carving, then at you. "Safer for knowing you care."';
                }
            }
        ]
    },
    beavers_house: {
        text: function () {
            const id = gameState.selectedCharacter;
            const tone =
                id === 'lucy'
                    ? 'You immediately feel at home with these friendly creatures.'
                    : 'You are cautious—and hungry for something that is not kindness.';
            return `As you approach the house, a beaver pokes his head out. "Hello there!" he says. "I'm Mr. Beaver, and this is my wife, Mrs. Beaver." They invite you inside. ${tone}`;
        },
        choices: [
            {
                text: 'Accept their invitation',
                nextScene: 'beavers_story',
                onSelect: () => {
                    gameState.relationships.beaver += 20;
                    return 'You step inside the cozy beaver home...';
                }
            },
            {
                text: 'Ask about the White Witch',
                nextScene: 'witch_info',
                onSelect: () => {
                    return 'The Beavers look around nervously before speaking...';
                }
            }
        ]
    },
    beavers_story: {
        text: function () {
            const id = gameState.selectedCharacter;
            const prophecy =
                'Mr. Beaver leans close. "They say—when Adam\'s flesh and Adam\'s bone sits at Cair Paravel in throne, the evil time will be over and done."';
            const react =
                id === 'lucy'
                    ? 'You believe in Aslan with all your heart.'
                    : id === 'edmund' && gameState.edmundPath === 'tempted'
                      ? 'You are not sure what to believe—and part of you hopes the Witch is stronger.'
                      : 'You struggle to know which world deserves your loyalty.';
            return `Over a warm meal, the Beavers tell you about Aslan, the true king of Narnia. ${prophecy} ${react}`;
        },
        choices: function () {
            const arr = [
                {
                    text: 'Ask to meet Aslan',
                    nextScene: 'journey_to_aslan',
                    onSelect: () => {
                        gameState.gameProgress.metAslan = true;
                        gameState.relationships.beaver += 5;
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
            if (gameState.selectedCharacter === 'lucy') {
                arr.unshift({
                    text: 'Speak up: you know in your bones Aslan is good',
                    nextScene: 'journey_to_aslan',
                    onSelect: () => {
                        gameState.gameProgress.metAslan = true;
                        gameState.relationships.aslan += 5;
                        gameState.relationships.beaver += 10;
                        return 'Mrs. Beaver’s eyes shine. Faith makes the kettle whistle louder.';
                    }
                });
            }
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
        text: function () {
            const id = gameState.selectedCharacter;
            const line =
                id === 'lucy'
                    ? 'Your faith keeps you going through the difficult journey.'
                    : gameState.edmundPath === 'redeemed'
                      ? 'You keep going—not because you feel brave, but because you stayed.'
                      : 'You struggle with doubts but keep going.';
            return `The journey to Aslan's camp is long and dangerous. You must avoid the White Witch's patrols. ${line}`;
        },
        choices: [
            {
                text: 'Continue the journey',
                nextScene: 'aslans_camp',
                onSelect: () => {
                    return 'You press on through the snow...';
                }
            },
            {
                text: 'Take a shortcut through the woods',
                nextScene: 'shortcut_danger',
                onSelect: () => {
                    return 'You decide to take a riskier path...';
                }
            }
        ]
    },
    shortcut_danger: {
        text: function () {
            const id = gameState.selectedCharacter;
            return `As you take the shortcut, you encounter the White Witch's wolves! ${id === 'lucy' ? 'You stand your ground bravely.' : 'You consider running—and then remember what running has already cost.'}`;
        },
        choices: [
            {
                text: 'Face them and fight through',
                nextScene: 'wolf_battle',
                onSelect: () => {
                    return 'You prepare to face the wolves...';
                }
            },
            {
                text: 'Try to sneak past them',
                nextScene: 'sneak_past',
                onSelect: () => {
                    return 'You attempt to move quietly through the trees...';
                }
            }
        ]
    },
    wolf_battle: {
        text: function () {
            const id = gameState.selectedCharacter;
            return `The clash is fierce and short. ${id === 'lucy' ? 'You defend your siblings with more courage than size.' : 'You fight with a determination that surprises even you.'}`;
        },
        choices: [
            {
                text: "Continue to Aslan's camp",
                nextScene: 'aslans_camp',
                onSelect: () => {
                    gameState.gameProgress.defeatedWolves = true;
                    gameState.relationships.aslan += 3;
                    return 'After driving the wolves off, you continue...';
                }
            }
        ]
    },
    sneak_past: {
        text: function () {
            const id = gameState.selectedCharacter;
            if (id === 'edmund') {
                return `You manage to sneak past—old habits of quiet feet. Relief tastes almost like Turkish Delight. Almost.`;
            }
            return `You sneak past the wolves undetected, proud of your careful steps.`;
        },
        choices: [
            {
                text: "Continue to Aslan's camp",
                nextScene: 'aslans_camp',
                onSelect: () => {
                    return 'You continue your journey to Aslan\'s camp...';
                }
            }
        ]
    },
    aslans_camp: {
        text: function () {
            const id = gameState.selectedCharacter;
            if (id === 'edmund' && gameState.edmundPath === 'betrayed') {
                return `You reach Aslan's camp after rescue and mercy you did not earn cleanly. The great lion’s gaze is terrible and kind. You feel both fear and a thin, new hope.`;
            }
            if (id === 'lucy') {
                return `You finally reach Aslan's camp. The great lion himself welcomes you. You feel pure joy at meeting him—and a responsibility to those you promised to keep safe.`;
            }
            return `You reach Aslan's camp. The great lion welcomes you. Something in your chest unclenches—and something else braces.`;
        },
        choices: function () {
            const base = [
                {
                    text: 'Ask about the prophecy and what must be done',
                    nextScene: 'prophecy_reveal',
                    onSelect: () => {
                        gameState.relationships.aslan += 5;
                        gameState.gameProgress.metAslan = true;
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
        text: function () {
            const id = gameState.selectedCharacter;
            return `Aslan and his army prepare for the final battle against the White Witch. ${id === 'lucy' ? 'You help tend to the wounded—and keep the cordial close.' : 'You are given a chance to prove what mercy made of you.'}`;
        },
        choices: [
            {
                text: 'Join the front of the fight',
                nextScene: 'final_battle',
                onSelect: () => {
                    return 'You prepare to face the White Witch\'s army...';
                }
            },
            {
                text: 'Support from the rear',
                nextScene: 'battle_support',
                onSelect: () => {
                    return 'You take up a supporting position...';
                }
            }
        ]
    },
    final_battle: {
        text: function () {
            const id = gameState.selectedCharacter;
            let cordial = '';
            if (
                id === 'lucy' &&
                inventorySystem.hasItem('cordial') &&
                (gameState.edmundPath === 'betrayed' || gameState.edmundPath === 'redeemed')
            ) {
                inventorySystem.removeItem('cordial');
                gameState.gameProgress.edmundHealed = true;
                gameState.relationships.siblings.edmund += 15;
                gameState.relationships.aslan += 3;
                cordial =
                    ' Edmund falls gasping; you are there at once with the cordial—until color returns. ';
            } else if (id === 'lucy' && inventorySystem.hasItem('cordial')) {
                inventorySystem.removeItem('cordial');
                gameState.relationships.beaver += 5;
                cordial = ' You use a drop of cordial on a wounded beaver-soldier; the line holds. ';
            }
            const close =
                id === 'edmund'
                    ? gameState.edmundPath === 'redeemed'
                        ? ' Your redemption is not a speech—it is the fact that you stayed in the fight.'
                        : ' Victory arrives. Peace does not, not fully, not yet.'
                    : ' Your faith inspired others.';
            return `The battle is fierce, but with Aslan's help, you emerge victorious. The White Witch is defeated, and spring returns to Narnia.${cordial}${close}`;
        },
        choices: [
            {
                text: 'Attend the coronation',
                nextScene: 'coronation',
                onSelect: () => {
                    return 'You prepare for your coronation as a king/queen of Narnia...';
                }
            },
            {
                text: 'Explore the newly freed Narnia',
                nextScene: 'spring_exploration',
                onSelect: () => {
                    return 'You set out to see Narnia in spring...';
                }
            }
        ]
    },
    coronation: {
        text: function () {
            const id = gameState.selectedCharacter;
            return `At Cair Paravel, you and your siblings are crowned as the Kings and Queens of Narnia. ${id === 'edmund' ? 'You are crowned King Edmund the Just.' : 'You are crowned Queen Lucy the Valiant.'}`;
        },
        choices: [
            {
                text: 'Take a breath of your new reign—then the wardrobe calls',
                nextScene: 'narnia_rule',
                onSelect: () => {
                    return 'Glory is brief. England is patient.';
                }
            },
            {
                text: 'Return toward the wardrobe',
                nextScene: 'return_home',
                onSelect: () => {
                    return 'You decide to check on the wardrobe...';
                }
            }
        ]
    },
    narnia_rule: {
        text: function () {
            const id = gameState.selectedCharacter;
            return `For a stretch of bright years you rule well. ${id === 'lucy' ? 'You spread joy and kindness throughout the land.' : 'You ensure justice is served fairly—especially to those who fail and return.'} But the wardrobe’s memory does not fade.`;
        },
        choices: [
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
        text: function () {
            const id = gameState.selectedCharacter;
            return `You return to the wardrobe, only to find that time has barely passed in the real world. ${id === 'lucy' ? 'You can\'t wait to tell—again—what you know is true.' : 'You know the truth of Narnia in your heart, scars and all.'}`;
        },
        choices: [
            {
                text: 'Step into the ending',
                nextScene: 'epilogue_wardrobe',
                onSelect: () => {
                    return 'Coats, mothballs, and the Professor’s quiet house.';
                }
            }
        ]
    }
};

Object.assign(scenes, additionalScenes);

function updateScene() {
    const scene = scenes[gameState.currentScene];
    const storyText = document.getElementById('story-text');
    const choicesDiv = document.getElementById('choices');
    if (!scene || !storyText || !choicesDiv) {
        return;
    }

    let body = typeof scene.text === 'function' ? scene.text() : scene.text;
    if (gameState.lastChoiceResult) {
        body = `${gameState.lastChoiceResult}\n\n${body}`;
        gameState.lastChoiceResult = null;
    }
    storyText.textContent = body;

    choicesDiv.innerHTML = '';

    const rawChoices = typeof scene.choices === 'function' ? scene.choices() : scene.choices;
    const choiceList = (rawChoices || []).filter((c) => !c.condition || c.condition());

    choiceList.forEach((choice) => {
        const button = document.createElement('button');
        button.className = 'choice-btn' + (choice.disabled ? ' choice-btn-disabled' : '');
        button.type = 'button';
        button.textContent = choice.text;
        if (choice.disabled) {
            button.disabled = true;
            button.setAttribute('aria-disabled', 'true');
            choicesDiv.appendChild(button);
            return;
        }
        button.onclick = () => {
            if (choice.onSelect) {
                const result = choice.onSelect();
                if (result) {
                    gameState.lastChoiceResult = result;
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
