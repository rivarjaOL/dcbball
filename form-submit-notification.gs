/**
 * Google Apps Script for Workhouse Basketball Registration Form
 * 
 * This script automatically sends email notifications when a new form submission
 * is received. It sends an email to hoops@dscinternationalgroup.com with
 * jason.t.rivard@gmail.com in CC.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet that receives form responses
 * 2. Go to Extensions → Apps Script
 * 3. Paste this entire file into the script editor
 * 4. Save the project (File → Save or Ctrl+S)
 * 5. Click on the clock icon (Triggers) in the left sidebar
 * 6. Click "+ Add Trigger" button
 * 7. Configure:
 *    - Function: onFormSubmit
 *    - Event source: From spreadsheet
 *    - Event type: On form submit
 * 8. Click Save
 * 9. Authorize the script when prompted (it needs permission to send emails)
 * 
 * The script will now automatically run whenever a new form is submitted.
 */

function onFormSubmit(e) {
  // Tracking sheet URL
  var sheetUrl = 'https://docs.google.com/spreadsheets/d/1SwJiDkuAVBlcTsCkliZUGUyiE65AOE_JaHdf7-aclLM/edit?resourcekey=&gid=241800929#gid=241800929';
  
  // Extract form values from the event object
  var named = e.namedValues || {};
  
  // Get the athlete's name from the form submission
  // The key must match exactly the column header in your responses sheet
  var playerName = 'Unknown player';
  if (named["Athlete's Name"] && named["Athlete's Name"][0]) {
    playerName = named["Athlete's Name"][0];
  } else {
    // Log a warning if the name field is missing
    Logger.log('Warning: Athlete\'s Name not found in form submission');
  }
  
  // Build email subject
  var subject = 'New form submission: ' + playerName;
  
  // Build email body
  var body = 'A new Workhouse Basketball registration form was submitted for ' + playerName + '.\n\n' +
             'View the tracking sheet: ' + sheetUrl + '\n\n' +
             'This is an automated notification from the registration form.';
  
  // Send email
  try {
    MailApp.sendEmail({
      to: 'hoops@dscinternationalgroup.com',
      cc: 'jason.t.rivard@gmail.com',
      subject: subject,
      body: body
    });
    
    // Log successful email send
    Logger.log('Email notification sent for: ' + playerName);
  } catch (error) {
    // Log any errors that occur
    Logger.log('Error sending email notification: ' + error.toString());
    throw error; // Re-throw to see error in Apps Script execution log
  }
}

