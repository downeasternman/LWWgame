# The Lion, the Witch, and the Wardrobe - Interactive Adventure Game

A compact, branching text adventure based on C.S. Lewis's *The Lion, the Witch and the Wardrobe*. Play as **Lucy** or **Edmund**—your choices change relationships, paths through Narnia, and which ending you reach.

## Features (v1)

- **Lucy & Edmund campaigns**: Fully playable; Peter and Susan appear as Coming soon
- **Meaningful branching**: Trust, temptation, betrayal, and mercy set flags that unlock later options and endings
- **Three endings**: Joyous, bittersweet, and hollow—resolved from your play state
- **Inventory & relationships**: Items and bonds that gate real choices (not just HUD numbers)
- **Save / load / new story**: Progress stored in the browser

## How to Play

1. Install and run the local server (below), or open via `npm start`
2. Choose **Lucy** (wonder, friendship, belief) or **Edmund** (temptation and redemption)
3. Read each scene and pick a choice—consequences carry forward
4. Reach one of three endings, then talk to the Professor or play again

## Technical Requirements

- Modern web browser with JavaScript enabled
- Node.js (version 14 or higher)
- npm

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
4. Start the server:
   ```bash
   npm start
   ```
5. Open `http://localhost:3000`

## Development

Built with HTML5, CSS3, vanilla JavaScript (ES modules), and a small Express static server.

File structure:
- `index.html` — main page
- `styles.css` — styling
- `game.js` — core scenes and UI loop
- `additional_scenes.js` — extended branches, endings, inventory
- `characters.js` — character definitions
- `game_state.js` — shared state and ending resolution
- `server.js` — Express static server
- `package.json` — dependencies and scripts

## License

MIT License.

## Credits

- Story based on *The Lion, the Witch and the Wardrobe* by C.S. Lewis
- Created by Matt Clancy
