# Karigar - Hyperlocal Services Marketplace

A production-ready landing page for **Karigar**, a hyperlocal services marketplace connecting customers with verified local service providers.

## 🎯 Overview

Karigar is a React-based landing page designed to feel **local, trustworthy, human, and skill-driven**. It connects nearby customers with verified service providers such as plumbers, electricians, tutors, cleaners, technicians, and home service professionals.

## ✨ Features

- **Modern, Grounded Design**: Clean, spacious layout with confident typography
- **Fully Responsive**: Mobile-first approach with seamless desktop experience
- **Component-Based Architecture**: Reusable, maintainable React components
- **Trust-Focused UI**: Emphasizes verification, reviews, and local connections
- **Dual User Journeys**: Clear separation between Customer and Service Provider flows

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📁 Project Structure

```
Dead-Team/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── HeroSearch.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── FeatureSection.tsx
│   │   ├── TestimonialCard.tsx
│   │   └── Footer.tsx
│   ├── pages/               # Page components
│   │   └── LandingPage.tsx
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── design.json              # Design system reference
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## 🎨 Design System

The design follows the guidelines in `design.json`:

- **Primary Color**: Fresh green/teal (#10b981)
- **Secondary Color**: Muted blue (#3b82f6)
- **Typography**: Inter font family
- **Layout**: Responsive grid system
- **Components**: Rounded corners, soft shadows, subtle animations

## 📱 Sections

1. **Top Navigation Bar**: Sticky navigation with mobile menu
2. **Hero Section**: Headline, search bar, and primary CTAs
3. **How It Works**: Three-step process for customers and providers
4. **Popular Service Categories**: Grid of service types
5. **Why Karigar**: Trust and value propositions
6. **Reviews & Social Proof**: Customer testimonials
7. **Final CTA**: Conversion-focused call-to-action
8. **Footer**: Links, contact info, and legal pages

## 🔗 Navigation Links

The landing page includes navigation to:
- Service Listing Page (`/services`)
- Provider Profile Page
- Customer Dashboard
- Provider Dashboard
- Admin Dashboard (`/admin`)
- Auth pages (`/login`, `/signup`)

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 📝 Notes

- All navigation links are placeholders and should be connected to actual routes
- Dummy data is used for testimonials and categories
- The search functionality redirects to service listing page with query parameters
- Components are designed to be easily customizable and extendable

## 👥 Team

Abdul Rehman, Shahram, Arsal

---

Built with ❤️ for local communities
