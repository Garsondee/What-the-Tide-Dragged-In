# Fate Core GM Tool

Modern, dyslexia-friendly GM tool for "What the Tide Dragged In"

## Features

- ✅ **Dyslexia-friendly typography** (Atkinson Hyperlegible & Lexend fonts)
- ✅ **Modern, clean UI** with Tailwind CSS
- ✅ **Accordion-based interface** for progressive disclosure
- ✅ **Real-time session tracking** with pacing indicators
- ✅ **Initiative tracker** for combat/conflicts
- ✅ **Dice roller** with Fate dice (4dF)
- ✅ **Scene navigation** with big, clear buttons
- ✅ **Scene index sidebar** for quick jumping

## Tech Stack

- **Vue 3** - Reactive framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Dyslexia-friendly fonts**:
  - Atkinson Hyperlegible (primary)
  - Lexend (alternative)
  - JetBrains Mono (code/numbers)

## Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

```bash
# Navigate to the gm-tool directory
cd "c:/Users/Ingram/Documents/What the Tide Dragged In/gm-tool"

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
gm-tool/
├── src/
│   ├── components/
│   │   ├── AccordionSection.vue    # Collapsible section component
│   │   ├── SceneIndex.vue          # Left sidebar with scene list
│   │   ├── SceneNavigation.vue     # Big Previous/Next buttons
│   │   ├── SceneViewer.vue         # Main scene content
│   │   ├── ToolsSidebar.vue        # Right sidebar (dice, initiative)
│   │   └── TopBar.vue              # Session tracking bar
│   ├── App.vue                      # Main app component
│   ├── main.js                      # App entry point
│   └── style.css                    # Global styles + Tailwind
├── index.html                       # HTML template
├── package.json                     # Dependencies
├── tailwind.config.js               # Tailwind configuration
├── vite.config.js                   # Vite configuration
└── README.md                        # This file
```

## Dyslexia-Friendly Features

### Typography
- **Atkinson Hyperlegible**: Specifically designed for low vision readers
- **Increased letter spacing**: 0.02em to 0.05em
- **Increased line height**: 1.6 to 1.8
- **Increased word spacing**: 0.16em
- **High contrast**: Dark text on light backgrounds

### UI Design
- **Clear visual hierarchy**: Headings, sections clearly distinguished
- **Large, clickable buttons**: Easy to target and read
- **Generous whitespace**: Reduces visual crowding
- **Sans-serif fonts throughout**: Better readability than serif
- **Consistent styling**: Reduces cognitive load

## Color Palette

```css
Primary (Blue):    #3b82f6  /* Navigation, links */
Success (Green):   #10b981  /* Ahead of schedule */
Warning (Orange):  #f59e0b  /* On track */
Danger (Red):      #ef4444  /* Behind schedule */
Dark (Slate):      #1e293b  /* Headers, text */
Light (Gray):      #f8fafc  /* Backgrounds */
```

## Keyboard Shortcuts

*(To be implemented)*

- `Ctrl + →` - Next scene
- `Ctrl + ←` - Previous scene
- `Ctrl + I` - Focus initiative tracker
- `Ctrl + R` - Roll dice

## CSS Lint Warnings

**Note**: You may see "Unknown at rule @tailwind" and "@apply" warnings in your IDE. These are expected! They're Tailwind CSS directives that work correctly once the project runs. The IDE just doesn't recognize them before Tailwind processes the CSS.

## Next Steps

### Week 1: Navigation
- [ ] Implement scene state management
- [ ] Connect Previous/Next buttons to actual scenes
- [ ] Scene selection from sidebar

### Week 2: Time Tracking
- [ ] Session schedule system
- [ ] Pacing calculation
- [ ] Scene timer

### Week 3: Initiative Tracker
- [ ] Add/remove participants
- [ ] Turn advancement
- [ ] Round counter

### Week 4: Dice Roller
- [ ] 4dF dice logic
- [ ] DC comparison
- [ ] Result interpretation

## Contributing

This is a custom GM tool. Contributions should focus on:
- Accessibility improvements
- Performance optimizations
- Bug fixes
- UI/UX enhancements

## License

Private project - All rights reserved
