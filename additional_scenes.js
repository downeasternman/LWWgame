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