Personal Website
================

Portfolio static site for showcasing the work of Lê Đức Anh (UI/UX & Front-end). Built with semantic HTML5, modular CSS and a sprinkle of vanilla JavaScript for interactive details.

## Project Structure

```
Personal-Website/
├── about.html         # Personal background + timeline cards
├── contact.html       # Contact hero, info cards, form
├── home.html          # Landing page hero + highlights
├── porfolio.html      # Project showcase grid
├── skills.html        # Skill map & progress visuals
├── style.css          # Global styles, layout, animations
├── app.js             # Navigation states, cursor, scroll reveals
├── documents/
│   └── LeDucAnh-CV.pdf  # Downloadable CV placeholder (replace with official file)
└── images/            # Hero portraits, project thumbnails
```

## Tech Highlights

- HTML5 semantic sections with ARIA labeling for navigation and forms.
- Modern CSS: custom properties, Flexbox/Grid layouts, keyframe animations, micro-interactions.
- Vanilla JavaScript (no framework) powering navigation state, cursor trail and scroll-triggered reveals.

## Usage

1. Open `index.html` (auto-redirects to `home.html`) in your browser.
2. Replace `documents/LeDucAnh-CV.pdf` with the latest CV export to keep the download link current.
3. Update social/profile links across the pages if your handles change.

## Development Notes

- The codebase avoids build tooling; just edit HTML/CSS/JS directly.
- When adding new sections, keep the `reveal-on-scroll` class to get the fade-in animation automatically.
- Respect the existing comment blocks; they help reviewers validate layout and clean-code rubrics.
