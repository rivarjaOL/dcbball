# DSC Hoops Website - Project Updates

## May 2026

### May 2, 2026
- **Summer Site Launch:**
  - Made the Workhouse Warrior Summer 2026 page the main live website at the root URL
  - Redirected the old `/summer/` path back to the main site so families land on one registration page
  - Updated the Apps Script setup notes to reference the current summer registration form and notification recipients

- **Summer Registration Redesign:**
  - Migrated the approved Workhouse Warrior Summer React preview into the live site
  - Added the in-page registration packet that mirrors the Google Form fields and posts to the same Google Form response endpoint
  - Updated GitHub Pages deployment to build the Vite app before publishing

- **Registration Submit Fix:**
  - Changed the registration packet submit path from browser `fetch` to a native hidden form POST so all Google Form fields write to the response sheet
  - Updated documentation and notification script references to the current Summer Workhouse Warrior response sheet

## November 2025

### November 29, 2025
- **Project Organization:**
  - Cleaned up and reorganized the project files to remove outdated versions and unnecessary clutter
  - Streamlined the codebase for easier future maintenance

- **Automatic Deployment:**
  - Configured the website to automatically update whenever changes are made - no manual deployment steps required

- **Mobile Fix (Resolved):**
  - Fixed an issue where tapping the "Register Now" button on mobile phones (iPhone/Android) was incorrectly opening the navigation menu instead of the registration form
  - The registration buttons now work correctly on all devices

- **Printable Registration Form:**
  - Created a PDF version of the registration form (`DSC_HOOPS_Registration_Form.pdf`) for parents/guardians who prefer a paper form or need to share registration information offline

---

### November 24, 2025
- **Logo Visibility Improvements:**
  - Enhanced the main hero logo to display clearly against the dark background
  - Improved the small navigation logo visibility in the top corner

- **Fixed Schedule Link:**
  - The "Training Schedule" link in Step 1 ("Review the Schedule") now works correctly when clicked

- **Email Copy Feature:**
  - Added a "Copy Email" button next to the email link, allowing users to easily copy the email address if their email app doesn't open automatically

---

### November 17, 2025
- **Registration Form Integration:**
  - Connected the new Google Form (built by the client) to the website
  - Set up automatic email notifications - you now receive an email alert immediately when someone submits a registration

