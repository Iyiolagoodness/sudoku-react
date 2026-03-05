# Sudoku Studio

A sleek, dark-themed Sudoku game built with React.

## Quick Start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
sudoku-studio/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Board.jsx              # 9×9 grid rendering
│   │   ├── Board.module.css
│   │   ├── NumPad.jsx             # Number input pad (1–9)
│   │   ├── NumPad.module.css
│   │   ├── Sidebar.jsx            # Timer, difficulty, controls
│   │   ├── Sidebar.module.css
│   │   ├── SudokuStudio.jsx       # Main orchestrator
│   │   ├── SudokuStudio.module.css
│   │   ├── WinOverlay.jsx         # Victory screen
│   │   └── WinOverlay.module.css
│   ├── hooks/
│   │   ├── useSudokuGame.js       # All game state logic
│   │   └── useTimer.js            # Timer hook
│   ├── utils/
│   │   └── sudoku.js              # Puzzle generation & solving engine
│   ├── App.jsx
│   ├── index.css                  # CSS variables & resets
│   └── index.js
├── package.json
└── README.md
```

## Features

- **4 difficulty levels** — Easy, Medium, Hard, Expert
- **Pencil / notes mode** — mark candidate numbers per cell
- **Auto error checking** — highlights wrong entries in red (toggleable)
- **Undo** — full move history
- **Hints** — 3 per game, reveals a random unsolved cell
- **Keyboard support** — arrow keys to navigate, 1–9 to input, P to toggle pencil
- **Live timer** with progress bar
- **Responsive** — mobile numpad below board, desktop numpad in sidebar

## Build for Production

```bash
npm run build
```
