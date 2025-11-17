# Apps Script Setup Instructions

This document explains how to set up the automatic email notification system for the Workhouse Basketball registration form.

## Prerequisites

- Access to the Google Sheet that receives form responses from the registration form
- The form is located at: https://docs.google.com/forms/d/1wTZ_uWOXX9aNXNUSIN4q3HnQrhTAkb0W9eJO_moAboY/edit
- The tracking sheet is at: https://docs.google.com/spreadsheets/d/1SwJiDkuAVBlcTsCkliZUGUyiE65AOE_JaHdf7-aclLM/edit?resourcekey=&gid=241800929#gid=241800929

## Setup Steps

### Step 1: Open the Form Responses Sheet

1. Open the Google Sheet that receives responses from your registration form
2. This should be the sheet that has columns matching your CSV sample (Timestamp, Email Address, Athlete's Name, etc.)

### Step 2: Open Apps Script Editor

1. In the Google Sheet, click on **Extensions** in the menu bar
2. Select **Apps Script** from the dropdown menu
3. This will open a new tab with the Apps Script editor

### Step 3: Add the Script Code

1. In the Apps Script editor, you'll see a default function (usually `myFunction`)
2. Delete any existing code in the editor
3. Open the file `form-submit-notification.gs` from this project
4. Copy the entire contents of that file
5. Paste it into the Apps Script editor
6. Save the project:
   - Click **File → Save** (or press `Ctrl+S` / `Cmd+S`)
   - Give the project a name like "Form Submit Email Notification"

### Step 4: Create the Trigger

1. In the Apps Script editor, click on the **clock icon** (⏰) in the left sidebar, or go to **Triggers** in the left menu
2. Click the **"+ Add Trigger"** button at the bottom right
3. Configure the trigger settings:
   - **Function to run**: Select `onFormSubmit` from the dropdown
   - **Event source**: Select `From spreadsheet`
   - **Event type**: Select `On form submit`
   - **Failure notification settings**: Choose how often you want to be notified of failures (e.g., "Immediately")
4. Click **Save**

### Step 5: Authorize the Script

1. When you save the trigger, Google will prompt you to authorize the script
2. Click **Review Permissions**
3. Select your Google account
4. You'll see a warning that "Google hasn't verified this app" - this is normal for custom scripts
5. Click **Advanced** → **Go to [Project Name] (unsafe)**
6. Click **Allow** to grant permissions
7. The script needs permission to:
   - Send emails on your behalf
   - Access the spreadsheet to read form submissions

### Step 6: Test the Setup

1. Submit a test response through your Google Form:
   - Go to the form's public view URL (not the edit URL)
   - Fill out the form with test data
   - Submit the form
2. Verify the email was sent:
   - Check the inbox for `hoops@dscinternationalgroup.com`
   - Check the inbox for `jason.t.rivard@gmail.com` (should be CC'd)
   - The email subject should be: "New form submission: [Player Name]"
   - The email body should contain the tracking sheet link
3. Check the execution log (optional):
   - In Apps Script editor, go to **Executions** (clock icon with play button)
   - You should see a successful execution entry
   - Click on it to see the execution log

## Troubleshooting

### Email Not Received

- Check the Apps Script execution log for errors
- Verify the trigger is set up correctly (should show "On form submit" event)
- Make sure the script has been authorized
- Check spam/junk folders

### Player Name Shows as "Unknown player"

- Verify the column header in your responses sheet is exactly "Athlete's Name" (case-sensitive)
- Check the execution log to see if there are any warnings

### Script Errors

- Open the Apps Script editor
- Go to **Executions** to see error details
- Check that the function name matches exactly: `onFormSubmit`
- Verify the trigger is pointing to the correct function

## Maintenance

- The script will automatically run for every new form submission
- No manual intervention is needed once set up
- If you change the form structure or column headers, you may need to update the script

## Notes

- The script uses the exact column header "Athlete's Name" to extract the player name
- If you rename this column in your responses sheet, update the script accordingly
- The tracking sheet URL is hardcoded in the script - update it if the sheet moves or changes

