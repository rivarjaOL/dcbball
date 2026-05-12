# DSC Hoops Website - Project Updates

## May 2026

### May 12, 2026
- **Summer Flex Packages Added:**
  - Added four new Summer Flex workout packages families can register for directly on the website: 5-Workout ($475), 10-Workout ($825), 15-Workout ($1,125), and 20-Workout ($1,395)
  - Flex packages run June 16 - Aug 13 on afternoons (Tuesday 2 & 3 PM, Wednesday and Thursday 4 & 5 PM) — sessions are scheduled with DSC Hoops directly at `hoops@dscinternationalgroup.com`
  - Added a "Summer Flex" section on the landing page between Pricing and Spring Sessions, and a Flex schedule sub-block under the existing Summer Schedule
  - The registration packet now has a third "Summer Flex" tab alongside Summer and Spring; selecting a Flex pack jumps the registration form to the right track automatically
  - Registration drafts for the new Flex track save independently from Summer and Spring drafts so families can switch tabs without losing progress
  - Flex registrations route through the same email notification — the email body now calls out the chosen Flex pack and reminds the office to schedule directly with the family

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

