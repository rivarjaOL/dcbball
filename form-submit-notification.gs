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
  var sheetUrl = 'https://docs.google.com/spreadsheets/d/1-_MBTiupAFNOcXvkDpn_FfNhiqAwZoNqULoPw4QFu5o/edit?resourcekey=&gid=453007637#gid=453007637';

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

  // Session column was added 2026-05-07 to flag spring vs. summer registrations
  // in the same sheet. Default to summer for any rows that arrive without it
  // (e.g. legacy submissions or someone using the public form before picking
  // a Session value).
  var sessionLabel = 'Summer';
  var sessionRaw = '';
  if (named['Session'] && named['Session'][0]) {
    sessionRaw = String(named['Session'][0]).trim();
    if (sessionRaw.toLowerCase().indexOf('spring') === 0) {
      sessionLabel = 'Spring';
    }
  }

  // Spring Package column captures the chosen Small Group / Group package for
  // spring registrations. Empty for summer rows.
  var springPackage = '';
  if (named['Spring Package'] && named['Spring Package'][0]) {
    springPackage = String(named['Spring Package'][0]).trim();
  }

  // Build email subject — prefix tells David at a glance which program the
  // family is registering for so follow-up doesn't get crossed.
  var subject = sessionLabel + ' Registration: ' + playerName;

  // Build email body
  var bodyLines = [
    'A new DSC Hoops registration form was submitted for ' + playerName + '.',
    '',
    'Session: ' + (sessionRaw || sessionLabel + ' 2026'),
  ];
  if (springPackage) {
    bodyLines.push('Spring package: ' + springPackage);
  }
  bodyLines.push(
    '',
    'View the tracking sheet: ' + sheetUrl,
    '',
    'This is an automated notification from the registration form.'
  );
  var body = bodyLines.join('\n');

  // Send email
  try {
    MailApp.sendEmail({
      to: 'hoops@dscinternationalgroup.com',
      cc: 'jason.t.rivard@gmail.com',
      subject: subject,
      body: body
    });

    // Log successful email send
    Logger.log('Email notification sent for: ' + playerName + ' (' + sessionLabel + ')');
  } catch (error) {
    // Log any errors that occur
    Logger.log('Error sending email notification: ' + error.toString());
    throw error; // Re-throw to see error in Apps Script execution log
  }
}

