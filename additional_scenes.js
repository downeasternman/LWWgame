const additionalScenes = {
    beavers_house: {
        text: function() {
            const char = characters[selectedCharacter];
            return `As you approach the house, a kind-looking beaver pokes his head out. "Hello there!" he says cheerfully. "I'm Mr. Beaver, and this is my wife, Mrs. Beaver." They invite you inside for a warm meal. ${char.name === 'lucy' ? 'You immediately feel at home with these friendly creatures.' : 'You\'re cautious but intrigued by these talking animals.'}`;
        },
        choices: [
            {
                text: "Accept their invitation",
                nextScene: "beavers_story",
                onSelect: () => {
                    relationships.beaver += 20;
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
            const char = characters[selectedCharacter];
            return `Over a warm meal, the Beavers tell you about Aslan, the true king of Narnia, and how he's returning to defeat the White Witch. ${char.name === 'peter' ? 'You feel a sense of responsibility to help.' : char.name === 'susan' ? 'You\'re skeptical but intrigued.' : char.name === 'edmund' ? 'You\'re not sure what to believe.' : 'You believe in Aslan with all your heart.'}`;
        },
        choices: [
            {
                text: "Ask to meet Aslan",
                nextScene: "journey_to_aslan",
                onSelect: () => {
                    gameProgress.metAslan = true;
                    return "The Beavers agree to take you to meet Aslan...";
                }
            },
            {
                text: "Return to tell your siblings",
                nextScene: "return_with_news",
                onSelect: () => {
                    return "You thank the Beavers and head back to the wardrobe...";
                }
            }
        ]
    },
    journey_to_aslan: {
        text: function() {
            const char = characters[selectedCharacter];
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
    aslans_camp: {
        text: function() {
            const char = characters[selectedCharacter];
            return `You finally reach Aslan's camp. The great lion himself welcomes you. ${char.name === 'peter' ? 'You feel a deep sense of responsibility.' : char.name === 'susan' ? 'You\'re in awe of his wisdom.' : char.name === 'edmund' ? 'You feel both fear and hope.' : 'You feel pure joy at meeting the great lion.'}`;
        },
        choices: [
            {
                text: "Ask about the prophecy",
                nextScene: "prophecy_reveal",
                onSelect: () => {
                    return "Aslan explains the ancient prophecy...";
                }
            },
            {
                text: "Offer to help in the battle",
                nextScene: "battle_preparation",
                onSelect: () => {
                    return "Aslan accepts your offer and begins preparing you for battle...";
                }
            }
        ]
    },
    battle_preparation: {
        text: function() {
            const char = characters[selectedCharacter];
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
            const char = characters[selectedCharacter];
            return `The battle is fierce, but with Aslan's help, you emerge victorious. The White Witch is defeated, and spring returns to Narnia. ${char.name === 'peter' ? 'Your leadership was crucial to the victory.' : char.name === 'susan' ? 'Your wisdom guided many to safety.' : char.name === 'edmund' ? 'Your redemption is complete.' : 'Your faith inspired others.'}`;
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
            const char = characters[selectedCharacter];
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
            const char = characters[selectedCharacter];
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
            }
        ]
    },
    return_home: {
        text: function() {
            const char = characters[selectedCharacter];
            return `You return to the wardrobe, only to find that time has barely passed in the real world. ${char.name === 'peter' ? 'You know you must return to Narnia one day.' : char.name === 'susan' ? 'You wonder if it was all a dream.' : char.name === 'edmund' ? 'You know the truth of Narnia in your heart.' : 'You can\'t wait to tell your siblings about your adventure.'}`;
        },
        choices: [
            {
                text: "Tell your siblings about Narnia",
                nextScene: "siblings",
                onSelect: () => {
                    return "You gather your siblings to tell them about Narnia...";
                }
            },
            {
                text: "Keep it to yourself for now",
                nextScene: "secret",
                onSelect: () => {
                    return "You decide to keep your adventure a secret for now...";
                }
            }
        ]
    }
};

// Side Quests
const sideQuests = {
    rescueTumnus: {
        title: "Rescue Mr. Tumnus",
        description: "Help Mr. Tumnus escape from the White Witch's prison",
        requirements: {
            items: ["lantern", "rope"],
            relationships: {
                tumnus: 3
            }
        },
        scenes: {
            start: {
                text: "You hear rumors that Mr. Tumnus has been captured by the White Witch's forces. Will you attempt to rescue him?",
                choices: [
                    {
                        text: "Gather information about his location",
                        next: "gatherInfo",
                        effects: {
                            relationships: {
                                tumnus: 1
                            }
                        }
                    },
                    {
                        text: "Plan the rescue mission",
                        next: "planRescue",
                        requirements: {
                            items: ["map"]
                        }
                    },
                    {
                        text: "Seek help from the Beavers",
                        next: "beaverHelp",
                        requirements: {
                            relationships: {
                                beavers: 2
                            }
                        }
                    }
                ]
            },
            gatherInfo: {
                text: "You learn that Mr. Tumnus is being held in a secret prison near the White Witch's castle. The guards change shifts at midnight.",
                choices: [
                    {
                        text: "Sneak in during the guard change",
                        next: "sneakIn",
                        requirements: {
                            items: ["lantern"]
                        }
                    },
                    {
                        text: "Create a distraction to draw the guards away",
                        next: "distraction",
                        requirements: {
                            items: ["fireworks"]
                        }
                    }
                ]
            },
            // ... more scenes for the rescue quest ...
        }
    },
    whiteStag: {
        title: "The White Stag",
        description: "Search for the legendary White Stag that grants wishes",
        requirements: {
            items: ["compass"],
            relationships: {
                aslan: 2
            }
        },
        scenes: {
            start: {
                text: "Legends speak of a magical White Stag that roams the forests of Narnia. Would you like to search for it?",
                choices: [
                    {
                        text: "Follow the ancient maps",
                        next: "followMap",
                        requirements: {
                            items: ["map"]
                        }
                    },
                    {
                        text: "Ask the talking animals for help",
                        next: "askAnimals",
                        requirements: {
                            relationships: {
                                animals: 2
                            }
                        }
                    }
                ]
            },
            // ... more scenes for the White Stag quest ...
        }
    },
    stoneTable: {
        title: "The Stone Table",
        description: "Investigate the mysterious Stone Table and its history",
        requirements: {
            items: ["lantern"],
            relationships: {
                aslan: 1
            }
        },
        scenes: {
            start: {
                text: "The Stone Table holds ancient secrets about Narnia's history. Would you like to explore it?",
                choices: [
                    {
                        text: "Study the ancient carvings",
                        next: "studyCarvings",
                        requirements: {
                            items: ["notebook"]
                        }
                    },
                    {
                        text: "Search for hidden chambers",
                        next: "hiddenChambers",
                        requirements: {
                            items: ["lantern"]
                        }
                    }
                ]
            },
            // ... more scenes for the Stone Table quest ...
        }
    }
};

// Character Interactions
const characterInteractions = {
    beavers: {
        name: "Mr. and Mrs. Beaver",
        location: "Beaver's Dam",
        interactions: {
            firstMeeting: {
                text: "The Beavers welcome you to their cozy dam. They seem to know a lot about Narnia.",
                choices: [
                    {
                        text: "Ask about Aslan",
                        next: "aslanInfo",
                        effects: {
                            relationships: {
                                beavers: 1,
                                aslan: 1
                            }
                        }
                    },
                    {
                        text: "Help with dam repairs",
                        next: "damRepairs",
                        requirements: {
                            items: ["tools"]
                        }
                    },
                    {
                        text: "Share a meal",
                        next: "shareMeal",
                        effects: {
                            relationships: {
                                beavers: 2
                            }
                        }
                    }
                ]
            },
            aslanInfo: {
                text: "The Beavers tell you about Aslan's return and the prophecy.",
                choices: [
                    {
                        text: "Ask about the prophecy",
                        next: "prophecy",
                        effects: {
                            knowledge: ["prophecy"]
                        }
                    },
                    {
                        text: "Express doubts",
                        next: "doubts",
                        effects: {
                            relationships: {
                                beavers: -1
                            }
                        }
                    }
                ]
            }
        }
    },
    tumnus: {
        name: "Mr. Tumnus",
        location: "Tumnus's Cave",
        interactions: {
            firstMeeting: {
                text: "Mr. Tumnus invites you for tea in his cozy cave.",
                choices: [
                    {
                        text: "Accept the invitation",
                        next: "teaParty",
                        effects: {
                            relationships: {
                                tumnus: 2
                            }
                        }
                    },
                    {
                        text: "Ask about Narnia",
                        next: "narniaInfo",
                        effects: {
                            knowledge: ["narniaHistory"]
                        }
                    }
                ]
            },
            teaParty: {
                text: "Mr. Tumnus serves you tea and tells stories about Narnia.",
                choices: [
                    {
                        text: "Listen to his stories",
                        next: "stories",
                        effects: {
                            relationships: {
                                tumnus: 1
                            }
                        }
                    },
                    {
                        text: "Ask about the White Witch",
                        next: "witchInfo",
                        effects: {
                            knowledge: ["witchInfo"]
                        }
                    }
                ]
            }
        }
    },
    whiteWitch: {
        name: "White Witch",
        location: "Castle",
        interactions: {
            firstMeeting: {
                text: "The White Witch appears before you, offering Turkish Delight.",
                choices: [
                    {
                        text: "Accept the treat",
                        next: "acceptTreat",
                        effects: {
                            relationships: {
                                witch: 1
                            },
                            items: ["turkishDelight"]
                        }
                    },
                    {
                        text: "Refuse politely",
                        next: "refuse",
                        effects: {
                            relationships: {
                                witch: -1
                            }
                        }
                    }
                ]
            }
        }
    }
};

// Inventory System
const inventorySystem = {
    items: {
        sword: {
            name: "Peter's Sword",
            description: "A magical sword given to Peter by Father Christmas",
            type: "weapon",
            effects: {
                combat: 3,
                confidence: 2
            }
        },
        shield: {
            name: "Peter's Shield",
            description: "A sturdy shield with the image of a lion",
            type: "armor",
            effects: {
                defense: 2,
                confidence: 1
            }
        },
        horn: {
            name: "Susan's Horn",
            description: "A magical horn that summons help when blown",
            type: "magic",
            effects: {
                summonHelp: true
            }
        },
        bow: {
            name: "Susan's Bow",
            description: "A magical bow that never misses its target",
            type: "weapon",
            effects: {
                combat: 2,
                accuracy: 3
            }
        },
        cordial: {
            name: "Lucy's Cordial",
            description: "A magical healing potion",
            type: "consumable",
            effects: {
                healing: 3
            }
        },
        dagger: {
            name: "Lucy's Dagger",
            description: "A small but effective weapon",
            type: "weapon",
            effects: {
                combat: 1,
                stealth: 1
            }
        },
        turkishDelight: {
            name: "Turkish Delight",
            description: "Magical candy from the White Witch",
            type: "consumable",
            effects: {
                health: 1,
                addiction: 1
            }
        },
        tools: {
            name: "Repair Tools",
            description: "Tools for fixing things",
            type: "utility",
            effects: {
                repair: 2
            }
        }
    },
    inventory: [],
    maxSlots: 10,
    
    addItem: function(itemName) {
        if (this.inventory.length < this.maxSlots) {
            this.inventory.push(itemName);
            return true;
        }
        return false;
    },
    
    removeItem: function(itemName) {
        const index = this.inventory.indexOf(itemName);
        if (index > -1) {
            this.inventory.splice(index, 1);
            return true;
        }
        return false;
    },
    
    hasItem: function(itemName) {
        return this.inventory.includes(itemName);
    },
    
    getItemEffects: function(itemName) {
        return this.items[itemName]?.effects || {};
    }
};

// Character Stats System
const characterStats = {
    stats: {
        peter: {
            name: "Peter",
            health: 100,
            maxHealth: 100,
            combat: 3,
            leadership: 4,
            courage: 4,
            wisdom: 3,
            inventory: []
        },
        susan: {
            name: "Susan",
            health: 100,
            maxHealth: 100,
            archery: 4,
            diplomacy: 4,
            wisdom: 4,
            courage: 3,
            inventory: []
        },
        edmund: {
            name: "Edmund",
            health: 100,
            maxHealth: 100,
            combat: 2,
            stealth: 3,
            wisdom: 2,
            courage: 2,
            inventory: []
        },
        lucy: {
            name: "Lucy",
            health: 100,
            maxHealth: 100,
            faith: 5,
            kindness: 5,
            wisdom: 3,
            courage: 3,
            inventory: []
        }
    },
    
    updateStat: function(character, stat, value) {
        if (this.stats[character] && this.stats[character][stat] !== undefined) {
            this.stats[character][stat] += value;
            return true;
        }
        return false;
    },
    
    getStat: function(character, stat) {
        return this.stats[character]?.[stat] || 0;
    },
    
    applyItemEffects: function(character, itemName) {
        const effects = inventorySystem.getItemEffects(itemName);
        for (const [stat, value] of Object.entries(effects)) {
            this.updateStat(character, stat, value);
        }
    },
    
    removeItemEffects: function(character, itemName) {
        const effects = inventorySystem.getItemEffects(itemName);
        for (const [stat, value] of Object.entries(effects)) {
            this.updateStat(character, stat, -value);
        }
    },
    
    checkHealth: function(character) {
        return this.stats[character]?.health || 0;
    },
    
    heal: function(character, amount) {
        if (this.stats[character]) {
            this.stats[character].health = Math.min(
                this.stats[character].health + amount,
                this.stats[character].maxHealth
            );
            return true;
        }
        return false;
    },
    
    takeDamage: function(character, amount) {
        if (this.stats[character]) {
            this.stats[character].health = Math.max(
                this.stats[character].health - amount,
                0
            );
            return this.stats[character].health > 0;
        }
        return false;
    }
};

// Combat System
const combatSystem = {
    calculateDamage: function(attacker, defender, weapon = null) {
        const baseDamage = 10;
        const attackBonus = characterStats.getStat(attacker, 'combat');
        const defenseBonus = characterStats.getStat(defender, 'defense');
        
        if (weapon) {
            const weaponEffects = inventorySystem.getItemEffects(weapon);
            attackBonus += (weaponEffects.combat || 0);
        }
        
        const damage = Math.max(1, baseDamage + attackBonus - defenseBonus);
        return damage;
    },
    
    performAttack: function(attacker, defender, weapon = null) {
        const damage = this.calculateDamage(attacker, defender, weapon);
        const isAlive = characterStats.takeDamage(defender, damage);
        
        return {
            damage,
            isAlive,
            attacker: characterStats.stats[attacker].name,
            defender: characterStats.stats[defender].name
        };
    },
    
    checkCombatOutcome: function(character1, character2) {
        const health1 = characterStats.checkHealth(character1);
        const health2 = characterStats.checkHealth(character2);
        
        if (health1 <= 0) return { winner: character2, loser: character1 };
        if (health2 <= 0) return { winner: character1, loser: character2 };
        return null;
    },
    
    handleCombat: function(character1, character2, weapon1 = null, weapon2 = null) {
        const combatLog = [];
        
        while (true) {
            // Character 1 attacks
            const attack1 = this.performAttack(character1, character2, weapon1);
            combatLog.push(`${attack1.attacker} attacks ${attack1.defender} for ${attack1.damage} damage!`);
            
            // Check if combat is over
            const outcome = this.checkCombatOutcome(character1, character2);
            if (outcome) {
                combatLog.push(`${characterStats.stats[outcome.winner].name} wins the battle!`);
                return {
                    winner: outcome.winner,
                    loser: outcome.loser,
                    log: combatLog
                };
            }
            
            // Character 2 attacks
            const attack2 = this.performAttack(character2, character1, weapon2);
            combatLog.push(`${attack2.attacker} attacks ${attack2.defender} for ${attack2.damage} damage!`);
            
            // Check if combat is over
            const outcome2 = this.checkCombatOutcome(character1, character2);
            if (outcome2) {
                combatLog.push(`${characterStats.stats[outcome2.winner].name} wins the battle!`);
                return {
                    winner: outcome2.winner,
                    loser: outcome2.loser,
                    log: combatLog
                };
            }
        }
    }
};

// Quest System
const questSystem = {
    quests: {
        main: {
            rescueTumnus: {
                title: "Rescue Mr. Tumnus",
                description: "Save Mr. Tumnus from the White Witch's prison",
                status: "available",
                requirements: {
                    items: ["lantern", "rope"],
                    relationships: {
                        tumnus: 3
                    }
                },
                rewards: {
                    experience: 100,
                    items: ["tumnusGift"],
                    relationships: {
                        tumnus: 5,
                        beavers: 2
                    }
                }
            },
            meetAslan: {
                title: "Meet Aslan",
                description: "Journey to meet the great lion Aslan",
                status: "locked",
                requirements: {
                    completedQuests: ["rescueTumnus"],
                    relationships: {
                        beavers: 3
                    }
                },
                rewards: {
                    experience: 200,
                    items: ["aslanBlessing"],
                    relationships: {
                        aslan: 5
                    }
                }
            },
            defeatWitch: {
                title: "Defeat the White Witch",
                description: "Face the White Witch in the final battle",
                status: "locked",
                requirements: {
                    completedQuests: ["meetAslan"],
                    items: ["sword", "shield"],
                    relationships: {
                        aslan: 5
                    }
                },
                rewards: {
                    experience: 500,
                    items: ["crown"],
                    relationships: {
                        narnia: 10
                    }
                }
            }
        },
        side: {
            helpBeavers: {
                title: "Help the Beavers",
                description: "Assist Mr. and Mrs. Beaver with their dam",
                status: "available",
                requirements: {
                    items: ["tools"]
                },
                rewards: {
                    experience: 50,
                    items: ["beaverGift"],
                    relationships: {
                        beavers: 3
                    }
                }
            },
            findTurkishDelight: {
                title: "Find Turkish Delight",
                description: "Search for the magical Turkish Delight",
                status: "available",
                requirements: {
                    stealth: 2
                },
                rewards: {
                    experience: 30,
                    items: ["turkishDelight"],
                    relationships: {
                        edmund: 2
                    }
                }
            }
        }
    },
    
    checkRequirements: function(questId) {
        const quest = this.quests.main[questId] || this.quests.side[questId];
        if (!quest) return false;
        
        // Check item requirements
        if (quest.requirements.items) {
            for (const item of quest.requirements.items) {
                if (!inventorySystem.hasItem(item)) return false;
            }
        }
        
        // Check relationship requirements
        if (quest.requirements.relationships) {
            for (const [character, level] of Object.entries(quest.requirements.relationships)) {
                if (relationships[character] < level) return false;
            }
        }
        
        // Check completed quests requirements
        if (quest.requirements.completedQuests) {
            for (const requiredQuest of quest.requirements.completedQuests) {
                if (this.quests.main[requiredQuest].status !== "completed") return false;
            }
        }
        
        return true;
    },
    
    startQuest: function(questId) {
        const quest = this.quests.main[questId] || this.quests.side[questId];
        if (!quest || quest.status !== "available") return false;
        
        if (this.checkRequirements(questId)) {
            quest.status = "inProgress";
            return true;
        }
        return false;
    },
    
    completeQuest: function(questId) {
        const quest = this.quests.main[questId] || this.quests.side[questId];
        if (!quest || quest.status !== "inProgress") return false;
        
        quest.status = "completed";
        
        // Apply rewards
        if (quest.rewards.items) {
            for (const item of quest.rewards.items) {
                inventorySystem.addItem(item);
            }
        }
        
        if (quest.rewards.relationships) {
            for (const [character, value] of Object.entries(quest.rewards.relationships)) {
                relationships[character] += value;
            }
        }
        
        // Unlock dependent quests
        for (const [id, otherQuest] of Object.entries(this.quests.main)) {
            if (otherQuest.requirements.completedQuests?.includes(questId)) {
                otherQuest.status = "available";
            }
        }
        
        return true;
    },
    
    getAvailableQuests: function() {
        const available = [];
        for (const [id, quest] of Object.entries(this.quests.main)) {
            if (quest.status === "available") available.push({ id, ...quest });
        }
        for (const [id, quest] of Object.entries(this.quests.side)) {
            if (quest.status === "available") available.push({ id, ...quest });
        }
        return available;
    },
    
    getInProgressQuests: function() {
        const inProgress = [];
        for (const [id, quest] of Object.entries(this.quests.main)) {
            if (quest.status === "inProgress") inProgress.push({ id, ...quest });
        }
        for (const [id, quest] of Object.entries(this.quests.side)) {
            if (quest.status === "inProgress") inProgress.push({ id, ...quest });
        }
        return inProgress;
    }
};

// Relationship System
const relationshipSystem = {
    relationships: {
        peter: {
            susan: 5,
            edmund: 3,
            lucy: 5,
            tumnus: 0,
            beavers: 0,
            aslan: 0,
            witch: 0
        },
        susan: {
            peter: 5,
            edmund: 3,
            lucy: 5,
            tumnus: 0,
            beavers: 0,
            aslan: 0,
            witch: 0
        },
        edmund: {
            peter: 3,
            susan: 3,
            lucy: 3,
            tumnus: 0,
            beavers: 0,
            aslan: 0,
            witch: 0
        },
        lucy: {
            peter: 5,
            susan: 5,
            edmund: 3,
            tumnus: 0,
            beavers: 0,
            aslan: 0,
            witch: 0
        }
    },
    
    updateRelationship: function(character1, character2, value) {
        if (this.relationships[character1] && this.relationships[character1][character2] !== undefined) {
            this.relationships[character1][character2] = Math.max(-10, Math.min(10, 
                this.relationships[character1][character2] + value));
            return true;
        }
        return false;
    },
    
    getRelationship: function(character1, character2) {
        return this.relationships[character1]?.[character2] || 0;
    },
    
    getRelationshipLevel: function(character1, character2) {
        const value = this.getRelationship(character1, character2);
        if (value >= 8) return "best friends";
        if (value >= 5) return "friends";
        if (value >= 2) return "acquaintances";
        if (value >= -2) return "neutral";
        if (value >= -5) return "unfriendly";
        if (value >= -8) return "enemies";
        return "mortal enemies";
    },
    
    handleInteraction: function(character1, character2, interactionType) {
        const modifiers = {
            help: 2,
            gift: 1,
            fight: -3,
            betray: -5,
            save: 4,
            insult: -2
        };
        
        const modifier = modifiers[interactionType] || 0;
        this.updateRelationship(character1, character2, modifier);
        
        // Some interactions affect both characters
        if (interactionType === "help" || interactionType === "gift" || 
            interactionType === "fight" || interactionType === "betray") {
            this.updateRelationship(character2, character1, modifier);
        }
        
        return this.getRelationshipLevel(character1, character2);
    },
    
    checkAlliance: function(character1, character2) {
        const relationship = this.getRelationship(character1, character2);
        return relationship >= 5;
    },
    
    checkEnmity: function(character1, character2) {
        const relationship = this.getRelationship(character1, character2);
        return relationship <= -5;
    },
    
    getGroupRelationship: function(group1, group2) {
        let total = 0;
        let count = 0;
        
        for (const char1 of group1) {
            for (const char2 of group2) {
                total += this.getRelationship(char1, char2);
                count++;
            }
        }
        
        return count > 0 ? total / count : 0;
    }
};

// Dialogue System
const dialogueSystem = {
    dialogues: {
        tumnus: {
            first_meeting: {
                text: "Hello! I'm Mr. Tumnus, a faun. What brings you to Narnia?",
                options: [
                    {
                        text: "I came through a wardrobe",
                        response: "A wardrobe? How curious! Would you like to join me for tea?",
                        effects: {
                            relationship: 1,
                            next: "tea_invitation"
                        }
                    },
                    {
                        text: "I'm lost",
                        response: "Oh dear! Let me help you. My house is just nearby.",
                        effects: {
                            relationship: 1,
                            next: "offer_help"
                        }
                    },
                    {
                        text: "What's a faun?",
                        response: "We're creatures of the forest, half-man and half-goat.",
                        effects: {
                            knowledge: ["fauns"],
                            next: "explain_narnia"
                        }
                    }
                ]
            },
            tea_invitation: {
                text: "My house is just around the corner. We'll have tea and cakes!",
                options: [
                    {
                        text: "That sounds lovely",
                        response: "Wonderful! Follow me!",
                        effects: {
                            relationship: 2,
                            next: "at_tumnus_house"
                        }
                    },
                    {
                        text: "I should get back",
                        response: "Oh... well, perhaps another time then.",
                        effects: {
                            relationship: -1,
                            next: "end"
                        }
                    }
                ]
            }
        },
        beavers: {
            first_meeting: {
                text: "Psst! Over here! We need to talk about Aslan.",
                options: [
                    {
                        text: "Who's Aslan?",
                        response: "Why, he's the true king of Narnia! The great lion himself!",
                        effects: {
                            knowledge: ["aslan"],
                            next: "explain_aslan"
                        }
                    },
                    {
                        text: "Why are we whispering?",
                        response: "The trees have ears, and not all of them are on our side.",
                        effects: {
                            knowledge: ["spies"],
                            next: "explain_danger"
                        }
                    }
                ]
            },
            explain_aslan: {
                text: "Aslan is on the move. The prophecy speaks of four children...",
                options: [
                    {
                        text: "Tell me about the prophecy",
                        response: "When Adam's flesh and Adam's bone sits at Cair Paravel in throne...",
                        effects: {
                            knowledge: ["prophecy"],
                            next: "explain_prophecy"
                        }
                    },
                    {
                        text: "Is it safe to talk here?",
                        response: "Come to our dam. We can speak freely there.",
                        effects: {
                            next: "invite_to_dam"
                        }
                    }
                ]
            }
        }
    },
    
    startDialogue: function(character, dialogueId) {
        const dialogue = this.dialogues[character]?.[dialogueId];
        if (!dialogue) return null;
        
        return {
            text: dialogue.text,
            options: dialogue.options.map(opt => ({
                text: opt.text,
                id: this.dialogues[character]?.[opt.effects.next] ? opt.effects.next : null
            }))
        };
    },
    
    selectOption: function(character, dialogueId, optionIndex) {
        const dialogue = this.dialogues[character]?.[dialogueId];
        if (!dialogue || !dialogue.options[optionIndex]) return null;
        
        const option = dialogue.options[optionIndex];
        const effects = option.effects;
        
        // Apply relationship changes
        if (effects.relationship) {
            relationshipSystem.updateRelationship(selectedCharacter, character, effects.relationship);
        }
        
        // Add knowledge
        if (effects.knowledge) {
            effects.knowledge.forEach(knowledge => {
                // Assuming we have a knowledge system
                // knowledgeSystem.addKnowledge(knowledge);
            });
        }
        
        return {
            response: option.response,
            nextDialogue: effects.next === "end" ? null : effects.next
        };
    },
    
    getAvailableDialogues: function(character) {
        return Object.keys(this.dialogues[character] || {}).filter(dialogueId => {
            // Add conditions for dialogue availability here
            return true;
        });
    },
    
    hasDialogue: function(character, dialogueId) {
        return !!this.dialogues[character]?.[dialogueId];
    }
};

// Export all systems
export {
    additionalScenes,
    inventorySystem,
    characterStats,
    combatSystem,
    questSystem,
    relationshipSystem,
    dialogueSystem
}; 