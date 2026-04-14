import { characters } from './characters.js';
import { gameState } from './game_state.js';

function sel() {
    return gameState.selectedCharacter;
}

function ch() {
    return characters[sel()];
}

/** Scenes not defined in game.js (extensions + fixes for previously missing keys). */
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
    witch_info: {
        text: function () {
            const c = ch();
            return `The Beavers speak in low voices. "The White Witch is the one who made it always winter and never Christmas," Mr. Beaver says. Mrs. Beaver glances at the window. "There are listeners in these woods—not all ears are friendly." ${c && c.name === 'susan' ? 'You feel the weight of what they are not saying.' : 'The room feels smaller.'}`;
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
                    return 'The words stick in your throat. Tomorrow, you tell yourself. Tomorrow.';
                }
            }
        ]
    },
    prophecy_reveal: {
        text: function () {
            const c = ch();
            return `Aslan’s voice is not loud, but it stills the camp. "When Adam’s flesh and Adam’s bone sits at Cair Paravel in throne, the evil time will be over and done." ${c && c.name === 'lucy' ? 'You feel the truth of it in your bones.' : 'You try to hold all the pieces together in your mind.'}`;
        },
        choices: [
            {
                text: 'Ask what must happen next',
                nextScene: 'father_christmas_arrives',
                onSelect: () => {
                    return 'The air itself seems to wait for his answer.';
                }
            }
        ]
    },
    father_christmas_arrives: {
        text: function () {
            const id = sel();
            if (!gameState.gameProgress.receivedChristmasGifts) {
                if (id === 'peter') {
                    inventorySystem.addItem('sword');
                    inventorySystem.addItem('shield');
                    characterStats.applyItemEffects('peter', 'sword');
                    characterStats.applyItemEffects('peter', 'shield');
                } else if (id === 'susan') {
                    inventorySystem.addItem('horn');
                    inventorySystem.addItem('bow');
                    characterStats.applyItemEffects('susan', 'bow');
                } else if (id === 'lucy') {
                    inventorySystem.addItem('cordial');
                    inventorySystem.addItem('dagger');
                    characterStats.applyItemEffects('lucy', 'dagger');
                } else if (id === 'edmund') {
                    /* Edmund’s true gifts are later—cordial may heal him after the battle */
                    characterStats.updateStat('edmund', 'courage', 1);
                }
                gameState.gameProgress.receivedChristmasGifts = true;
            }
            const c = ch();
            const giftLine =
                id === 'peter'
                    ? 'You receive sword and shield—heavy with meaning, bright with promise.'
                    : id === 'susan'
                      ? 'A horn and a bow: call for help, and strike true.'
                      : id === 'lucy'
                        ? 'Cordial and dagger: heal the hurt, guard the small.'
                        : 'You stand empty-handed for a moment—and then understand that mercy has already been given.';
            return `A sleigh bells’ jingle—not witch-sleigh bells, but honest ones—cuts through the cold. Father Christmas is here. ${giftLine} ${c && c.name === 'peter' ? 'Your fingers close on hilt and shield-rim as if they were always meant to.' : ''}`;
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
            return `The Stone Table stands on a green hill, older than old. The Witch’s voice is thin and terrible; the law she quotes feels like a chain. And yet Aslan does not flinch when the bargain turns toward Edmund’s life—and toward deeper magic than she knows.`;
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
            return `What happens on the Table is too great for loud words. When it is over, the world feels wrong—until morning, when the Table cracks and hope returns in a roar of breath and light. "If the Witch knew the whole story," someone whispers, "perhaps she would have been more careful."`;
        },
        choices: [
            {
                text: 'Rise with the dawn',
                nextScene: 'maugrim_duel',
                onSelect: () => {
                    gameState.edmundPath = 'redeemed';
                    return 'There is no time to stand still. Narnia still needs you.';
                }
            }
        ]
    },
    maugrim_duel: {
        text: function () {
            const weapon = inventorySystem.hasItem('sword') ? 'sword' : inventorySystem.hasItem('dagger') ? 'dagger' : null;
            characterStats.stats.peter.health = characterStats.stats.peter.maxHealth;
            characterStats.stats.maugrim.health = characterStats.stats.maugrim.maxHealth;
            const peterFight = combatSystem.handleCombat('peter', 'maugrim', weapon || undefined, null);
            const summary = peterFight.log.slice(0, 4).join(' ');
            gameState.gameProgress.maugrimDefeated = true;
            characterStats.heal('peter', 15);
            return `Maugrim lunges—wolf-hot breath, cruel speed. Peter meets him ${weapon ? 'steel in hand' : 'with desperate courage'}. ${summary} The pack falters when its captain falls.`;
        },
        choices: [
            {
                text: 'Press on to the great battle',
                nextScene: 'battle_preparation',
                onSelect: () => {
                    return 'Horns and paws and hooves: the army gathers.';
                }
            }
        ]
    },
    battle_support: {
        text: function () {
            const c = ch();
            return `You hold the line from the rear—binding wounds, shouting warnings, steadying those who falter. ${c && c.name === 'susan' ? 'Your horn is cold against your side; you use it once, and help answers.' : 'The battle noise rolls over you like surf.'}`;
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
            return `Narnia in spring is almost too bright after endless winter. Rivers shout; trees unclench their fingers. ${c && c.name === 'lucy' ? 'You laugh without meaning to.' : 'You walk carefully, as if the world might vanish.'}`;
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
        choices: [
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
        ]
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
                    characterStats.updateStat('edmund', 'courage', -1);
                    return 'It is all sweetness and no nourishment. You want more. You always want more.';
                }
            },
            {
                text: 'Refuse and step back',
                nextScene: 'wardrobe',
                onSelect: () => {
                    gameState.relationships.witch -= 5;
                    return 'Your mouth waters, but you turn away. The sleigh slides off into the grey.';
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
                text: 'Return to the lamppost and your siblings’ path',
                nextScene: 'lamppost',
                onSelect: () => {
                    return 'You wipe crumbs from your mittens and hurry, already rehearsing lies.';
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
                    return 'Her castle rises ahead—iron and ice.';
                }
            },
            {
                text: 'Stay',
                nextScene: 'journey_to_aslan',
                onSelect: () => {
                    gameState.edmundPath = 'redeemed';
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
            const c = ch();
            return `Back through the wardrobe: coats, mothballs, England. Time has barely stirred. ${c && c.name === 'lucy' ? 'You glance at your sister and realize, with a shock, that you are taller than you were—or she is shorter—or both.' : 'You touch the wooden door and wonder which world is the dream.'}`;
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
                    return 'The wardrobe waits for the next time.';
                }
            }
        ]
    },
    professor_closing: {
        text: function () {
            return `The Professor’s face is hard to read. "How do you know," he asks mildly, "which of your friends would not have said much the same?" You leave the room less certain of everything—and more certain of one thing: the wardrobe will be waiting.`;
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
        sword: {
            name: "Peter's Sword",
            description: 'Rhindon—gift of Father Christmas',
            type: 'weapon',
            effects: { combat: 3, confidence: 2 }
        },
        shield: {
            name: "Peter's Shield",
            description: 'Sturdy, with a red lion',
            type: 'armor',
            effects: { defense: 2, confidence: 1 }
        },
        horn: {
            name: "Susan's Horn",
            description: 'Summons help when blown',
            type: 'magic',
            effects: { summonHelp: 1 }
        },
        bow: {
            name: "Susan's Bow",
            description: 'Straight and true',
            type: 'weapon',
            effects: { combat: 2, accuracy: 3 }
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
        tools: {
            name: 'Repair Tools',
            description: 'For dam repairs',
            type: 'utility',
            effects: { repair: 2 }
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
    getItemEffects: function (itemName) {
        return this.items[itemName]?.effects || {};
    }
};

export const characterStats = {
    stats: {
        peter: { name: 'Peter', health: 100, maxHealth: 100, combat: 3, leadership: 4, courage: 4, wisdom: 3, defense: 2 },
        susan: { name: 'Susan', health: 100, maxHealth: 100, combat: 2, archery: 4, diplomacy: 4, wisdom: 4, courage: 3, defense: 1 },
        edmund: { name: 'Edmund', health: 100, maxHealth: 100, combat: 2, stealth: 3, wisdom: 2, courage: 2, defense: 1 },
        lucy: { name: 'Lucy', health: 100, maxHealth: 100, combat: 1, faith: 5, kindness: 5, wisdom: 3, courage: 3, defense: 0 },
        maugrim: { name: 'Maugrim', health: 80, maxHealth: 80, combat: 4, defense: 2 }
    },
    updateStat: function (character, stat, value) {
        if (this.stats[character] && this.stats[character][stat] !== undefined) {
            this.stats[character][stat] += value;
            return true;
        }
        return false;
    },
    getStat: function (character, stat) {
        return this.stats[character]?.[stat] || 0;
    },
    applyItemEffects: function (character, itemName) {
        const effects = inventorySystem.getItemEffects(itemName);
        for (const [stat, value] of Object.entries(effects)) {
            if (stat === 'healing' || stat === 'summonHelp' || stat === 'addiction' || stat === 'health') continue;
            this.updateStat(character, stat, value);
        }
    },
    removeItemEffects: function (character, itemName) {
        const effects = inventorySystem.getItemEffects(itemName);
        for (const [stat, value] of Object.entries(effects)) {
            if (stat === 'healing' || stat === 'summonHelp' || stat === 'addiction' || stat === 'health') continue;
            this.updateStat(character, stat, -value);
        }
    },
    checkHealth: function (character) {
        return this.stats[character]?.health || 0;
    },
    heal: function (character, amount) {
        if (this.stats[character]) {
            this.stats[character].health = Math.min(this.stats[character].health + amount, this.stats[character].maxHealth);
            return true;
        }
        return false;
    },
    takeDamage: function (character, amount) {
        if (this.stats[character]) {
            this.stats[character].health = Math.max(this.stats[character].health - amount, 0);
            return this.stats[character].health > 0;
        }
        return false;
    }
};

export const combatSystem = {
    calculateDamage: function (attacker, defender, weapon = null) {
        let power = 8 + characterStats.getStat(attacker, 'combat');
        const soak = characterStats.getStat(defender, 'defense') + Math.floor(characterStats.getStat(defender, 'combat') / 2);
        if (weapon) {
            const w = inventorySystem.getItemEffects(weapon);
            power += w.combat || 0;
            power += w.accuracy || 0;
        }
        return Math.max(1, power - soak);
    },
    performAttack: function (attacker, defender, weapon = null) {
        const damage = this.calculateDamage(attacker, defender, weapon);
        const isAlive = characterStats.takeDamage(defender, damage);
        return {
            damage,
            isAlive,
            attacker: characterStats.stats[attacker].name,
            defender: characterStats.stats[defender].name
        };
    },
    checkCombatOutcome: function (character1, character2) {
        const h1 = characterStats.checkHealth(character1);
        const h2 = characterStats.checkHealth(character2);
        if (h1 <= 0) return { winner: character2, loser: character1 };
        if (h2 <= 0) return { winner: character1, loser: character2 };
        return null;
    },
    handleCombat: function (character1, character2, weapon1 = null, weapon2 = null) {
        const log = [];
        let rounds = 0;
        while (rounds < 12) {
            rounds++;
            const a1 = this.performAttack(character1, character2, weapon1);
            log.push(`${a1.attacker} strikes ${a1.defender} for ${a1.damage} damage.`);
            const o = this.checkCombatOutcome(character1, character2);
            if (o) {
                log.push(`${characterStats.stats[o.winner].name} prevails.`);
                return { winner: o.winner, loser: o.loser, log };
            }
            const a2 = this.performAttack(character2, character1, weapon2);
            log.push(`${a2.attacker} strikes ${a2.defender} for ${a2.damage} damage.`);
            const o2 = this.checkCombatOutcome(character1, character2);
            if (o2) {
                log.push(`${characterStats.stats[o2.winner].name} prevails.`);
                return { winner: o2.winner, loser: o2.loser, log };
            }
        }
        log.push('The fight breaks off as reinforcements arrive.');
        return { winner: character1, loser: character2, log };
    }
};

export const questSystem = {
    quests: {
        main: {
            meetAslan: {
                title: 'Reach Aslan’s camp',
                description: 'Follow the prophecy toward the true King',
                status: 'available',
                requirements: {},
                rewards: { relationships: { aslan: 10 } }
            },
            defeatWitch: {
                title: 'Break the endless winter',
                description: 'Face the White Witch’s power',
                status: 'locked',
                requirements: { completedQuests: ['meetAslan'], relationships: { aslan: 5 } },
                rewards: { relationships: { aslan: 20 } }
            }
        },
        side: {
            helpBeavers: {
                title: 'Help the Beavers',
                description: 'Earn trust at the dam',
                status: 'available',
                requirements: {},
                rewards: { relationships: { beaver: 15 } }
            }
        }
    },
    checkRequirements: function (questId) {
        const quest = this.quests.main[questId] || this.quests.side[questId];
        if (!quest) return false;
        const rel = gameState.relationships;
        if (quest.requirements.items) {
            for (const item of quest.requirements.items) {
                if (!inventorySystem.hasItem(item)) return false;
            }
        }
        if (quest.requirements.relationships) {
            for (const [key, level] of Object.entries(quest.requirements.relationships)) {
                const v = rel[key];
                if (v === undefined || v < level) return false;
            }
        }
        if (quest.requirements.completedQuests) {
            for (const rq of quest.requirements.completedQuests) {
                if (!gameState.completedQuestIds.includes(rq)) return false;
            }
        }
        return true;
    },
    startQuest: function (questId) {
        const quest = this.quests.main[questId] || this.quests.side[questId];
        if (!quest || quest.status !== 'available') return false;
        if (this.checkRequirements(questId)) {
            quest.status = 'inProgress';
            gameState.activeQuestId = questId;
            return true;
        }
        return false;
    },
    completeQuest: function (questId) {
        const quest = this.quests.main[questId] || this.quests.side[questId];
        if (!quest) return false;
        if (gameState.completedQuestIds.includes(questId)) return false;
        quest.status = 'completed';
        gameState.completedQuestIds.push(questId);
        if (quest.rewards && quest.rewards.relationships) {
            for (const [k, value] of Object.entries(quest.rewards.relationships)) {
                if (gameState.relationships[k] !== undefined) gameState.relationships[k] += value;
            }
        }
        if (questId === 'meetAslan' && this.quests.main.defeatWitch) {
            this.quests.main.defeatWitch.status = 'available';
        }
        return true;
    },
    getAvailableQuests: function () {
        const out = [];
        for (const [id, q] of Object.entries(this.quests.main)) {
            if (q.status === 'available') out.push({ id, ...q });
        }
        for (const [id, q] of Object.entries(this.quests.side)) {
            if (q.status === 'available') out.push({ id, ...q });
        }
        return out;
    }
};

export const relationshipSystem = {
    updateSiblingTrust: function (who, delta) {
        const s = gameState.relationships.siblings;
        if (s[who] !== undefined) s[who] = Math.max(0, Math.min(100, s[who] + delta));
    }
};

export const dialogueSystem = {
    startDialogue: function (character, dialogueId) {
        return null;
    },
    selectOption: function () {
        return null;
    }
};

/** Wire inventory array to gameState; call once at startup. */
export function initSystems() {
    inventorySystem.inventory = gameState.inventory;
}

/** Ability hooks: return bonus for stat checks (0–3). */
export function applyAbilityBonus(statName) {
    const id = gameState.selectedCharacter;
    if (!id || !characters[id]) return 0;
    const ab = characters[id].abilityStat;
    if (ab === statName) return 2;
    return 0;
}

export function runStatCheck(statName, difficulty) {
    const id = gameState.selectedCharacter;
    if (!id) return false;
    const base = characterStats.getStat(id, statName) || 0;
    const roll = Math.floor(Math.random() * 6) + 1;
    return base + roll + applyAbilityBonus(statName) >= difficulty;
}

const DEFAULT_STATS = {
    peter: { name: 'Peter', health: 100, maxHealth: 100, combat: 3, leadership: 4, courage: 4, wisdom: 3, defense: 2 },
    susan: { name: 'Susan', health: 100, maxHealth: 100, combat: 2, archery: 4, diplomacy: 4, wisdom: 4, courage: 3, defense: 1 },
    edmund: { name: 'Edmund', health: 100, maxHealth: 100, combat: 2, stealth: 3, wisdom: 2, courage: 2, defense: 1 },
    lucy: { name: 'Lucy', health: 100, maxHealth: 100, combat: 1, faith: 5, kindness: 5, wisdom: 3, courage: 3, defense: 0 },
    maugrim: { name: 'Maugrim', health: 80, maxHealth: 80, combat: 4, defense: 2 }
};

export function resetCharacterStats() {
    for (const k of Object.keys(DEFAULT_STATS)) {
        characterStats.stats[k] = { ...DEFAULT_STATS[k] };
    }
}
