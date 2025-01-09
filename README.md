# NIL Fund Matrix Calculator

A web-based calculator for NCAA team endowment planning that helps determine the necessary endowment size for sustaining NIL (Name, Image, Likeness) payments or distribute a given endowment across a roster of players.

## Features

- **Interactive Matrix Grid**: Input roster sizes based on player ratings (0-5 stars) and years of experience (0-5+ years)
- **Real-time Salary Display**: Shows calculated annual salary for each player category
- **Two Operating Modes**:
  - Build Roster: Create a custom roster and calculate required endowment
  - Enter Endowment: Input an endowment amount and get an optimal roster distribution
- **Automatic Calculations**:
  - 8% annual return rate for endowment sustainability
  - Base salary of $200,000 for 3-star players with 2 years experience
  - Salary multipliers based on star rating and experience
- **Roster Controls**:
  - Randomize: Generate a random 13-player roster
  - Clear: Reset the entire grid
  - Player Counter: Tracks total roster size (must be exactly 13 players)
- **Endowment Limits**: Shows minimum and maximum endowment requirements

## Usage

### Build Roster Mode
1. Input the number of players in each category (star rating + experience)
2. Monitor the player count (must total 13)
3. Click "Calculate Endowment" to see required fund size
4. Use "Randomize" for quick roster generation
5. Use "Clear Grid" to start over

### Enter Endowment Mode
1. Enter endowment amount in millions (e.g., 14.5 for $14.5 million)
2. Click "Distribute Roster" to generate an optimal roster
3. View the distributed roster in the matrix

## Technical Details

### Salary Calculation
- Base salary: $200,000 (3-star, 2-year experience)
- Star multiplier: (stars - 3) * 0.2 + 1
- Year multiplier: years * 0.2 + 1
- Final multiplier = Star multiplier * Year multiplier

### Roster Constraints
- Fixed roster size: 13 players
- Minimum: 13 0-star freshmen
- Maximum: 13 5-star seniors with 5+ years experience

## Browser Compatibility

The calculator is responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile devices (iOS and Android browsers)
- Tablets

## Development

Built using:
- HTML5
- CSS3 (with Flexbox and CSS Grid)
- Vanilla JavaScript (ES6+)

No external dependencies or frameworks required.

## Installation

1. Clone the repository
2. Open `index.html` in a web browser
3. No build process or server required

## License

MIT License - Feel free to use and modify as needed.