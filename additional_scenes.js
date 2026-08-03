import { characters } from './characters.js';
import { gameState, resolveEndingId } from './game_state.js';

function sel() {
    return gameState.selectedCharacter;
}

function ch() {
    return characters[sel()];
}

/** Scenes not defined in game.js (extensions + character branches + endings). */
export const additionalScenes = {
    return: {
        text: function () {
            return `You push back through the fur coats. The wardrobe taps against your fingertips; then you stumble out into the spare room, breathless. For a moment the wood smells only of wood—not of snow.`;
        },
        choices: [
            {
                text: 'Catch your breath, then go find the others',
                nextScene: 'return_to_house',
                onSelect: () => {
                    return 'You smooth your hair and try to look as if nothing astonishing has happened.';
                }
            },
            {
                text: 'Step into Narnia again',
                nextScene: 'wardrobe',
                onSelect: () => {
                    return 'You take one breath of English air, then turn back toward the coats.';
                }
            }
        ]
    },
    house_rain: {
        text: function () {
            return `Rain needles the windows. The Professor’s house is full of corridors and quiet. A spare room waits somewhere upstairs—the one with the wardrobe. Nothing else in these halls matters half so much.`;
        },
        choices: [
            {
                text: 'Return to the wardrobe room',
                nextScene: 'start',
                onSelect: () => {
                    return 'Your feet know the way before your mind does.';
                }
            }
        ]
    },
    witch_info: {
        text: function () {
            const c = ch();
            return `The Beavers speak in low voices. "The White Witch is the one who made it always winter and never Christmas," Mr. Beaver says. Mrs. Beaver glances at the window. "There are listeners in these woods—not all ears are friendly." ${c && c.name === 'Lucy' ? 'You feel the weight of what they are not saying—and somehow you already believe the better half of it.' : 'The room feels smaller.'}`;
        },
        choices: [
            {
                text: 'Ask what can be done',
                nextScene: 'beavers_story',
                onSelect: () => {
                    gameState.relationships.beaver += 5;
                    return '"Aslan is on the move," Mr. Beaver whispers. "That changes everything."';
                }
            },
            {
                text: 'Suggest leaving at once',
                nextScene: 'journey_to_aslan',
                onSelect: () => {
                    gameState.gameProgress.metAslan = true;
                    return 'You pack up courage like a parcel and prepare to go.';
                }
            }
        ]
    },
    return_with_news: {
        text: function () {
            return `You thank the Beavers and pick your way back through snow to the wardrobe route you know. The house, when you reach it, still smells of rain and old books—waiting, as if no time has passed at all.`;
        },
        choices: [
            {
                text: 'Tell your siblings what you heard',
                nextScene: 'siblings',
                onSelect: () => {
                    return 'You gather them and speak quietly. Even the furniture seems to lean in.';
                }
            },
            {
                text: 'Keep the news to yourself one more day',
                nextScene: 'secret',
                onSelect: () => {
                    gameState.secretHesitation += 1;
                    gameState.siblingsBelieve = false;
                    return 'The words stick in your throat. Tomorrow, you tell yourself. Tomorrow.';
                }
            }
        ]
    },
    lucy_believe_siblings: {
        text: function () {
            if (gameState.siblingsBelieve) {
                return `Peter’s face is serious, not mocking. Susan asks careful questions. Even Edmund—watchful, sharp—doesn’t laugh. They believe you enough to follow. The wardrobe door looks less like a joke and more like a gate.`;
            }
            return `Susan’s mouth tightens. Peter tries to be kind and fails. Edmund smirks as if he has been waiting for you to be ridiculous. Belief will have to be earned in snow, not in this spare room.`;
        },
        choices: [
            {
                text: 'Lead them to the wardrobe anyway',
                nextScene: 'group_wardrobe',
                onSelect: () => {
                    return 'You put your hand on the door. Someone has to go first.';
                }
            },
            {
                text: 'Go alone first—and bring proof back',
                nextScene: 'wardrobe',
                condition: () => !gameState.siblingsBelieve,
                onSelect: () => {
                    return 'If they will not trust words, perhaps they will trust what you can show them.';
                }
            }
        ]
    },
    lucy_return_for_tumnus: {
        text: function () {
            if (gameState.relationships.tumnus >= 40 || gameState.tumnusSafe) {
                gameState.tumnusSafe = true;
                return `You find Mr. Tumnus’s cave empty at first—overturned chair, cold ashes—then a whisper from the trees. He is alive, frightened, and steadied by your return. "You came back," he says, as if that alone were a kind of magic.`;
            }
            return `The cave is worse than empty: frost on the hearth, a White Witch’s mark scratched near the door. You were too late to keep him safe. The wooden lion in your pocket feels heavier.`;
        },
        choices: [
            {
                text: 'Press on toward the Beavers’ dam',
                nextScene: 'beavers_house',
                onSelect: () => {
                    gameState.gameProgress.metBeaver = true;
                    if (gameState.tumnusSafe) {
                        gameState.relationships.tumnus += 10;
                        gameState.relationships.aslan += 2;
                    } else {
                        gameState.relationships.aslan -= 1;
                    }
                    return gameState.tumnusSafe
                        ? 'Tumnus points you toward friends who still dare to hope.'
                        : 'Grief sharpens into purpose. You will not leave Narnia as you found it.';
                }
            }
        ]
    },
    edmund_lie_to_siblings: {
        text: function () {
            return `They ask where you have been. The truth sits on your tongue like sugar turned bitter. You could confess the sleigh, the sweetness, the promises—or you could make yourself look clever and them look small.`;
        },
        choices: [
            {
                text: 'Lie—say Lucy is imagining things (or say nothing true)',
                nextScene: 'edmund_after_lie',
                onSelect: () => {
                    gameState.edmundLied = true;
                    gameState.siblingsBelieve = false;
                    gameState.relationships.siblings.lucy -= 15;
                    gameState.relationships.siblings.peter -= 5;
                    gameState.relationships.siblings.susan -= 5;
                    gameState.relationships.witch += 5;
                    return 'The lie is easy. Living with it will not be.';
                }
            },
            {
                text: 'Confess what you did—and how it frightened you',
                nextScene: 'edmund_confess',
                onSelect: () => {
                    gameState.edmundLied = false;
                    gameState.siblingsBelieve = true;
                    gameState.relationships.siblings.lucy += 10;
                    gameState.relationships.siblings.peter += 5;
                    gameState.relationships.aslan += 3;
                    gameState.relationships.witch -= 5;
                    return 'Shame burns hotter than Turkish Delight. They stare—but they listen.';
                }
            }
        ]
    },
    edmund_after_lie: {
        text: function () {
            return `Lucy’s eyes go bright with hurt. Peter tells everyone to stop quarreling. Inside, something in you leans toward the Witch’s promises again—toward being believed for the wrong reasons.`;
        },
        choices: [
            {
                text: 'Follow when they finally enter the wardrobe',
                nextScene: 'group_wardrobe',
                onSelect: () => {
                    return 'You go along. You tell yourself you are only curious.';
                }
            }
        ]
    },
    edmund_confess: {
        text: function () {
            return `Saying it aloud makes the Witch’s gifts look cheaper. Susan’s hand finds your shoulder. Peter looks older than he is. Lucy forgives faster than you deserve.`;
        },
        choices: [
            {
                text: 'Go with them into Narnia—together',
                nextScene: 'group_wardrobe',
                onSelect: () => {
                    gameState.edmundPath = gameState.edmundPath === 'tempted' ? 'tempted' : 'redeemed';
                    if (gameState.edmundPath === 'none') gameState.edmundPath = 'redeemed';
                    return 'Whatever waits beyond the coats, you will not face it alone in secret.';
                }
            }
        ]
    },
    prophecy_reveal: {
        text: function () {
            const c = ch();
            const edmundNote =
                sel() === 'edmund' && gameState.edmundPath === 'betrayed'
                    ? ' When Aslan looks at you, you feel seen through—and not discarded.'
                    : '';
            return `Aslan’s voice is not loud, but it stills the camp. "When Adam’s flesh and Adam’s bone sits at Cair Paravel in throne, the evil time will be over and done." ${c && c.name === 'Lucy' ? 'You feel the truth of it in your bones.' : 'You try to hold all the pieces together in your mind.'}${edmundNote}`;
        },
        choices: function () {
            const arr = [
                {
                    text: 'Ask what must happen next',
                    nextScene: 'father_christmas_arrives',
                    onSelect: () => {
                        gameState.relationships.aslan += 5;
                        return 'The air itself seems to wait for his answer.';
                    }
                }
            ];
            if (sel() === 'lucy' && characters.lucy.abilityStat === 'faith') {
                arr.push({
                    text: 'Speak your faith aloud—that Aslan’s coming is already changing the air',
                    nextScene: 'father_christmas_arrives',
                    onSelect: () => {
                        gameState.relationships.aslan += 8;
                        gameState.relationships.beaver += 5;
                        return 'A few nearby creatures stand taller. Hope is contagious when someone names it.';
                    }
                });
            }
            return arr;
        }
    },
    father_christmas_arrives: {
        text: function () {
            const id = sel();
            if (!gameState.gameProgress.receivedChristmasGifts) {
                if (id === 'lucy') {
                    inventorySystem.addItem('cordial');
                    inventorySystem.addItem('dagger');
                } else if (id === 'edmund') {
                    /* Mercy before metal—Edmund’s true gift is the road back */
                    gameState.relationships.aslan += 3;
                }
                gameState.gameProgress.receivedChristmasGifts = true;
            }
            const giftLine =
                id === 'lucy'
                    ? 'Cordial and dagger: heal the hurt, guard the small.'
                    : 'You stand empty-handed for a moment—and then understand that mercy has already been given.';
            return `A sleigh bells’ jingle—not witch-sleigh bells, but honest ones—cuts through the cold. Father Christmas is here. ${giftLine}`;
        },
        choices: [
            {
                text: 'Go forward to what awaits',
                nextScene: 'stone_table_march',
                onSelect: () => {
                    return 'Spring is not here yet—but something is moving.';
                }
            }
        ]
    },
    stone_table_march: {
        text: function () {
            gameState.gameProgress.witnessedStoneTable = true;
            const edmundLine =
                sel() === 'edmund'
                    ? ' You understand, with a sick clarity, that the law she quotes was aimed at you—and that Aslan does not flinch.'
                    : ' And yet Aslan does not flinch when the bargain turns toward a traitor’s life—and toward deeper magic than she knows.';
            return `The Stone Table stands on a green hill, older than old. The Witch’s voice is thin and terrible; the law she quotes feels like a chain.${edmundLine}`;
        },
        choices: [
            {
                text: 'Watch what unfolds',
                nextScene: 'stone_table_sacrifice',
                onSelect: () => {
                    return 'You cannot look away. The air tastes of thunder and grief.';
                }
            }
        ]
    },
    stone_table_sacrifice: {
        text: function () {
            if (sel() === 'edmund' && gameState.edmundPath === 'betrayed') {
                gameState.edmundPath = 'redeemed';
                gameState.relationships.aslan += 10;
            } else if (sel() === 'edmund' && gameState.edmundPath === 'tempted') {
                gameState.edmundPath = 'redeemed';
                gameState.relationships.aslan += 5;
            }
            return `What happens on the Table is too great for loud words. When it is over, the world feels wrong—until morning, when the Table cracks and hope returns in a roar of breath and light. "If the Witch knew the whole story," someone whispers, "perhaps she would have been more careful."`;
        },
        choices: [
            {
                text: 'Rise with the dawn',
                nextScene: 'maugrim_duel',
                onSelect: () => {
                    return 'There is no time to stand still. Narnia still needs you.';
                }
            }
        ]
    },
    maugrim_duel: {
        text: function () {
            const id = sel();
            if (id === 'lucy') {
                return `Maugrim lunges toward the camp’s edge—wolf-hot breath, cruel speed. Peter steps forward with a shout. You are not the swordsman here—but you can steady the line, cry warning, or dart in with your dagger if courage outruns sense.`;
            }
            return `Maugrim lunges—wolf-hot breath, cruel speed. Peter meets him, but the fight spills toward you. How you answer will say what kind of king you are becoming.`;
        },
        choices: function () {
            const id = sel();
            if (id === 'lucy') {
                return [
                    {
                        text: 'Cry warning and hold the others steady',
                        nextScene: 'battle_preparation',
                        onSelect: () => {
                            gameState.gameProgress.maugrimDefeated = true;
                            gameState.relationships.aslan += 3;
                            gameState.relationships.siblings.peter += 5;
                            return 'Your voice cuts through panic. Peter’s blade finds its mark.';
                        }
                    },
                    {
                        text: 'Use your dagger to distract Maugrim',
                        nextScene: 'battle_preparation',
                        condition: () => inventorySystem.hasItem('dagger'),
                        onSelect: () => {
                            gameState.gameProgress.maugrimDefeated = true;
                            gameState.relationships.aslan += 5;
                            return 'Steel flashes small and bright. The wolf falters—long enough.';
                        }
                    },
                    {
                        text: 'Shrink back and let Peter finish it',
                        nextScene: 'battle_preparation',
                        onSelect: () => {
                            gameState.gameProgress.maugrimDefeated = true;
                            return 'The pack falters when its captain falls. You are alive—and quieter inside.';
                        }
                    }
                ];
            }
            return [
                {
                    text: 'Stand with Peter—fight as you can',
                    nextScene: 'battle_preparation',
                    onSelect: () => {
                        gameState.gameProgress.maugrimDefeated = true;
                        gameState.relationships.aslan += 4;
                        gameState.edmundPath = 'redeemed';
                        return 'You do not run. That, today, is victory enough—and more.';
                    }
                },
                {
                    text: 'Flank through the trees (stealth)',
                    nextScene: 'battle_preparation',
                    onSelect: () => {
                        gameState.gameProgress.maugrimDefeated = true;
                        gameState.relationships.aslan += 2;
                        return 'You come at Maugrim from the side. Surprise is a kind of courage.';
                    }
                },
                {
                    text: 'Hesitate—old fear still has teeth',
                    nextScene: 'battle_preparation',
                    onSelect: () => {
                        gameState.gameProgress.maugrimDefeated = true;
                        gameState.relationships.witch += 3;
                        gameState.relationships.aslan -= 2;
                        return 'Peter wins without you. The camp is safe. Your stomach is not.';
                    }
                }
            ];
        }
    },
    battle_support: {
        text: function () {
            const c = ch();
            const horn =
                inventorySystem.hasItem('horn')
                    ? ' A horn hangs at someone’s side; help answers when it is blown.'
                    : '';
            return `You hold the line from the rear—binding wounds, shouting warnings, steadying those who falter. ${c && c.name === 'Lucy' ? 'Your cordial is a small sun in your pocket.' : 'The battle noise rolls over you like surf.'}${horn}`;
        },
        choices: [
            {
                text: 'Move to where you are needed most',
                nextScene: 'final_battle',
                onSelect: () => {
                    return 'You find the place that fits your hands.';
                }
            }
        ]
    },
    spring_exploration: {
        text: function () {
            gameState.gameProgress.foundCairParavel = true;
            const c = ch();
            return `Narnia in spring is almost too bright after endless winter. Rivers shout; trees unclench their fingers. ${c && c.name === 'Lucy' ? 'You laugh without meaning to.' : 'You walk carefully, as if the world might vanish.'}`;
        },
        choices: [
            {
                text: 'Return for the coronation',
                nextScene: 'coronation',
                onSelect: () => {
                    return 'Cair Paravel waits on its eastern sea.';
                }
            }
        ]
    },
    narnia_explore: {
        text: function () {
            return `You and Mr. Tumnus take a longer way: a frozen waterfall like a stopped shout, a stand of trees where the snow thins. Everywhere there are stories if you know how to listen.`;
        },
        choices: function () {
            const arr = [
                {
                    text: 'Ask Tumnus about the Beavers’ dam',
                    nextScene: 'beavers_house',
                    onSelect: () => {
                        gameState.gameProgress.metBeaver = true;
                        gameState.relationships.tumnus += 5;
                        return '"Friends of mine," he says. "You’ll be safe with them."';
                    }
                },
                {
                    text: 'Return toward the lamppost',
                    nextScene: 'lamppost',
                    onSelect: () => {
                        return 'The lamppost’s glow steadies you like a promise.';
                    }
                }
            ];
            if (sel() === 'lucy' && gameState.relationships.tumnus >= 30) {
                arr.unshift({
                    text: 'Promise you will come back for him if danger comes',
                    nextScene: 'lucy_return_for_tumnus',
                    onSelect: () => {
                        gameState.tumnusSafe = true;
                        gameState.relationships.tumnus += 10;
                        return 'He squeezes your hand. The promise becomes a road.';
                    }
                });
            }
            return arr;
        }
    },
    edmund_temptation_start: {
        text: function () {
            return `You told yourself you only wanted to see. But the snow stings your pride, and the Witch’s sleigh glides up as if summoned by sulking. She offers warmth, praise, and a little box: Turkish Delight, sweet enough to make you forget your own name for a while.`;
        },
        choices: [
            {
                text: 'Eat the Turkish Delight',
                nextScene: 'edmund_after_delight',
                onSelect: () => {
                    gameState.edmundPath = 'tempted';
                    gameState.relationships.witch += 15;
                    inventorySystem.addItem('turkishDelight');
                    return 'It is all sweetness and no nourishment. You want more. You always want more.';
                }
            },
            {
                text: 'Refuse and step back',
                nextScene: 'edmund_refused_delight',
                onSelect: () => {
                    gameState.relationships.witch -= 5;
                    gameState.relationships.aslan += 2;
                    gameState.edmundPath = 'redeemed';
                    return 'Your mouth waters, but you turn away. The sleigh slides off into the grey.';
                }
            }
        ]
    },
    edmund_refused_delight: {
        text: function () {
            return `Pride still itches. You did not take her candy—but you have not yet chosen who you will be when no one is watching.`;
        },
        choices: [
            {
                text: 'Find the lamppost and the path of your siblings',
                nextScene: 'lamppost',
                onSelect: () => {
                    gameState.gameProgress.foundLampPost = true;
                    return 'Light first. Sweetness later—if ever.';
                }
            },
            {
                text: 'Return through the wardrobe and face them honestly',
                nextScene: 'return_to_house',
                onSelect: () => {
                    return 'England first. Truth before another secret snow.';
                }
            }
        ]
    },
    edmund_after_delight: {
        text: function () {
            return `The Witch’s promises settle into you like a chill: throne, power, never being smallest again. You know you should go home—and you will. Later.`;
        },
        choices: [
            {
                text: 'Return home—and decide what to tell them',
                nextScene: 'edmund_lie_to_siblings',
                onSelect: () => {
                    return 'You wipe crumbs from your mittens. The house will ask questions.';
                }
            },
            {
                text: 'Drift back toward the lamppost first',
                nextScene: 'lamppost',
                onSelect: () => {
                    return 'You hurry, already rehearsing half-truths.';
                }
            }
        ]
    },
    edmund_betrayal_night: {
        text: function () {
            return `That night at the Beavers’ house, shame and craving pull you in opposite directions. When the others sleep, you slip out. The snow remembers your footsteps too well.`;
        },
        choices: [
            {
                text: 'Go to the Witch',
                nextScene: 'edmund_at_witch_castle',
                onSelect: () => {
                    gameState.edmundPath = 'betrayed';
                    gameState.relationships.aslan -= 5;
                    gameState.relationships.witch += 10;
                    return 'Her castle rises ahead—iron and ice.';
                }
            },
            {
                text: 'Stay',
                nextScene: 'journey_to_aslan',
                onSelect: () => {
                    gameState.edmundPath = 'redeemed';
                    gameState.relationships.aslan += 5;
                    return 'You clench your fists until your hands hurt, and stay.';
                }
            }
        ]
    },
    edmund_at_witch_castle: {
        text: function () {
            return `Courtyard, dungeon, fear: you are not a king here. You are a bargaining chip. When Aslan’s name is spoken, you flinch—because you remember, now, what you traded away.`;
        },
        choices: [
            {
                text: 'Wait for what must come',
                nextScene: 'aslans_camp',
                onSelect: () => {
                    gameState.gameProgress.metAslan = true;
                    return 'Rescue, when it comes, does not feel like victory at first. It feels like mercy.';
                }
            }
        ]
    },
    epilogue_wardrobe: {
        text: function () {
            const ending = resolveEndingId();
            const scene = additionalScenes[ending];
            return typeof scene.text === 'function' ? scene.text() : scene.text;
        },
        choices: function () {
            const ending = resolveEndingId();
            const raw = additionalScenes[ending].choices;
            return typeof raw === 'function' ? raw() : raw;
        }
    },
    ending_joyous: {
        text: function () {
            const c = ch();
            if (sel() === 'lucy') {
                return `Back through the wardrobe: coats, mothballs, England. Time has barely stirred. Yet something in you is taller—belief that held, friends kept, a wooden lion’s promise kept too. ${c ? 'You glance at your siblings and know they will remember.' : ''}`;
            }
            return `Back through the wardrobe: coats, mothballs, England. You did not take every poisoned gift. Mercy found you—and you did not spit it out. The Professor’s house feels less like a cage and more like a beginning.`;
        },
        choices: [
            {
                text: 'Speak to the Professor about what happened',
                nextScene: 'professor_closing',
                onSelect: () => {
                    return 'He listens as if odd stories are the most ordinary thing in the world.';
                }
            },
            {
                text: 'Play again (reset story)',
                nextScene: 'character_selection',
                onSelect: () => {
                    return 'The wardrobe waits for the next telling.';
                }
            }
        ]
    },
    ending_bittersweet: {
        text: function () {
            if (sel() === 'edmund') {
                return `England again. The war is won in Narnia, and spring came—but you still taste metal under sweetness when you remember the sleigh. You are forgiven more than you feel. That, too, is a kind of winter thawing slowly.`;
            }
            return `England again. Narnia was real—you will swear it—but not every friendship was kept, not every word spoken in time. Joy and ache share the same spare room. The wardrobe looks ordinary. You know better.`;
        },
        choices: [
            {
                text: 'Speak to the Professor about what happened',
                nextScene: 'professor_closing',
                onSelect: () => {
                    return 'He listens. His eyes suggest he has heard stranger true things.';
                }
            },
            {
                text: 'Play again (reset story)',
                nextScene: 'character_selection',
                onSelect: () => {
                    return 'Another path may mend what this one left frayed.';
                }
            }
        ]
    },
    ending_hollow: {
        text: function () {
            if (sel() === 'edmund') {
                return `You return with the others crowned in memory—but something in you still leans toward the cold voice that called you important. Victory outside; a locked room inside. The Professor’s house smells of rain. You do not open the wardrobe again today.`;
            }
            return `You came back. The adventure happened. Yet Tumnus’s absence—or your siblings’ disbelief—hangs like frost that never quite melts. Narnia was wonderful. Wonder without kept promises feels thinner than it should.`;
        },
        choices: [
            {
                text: 'Speak to the Professor anyway',
                nextScene: 'professor_closing',
                onSelect: () => {
                    return 'Even hollow stories deserve a listener.';
                }
            },
            {
                text: 'Play again (reset story)',
                nextScene: 'character_selection',
                onSelect: () => {
                    return 'Perhaps the next telling will choose differently.';
                }
            }
        ]
    },
    professor_closing: {
        text: function () {
            const ending = resolveEndingId();
            if (ending === 'ending_hollow') {
                return `The Professor’s face is hard to read. "Logic!" he says gently—and then, quieter: "Still—be careful of doors." You leave less certain of everything, and more aware of what you left undone.`;
            }
            if (ending === 'ending_joyous') {
                return `The Professor nods as if you have confirmed a private theory. "Of course," he murmurs. "Of course there are other worlds." You leave the room lighter—and listening for sleigh bells that are not hers.`;
            }
            return `The Professor’s face is hard to read. "How do you know," he asks mildly, "which of your friends would not have said much the same?" You leave less certain of everything—and more certain of one thing: the wardrobe will be waiting.`;
        },
        choices: [
            {
                text: 'Play again',
                nextScene: 'character_selection',
                onSelect: () => {
                    return 'A new telling begins.';
                }
            }
        ]
    }
};

