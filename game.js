// Import game systems
import {
    additionalScenes,
    inventorySystem,
    characterStats,
    combatSystem,
    questSystem,
    relationshipSystem,
    dialogueSystem
} from './additional_scenes.js';

// Game state
let currentScene = 'character_selection';
let selectedCharacter = null;
let inventory = [];
let relationships = {
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
let gameProgress = {
    discoveredNarnia: false,
    metTumnus: false,
    metBeaver: false,
    metAslan: false,
    foundLampPost: false,
    foundCairParavel: false
};

// Character descriptions
const characters = {
    peter: {
        name: "Peter",
        description: "The eldest sibling, responsible and protective. Known for his leadership skills and bravery.",
        traits: ["Leadership", "Courage", "Protectiveness"],
        specialAbility: "Inspire others with your leadership"
    },
    susan: {
        name: "Susan",
        description: "The second eldest, practical and gentle. Known for her wisdom and archery skills.",
        traits: ["Wisdom", "Gentleness", "Practicality"],
        specialAbility: "Use your wisdom to make better decisions"
    },
    edmund: {
        name: "Edmund",
        description: "The third child, initially selfish but capable of great change. Known for his wit and eventual redemption.",
        traits: ["Wit", "Adaptability", "Growth"],
        specialAbility: "Learn from your mistakes and grow"
    },
    lucy: {
        name: "Lucy",
        description: "The youngest, kind-hearted and adventurous. Known for her faith and discovery of Narnia.",
        traits: ["Kindness", "Adventure", "Faith"],
        specialAbility: "See the magic in the world around you"
    }
};

// Add these variables at the top with other game state variables
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
                selectedCharacter = key;
                return `You have chosen to be ${char.name}. ${char.description}`;
            }
        }))
    },
    start: {
        text: function() {
            if (!selectedCharacter || !characters[selectedCharacter]) {
                return "Please select a character to begin your adventure.";
            }
            const char = characters[selectedCharacter];
            return `You are ${char.name} Pevensie, ${char.description.toLowerCase()} You and your siblings have been sent to live with Professor Kirke in his mysterious country house during World War II. One rainy day, while exploring the house, you discover a spare room with nothing in it but a large wardrobe...`;
        },
        choices: [
            {
                text: "Open the wardrobe and step inside",
                nextScene: "wardrobe",
                onSelect: () => {
                    gameProgress.discoveredNarnia = true;
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
            const char = characters[selectedCharacter];
            return `As you step into the wardrobe, you feel something strange. The coats seem to be getting thicker and softer. You push further in, and suddenly you find yourself standing in a snowy forest. The air is crisp and cold, and you can see your breath in front of you. In the distance, you notice a lamppost glowing in the middle of the woods. ${char.name === 'lucy' ? 'Your heart races with excitement at this magical discovery.' : 'You can hardly believe what you\'re seeing.'}`;
        },
        choices: [
            {
                text: "Approach the lamppost",
                nextScene: "lamppost",
                onSelect: () => {
                    gameProgress.foundLampPost = true;
                    return "You walk towards the mysterious lamppost, your footsteps crunching in the snow...";
                }
            },
            {
                text: "Explore the surrounding forest",
                nextScene: "forest_explore",
                onSelect: () => {
                    return "You decide to explore the magical forest around you...";
                }
            }
        ]
    },
    lamppost: {
        text: function() {
            const char = characters[selectedCharacter];
            return `As you approach the lamppost, you hear a rustling in the bushes. A small figure emerges - it's a faun! He introduces himself as Mr. Tumnus and invites you to his home for tea. ${char.name === 'lucy' ? 'You feel an immediate connection with this kind creature.' : 'You\'re cautious but intrigued by this strange being.'}`;
        },
        choices: [
            {
                text: "Accept Mr. Tumnus's invitation",
                nextScene: "tea_with_tumnus",
                onSelect: () => {
                    gameProgress.metTumnus = true;
                    relationships.tumnus += 20;
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
            const char = characters[selectedCharacter];
            return `Mr. Tumnus's home is cozy and warm. As you enjoy tea and toast, he tells you about Narnia and the White Witch who has made it always winter but never Christmas. ${char.name === 'lucy' ? 'You listen with wide-eyed wonder.' : 'You try to process this incredible information.'} Suddenly, he begins to cry, confessing that he was supposed to capture you for the White Witch!`;
        },
        choices: [
            {
                text: "Forgive Mr. Tumnus and promise to keep his secret",
                nextScene: "tumnus_friendship",
                onSelect: () => {
                    relationships.tumnus += 30;
                    return "You show compassion to Mr. Tumnus, understanding his difficult position...";
                }
            },
            {
                text: "Run back to the wardrobe",
                nextScene: "escape_tumnus",
                onSelect: () => {
                    relationships.tumnus -= 20;
                    return "You quickly make your way back through the snowy forest...";
                }
            }
        ]
    },
    tumnus_friendship: {
        text: function() {
            const char = characters[selectedCharacter];
            return `Mr. Tumnus is deeply moved by your forgiveness. He promises to help you and your siblings in the future. ${char.name === 'lucy' ? 'You feel a strong bond forming with this kind faun.' : 'You appreciate his honesty and courage.'} As you prepare to leave, he gives you a small token of friendship - a carved wooden figure of a lion.`;
        },
        choices: [
            {
                text: "Return to the Professor's house",
                nextScene: "return_to_house",
                onSelect: () => {
                    inventory.push("wooden_lion");
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
        text: "You decide to explore the magical forest around you. The trees are tall and the air is fresh. You can hear the birds chirping and the wind rustling through the leaves.",
        choices: [
            {
                text: "Keep exploring",
                nextScene: "forest_explore"
            },
            {
                text: "Return to the wardrobe room",
                nextScene: "start"
            }
        ]
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
        text: "You decide to keep your adventure to yourself for now. It's still early days, and you're not sure what to make of it all.",
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
    siblings: {
        text: function() {
            const char = characters[selectedCharacter];
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
            const char = characters[selectedCharacter];
            return `Mr. Tumnus shows you some of the wonders of Narnia. You see the beauty of the land and the kindness of its people. ${char.name === 'lucy' ? 'Your heart swells with joy at the magic around you.' : 'You\'re amazed by the beauty of this land.'} As you walk, you notice a small house by a frozen river.`;
        },
        choices: [
            {
                text: "Investigate the house by the river",
                nextScene: "beavers_house",
                onSelect: () => {
                    gameProgress.metBeaver = true;
                    return "You approach the cozy-looking house by the frozen river...";
                }
            },
            {
                text: "Continue exploring with Mr. Tumnus",
                nextScene: "narnia_explore",
                onSelect: () => {
                    relationships.tumnus += 10;
                    return "You and Mr. Tumnus continue your exploration of Narnia...";
                }
            }
        ]
    },
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
    },
    ...additionalScenes
};

// Function to update the game display
function updateScene() {
    const scene = scenes[currentScene];
    const storyText = document.getElementById('story-text');
    const choicesDiv = document.getElementById('choices');

    // Update story text
    storyText.textContent = typeof scene.text === 'function' ? scene.text() : scene.text;

    // Clear previous choices
    choicesDiv.innerHTML = '';

    // Add new choices
    scene.choices.forEach(choice => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
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
                    return;
                }
            }
            currentScene = choice.nextScene;
            updateScene();
        };
        choicesDiv.appendChild(button);
    });
}

// Initialize the game
updateScene(); 