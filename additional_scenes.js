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