// --- Inventory ---
export const inventorySystem = {
    items: {
        wooden_lion: {
            name: 'Carved wooden lion',
            description: 'A small gift from Mr. Tumnus',
            type: 'charm',
            effects: { faith: 1 }
        },
        cordial: {
            name: "Lucy's Cordial",
            description: 'Heals wound and pain',
            type: 'consumable',
            effects: { healing: 3 }
        },
        dagger: {
            name: "Lucy's Dagger",
            description: 'Small but sharp',
            type: 'weapon',
            effects: { combat: 1, stealth: 1 }
        },
        turkishDelight: {
            name: 'Turkish Delight',
            description: 'Enchanted sweetness from the Witch',
            type: 'consumable',
            effects: { health: 1, addiction: 1 }
        },
        horn: {
            name: "Susan's Horn",
            description: 'Summons help when blown',
            type: 'magic',
            effects: { summonHelp: 1 }
        }
    },
    inventory: [],
    maxSlots: 14,
    addItem: function (itemName) {
        if (!this.items[itemName]) return false;
        if (this.inventory.length >= this.maxSlots) return false;
        if (this.inventory.includes(itemName)) return true;
        this.inventory.push(itemName);
        return true;
    },
    removeItem: function (itemName) {
        const index = this.inventory.indexOf(itemName);
        if (index > -1) {
            this.inventory.splice(index, 1);
            return true;
        }
        return false;
    },
    hasItem: function (itemName) {
        return this.inventory.includes(itemName);
    },
    getItemName: function (itemName) {
        return this.items[itemName]?.name || itemName;
    },
    getItemEffects: function (itemName) {
        return this.items[itemName]?.effects || {};
    }
};

/** Wire inventory array to gameState; call once at startup. */
export function initSystems() {
    inventorySystem.inventory = gameState.inventory;
}
