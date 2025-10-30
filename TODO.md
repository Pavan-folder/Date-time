# TODO: Fix Storybook Deployment Errors on Vercel

## Issues Identified
- Storybook addons (background, viewport, measure-addon, outline, interactions) loaded twice
- @emotion/react loaded multiple times
- TypeError: Cannot read properties of undefined (reading 'getGlobalTypes')

## Root Cause
- Inconsistent Storybook package versions
- Incorrect base path configuration for Vercel deployment
- Missing features configuration in Storybook main.ts

## Tasks
- [x] Update all Storybook dependencies to consistent version (^8.6.14)
- [x] Update .storybook/main.ts to set base to '/' for Vercel
- [x] Add features configuration to .storybook/main.ts
- [x] Update .storybook/preview.ts if needed (no changes required)
- [x] Test build locally (build successful, no errors)
- [x] Commit and push changes to GitHub (pushed to blackboxai/update-event-structure branch)
- [x] Add buildCommand to vercel.json for proper Storybook build
- [x] Vercel redeploys automatically and fixes are verified
