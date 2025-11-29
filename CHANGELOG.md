# Project Changelog

## November 2025

### November 29, 2025
- **Project Cleanup:**
  - Consolidated project structure by moving `index.html` and `CHANGELOG.md` from `dcbball-1/` subdirectory to root
  - Removed old/duplicate website versions (`dcbball/`, `dcbball-2/` directories)
  - Removed unused files: local logo images, CSV data exports, empty README files
  - Updated `.gitignore` to prevent accidental commits of sensitive data (form responses, CSVs)

- **Deployment:**
  - Added GitHub Actions workflow (`.github/workflows/deploy.yml`) for automatic GitHub Pages deployment on push to `main`
  - Repository now properly configured for continuous deployment

- **Mobile UX Fix (In Progress):**
  - Investigating and fixing issue where "Register Now" button clicks on mobile devices incorrectly trigger the hamburger menu
  - Applied multiple CSS fixes: `pointer-events: none`, `visibility: hidden`, `touch-action: manipulation`, and `isolation: isolate` to prevent mobile menu elements from intercepting button clicks

- **Documentation:**
  - Added `DSC_HOOPS_Registration_Form.pdf` to repository for reference

### November 24, 2025
- **UI/UX Improvements:**
  - **Hero Logo:** Enhanced visibility by increasing the white glow opacity and blur radius behind the main logo in the hero section to correct low contrast edges.
  - **Navigation Logo:** Improved visibility by increasing the background opacity to near-solid white (90%) for the small logo in the navigation bar.
  - **Schedule Link:** Fixed the "Training Schedule" link in the "How to Get Started" section (Step 1) which was previously unclickable due to a decorative CSS overlay.
  - **Email Functionality:** Added a "Copy Email" component to the "Email to Schedule" section. This provides users with a manual copy button and text field as a fallback for the `mailto:` link, preventing issues with unconfigured default email clients.

### November 17, 2025
- **Backend/Integration:**
  - Connected a new client-built Google Form to the project.
  - Added Google Apps Script email notification functionality for form submissions to ensure immediate alerts when users register.

