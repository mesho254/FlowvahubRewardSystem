# FlowvaHub Rewards Page Recreation

## Setup

1. Set up Supabase as above.
2. Backend: cd backend, npm install, add .env, npm start
3. Frontend: cd frontend, npm install, npm run dev

## Routes

- /login: Login page
- /signup: Signup page
- /: Rewards page (protected)

## Assumptions

- Used Express as backend proxy for Supabase to match request.
- Design based on purple theme, modern UI with MUI and inline CSS.
- Interactive elements: Claim/Redeem buttons update state.
- Handle states: Loading spinners, error alerts, empty messages.
- Auth via backend/Supabase.
- Basic form validation.
- Redirects on auth actions.

## Live URL

Deploy and share: [Live Demo](https://flowvahub-reward-system-o1gd.vercel.app/login)

## GitHub

[GitHub Repository](https://github.com/mesho254/FlowvahubRewardSystem.git)