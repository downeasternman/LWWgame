# The Lion, the Witch, and the Wardrobe - Interactive Adventure Game

An immersive text-based adventure game based on C.S. Lewis's beloved classic "The Lion, the Witch, and the Wardrobe". Step into the magical world of Narnia and experience the story from the perspective of any of the four Pevensie children.

## Features

- **Character Selection**: Choose to play as Peter, Susan, Edmund, or Lucy, each with unique traits and special abilities
- **Dynamic Storytelling**: Experience different dialogue and reactions based on your chosen character
- **Meaningful Choices**: Your decisions affect relationships, story progression, and outcomes
- **Progress Tracking**: Game tracks your relationships with characters, inventory items, and story milestones
- **Multiple Storylines**: Explore various paths through Narnia, from the initial discovery to the final battle
- **Character-Specific Content**: Each character has their own perspective on events and unique dialogue options

## How to Play

1. Open `index.html` in a modern web browser
2. Select your character from the four Pevensie children:
   - **Peter**: The eldest, with strong leadership abilities
   - **Susan**: The practical one, known for wisdom and archery
   - **Edmund**: The complex character, capable of growth and redemption
   - **Lucy**: The youngest, with strong faith and adventurous spirit

3. Read the story text and make choices by clicking the buttons provided
4. Your choices will affect:
   - Relationships with other characters
   - Story progression
   - Available options in future scenes
   - The outcome of various events

## Game Features

### Relationship System
- Build relationships with key characters like Mr. Tumnus, the Beavers, and Aslan
- Your choices affect how others perceive and interact with you
- Different relationship levels unlock unique dialogue and options

### Inventory System
- Collect and manage items throughout your journey
- Items can affect story options and outcomes
- Some items are character-specific

### Progress Tracking
- Game tracks major story events and discoveries
- Your actions influence the state of Narnia
- Multiple endings based on your choices and relationships

### Special Abilities
Each character has unique abilities that can be used in specific situations:
- **Peter**: Leadership abilities that can inspire others
- **Susan**: Wisdom that helps in decision-making
- **Edmund**: Ability to learn and grow from experiences
- **Lucy**: Special insight into magical elements

## Technical Requirements

- Modern web browser with JavaScript enabled
- Node.js (version 14 or higher)
- npm (Node Package Manager)
- Internet connection (for chess mini-game feature)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/downeasternman/LWWgame.git
   ```
2. Navigate to the project directory:
   ```bash
   cd LWWgame
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. Open your browser and navigate to `http://localhost:3000`

## Development

The game is built using:
- HTML5
- CSS3
- Vanilla JavaScript
- Node.js/Express (for local development server)
- Lichess API (for chess mini-game)

File Structure:
- `index.html`: Main game page
- `game.js`: Core game logic and scenes
- `styles.css`: Game styling
- `additional_scenes.js`: Extended story content
- `server.js`: Express server for local development
- `package.json`: Project dependencies and scripts

## Contributing

Feel free to contribute to the game by:
1. Forking the repository
2. Creating a new branch for your feature
3. Submitting a pull request

## License

This project is open source and available under the MIT License.

## Credits

- Story based on "The Lion, the Witch, and the Wardrobe" by C.S. Lewis
- Chess integration powered by Lichess.org
- Created by Matt Clancy 