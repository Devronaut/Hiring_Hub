# Hiring App

A modern React + TypeScript web application for evaluating, comparing, and building high-performing engineering teams. Built with Vite, Tailwind CSS, and Lucide icons.

## Deployment

This project is deployed on Netlify.

Live Demo: https://hiringhub1.netlify.app/

## Features

•⁠  ⁠Candidate cards with skill, experience, and salary breakdowns
•⁠  ⁠Advanced scoring and skill match analytics
•⁠  ⁠Team builder with selection limits and diversity prompts
•⁠  ⁠Candidate profile modal and comparison tools
•⁠  ⁠Filtering, bookmarking, and exporting team reports
•⁠  ⁠Responsive UI with smooth transitions and accessibility enhancements

## Tech Stack

•⁠  ⁠[React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
•⁠  ⁠[Vite](https://vitejs.dev/) for fast development and builds
•⁠  ⁠[Tailwind CSS](https://tailwindcss.com/) for styling
•⁠  ⁠[Lucide React](https://lucide.dev/) for icons
•⁠  ⁠[Recharts](https://recharts.org/) for analytics dashboards
•⁠  ⁠ESLint, PostCSS, and modern tooling

## Getting Started

### Prerequisites

•⁠  ⁠Node.js (v18+ recommended)
•⁠  ⁠npm or yarn

### Installation

git clone https://github.com/yourusername/hiring-app.git
cd hiring-app
npm install
 ⁠

### Development

Start the development server:
npm run dev

Open [http://localhost:5173](http://localhost:5173) in the browser.

### Build

To build for production:
npm run build
 ⁠

### Lint

To run ESLint:
npm run lint
 ⁠

### Preview

To preview the production build:
npm run preview
 ⁠

## Project Structure

hiring-app/
  src/
    components/      # React components (CandidateCard, TeamBuilder, etc.)
    data/            # Sample and mock data
    types/           # TypeScript types
    utils/           # Utility functions (scoring, filtering, etc.)
    index.css        # Global styles and Tailwind config
    App.tsx          # Main app component
    main.tsx         # Entry point
  public/            # Static assets
  index.html         # HTML template
  package.json       # Scripts and dependencies
  tailwind.config.js # Tailwind configuration
  vite.config.ts     # Vite configuration
