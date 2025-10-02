# v-FIT Virtual Fitting Room - AI Coding Instructions

## Project Overview
This is **v-FIT**, a virtual fitting room platform built to solve fashion e-commerce return rates by enabling 3D "Digital Twin" avatar creation and virtual try-on experiences. The project is in **Phase 1** (Web Foundation) - early prototype stage.

## Architecture & Tech Stack
- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 with custom CSS variables and dark mode
- **Backend**: Firebase ecosystem - **not yet implemented**
  - Authentication, Firestore, Storage
  - **Firebase Functions**: Serverless triggers for AI/ML service integration
  - **Firebase Hosting**: Target deployment platform for Next.js app
- **3D Rendering**: React Three Fiber (declarative Three.js) + @react-three/drei
- **ML Pipeline**: Decoupled microservice for 3D avatar generation (currently simulated)

## Development Workflow

### Commands & Build Process
- `npm run dev` - Development server with **Turbopack** (faster builds)
- `npm run build` - Production build with **Turbopack**
- `npm start` - Production server
- `npm run lint` - ESLint with Next.js rules

### Environment Setup
Firebase configuration required in `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Development Recommendation**: Use Firebase Emulator Suite for local development to run Auth, Firestore, Functions, and Storage services locally for safe, fast, cost-free development.

## Project-Specific Conventions

### Styling System
- Uses **Tailwind v4** with `@import "tailwindcss"` in `globals.css`
- Custom CSS variables defined with `@theme inline` syntax
- Dark mode via `prefers-color-scheme` with `--background`/`--foreground` variables
- Typography: Geist Sans/Mono fonts loaded via `next/font/google`

### File Structure
- **App Router**: All routes in `app/` directory
- **Components**: Reusable React components in `components/` (subdivide into `ui/` and `3d/` as needed)
- **Library**: Helper functions and configs in `lib/` (e.g., firebase.js)
- **Assets**: Static files in `public/` (SVG icons, .glb models, images)
- **TypeScript**: Strict mode enabled, paths alias `@/*` points to root

### Code Patterns
- **Component Naming**: PascalCase for all React components (e.g., `FittingRoom`, `AvatarModel`)
- **Styling**: Tailwind CSS only - use utility classes, avoid custom CSS files unless absolutely necessary
- **Linting**: ESLint + Prettier configured - all code must adhere to project rules
- **3D Components**: Declarative React Three Fiber pattern - treat 3D objects as reusable React components
- **3D Helpers**: Use @react-three/drei for common tasks (OrbitControls, useGLTF, Suspense)
- **3D Assets**: .glb format preferred for web efficiency
- **Performance**: Keep models low-poly, compress textures for web delivery

## Development Focus Areas

### Current Implementation Status
- ✅ Basic Next.js setup with TypeScript
- ✅ Tailwind CSS configuration
- ⏳ **Firebase integration not implemented yet**
- ⏳ **3D canvas/Three.js not implemented yet**
- ⏳ **Authentication flow not built**

### Key Missing Components to Build
1. **Firebase SDK integration** - Authentication, Firestore setup
2. **3D rendering canvas** - Three.js/React Three Fiber implementation
3. **Avatar creation flow** - User onboarding wizard
4. **ML pipeline interface** - API routes for 3D body reconstruction

## ML Pipeline Architecture (Conceptual)

The 3D avatar generation system is designed as a **decoupled microservice** (deployed independently, e.g., Google Cloud Run) that communicates with the Next.js backend via Firebase Functions through a simple REST API.

### Pipeline Flow
1. **Input**: User uploads 2D photos (stored in Firebase Storage)
2. **Processing**: 2D landmark/silhouette detection → 3D parametric mesh reconstruction (SMPL model)
3. **Output**: Textured .glb file URL returned to frontend
4. **Integration**: Firebase Functions act as serverless triggers, calling the ML service and handling responses

**Current Status**: This entire pipeline is **simulated** ("Wizard of Oz") for prototype development. The project currently uses pre-made 3D models.

### Important Notes
- Project is in **early prototype phase** - most core features are planned but not implemented
- Current `app/page.tsx` is default Next.js starter template
- Firebase dependency exists but no implementation files present
- Focus on foundational web platform before mobile AR (Phase 2) or headset AR (Phase 3)

When implementing new features, prioritize the Phase 1 roadmap: authentication setup, 3D fitting room canvas, avatar creation flow, and ML pipeline integration.