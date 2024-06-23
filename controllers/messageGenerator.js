// messageGenerator.js

/**
 * Generates an HTML message for the email.
 * @param {string} firstname - The first name of the sender.
 * @param {string} lastname - The last name of the sender.
 * @param {string} email - The email address of the sender.
 * @param {string} phone - The phone number of the sender.
 * @param {string} message - The message content from the sender.
 * @returns {string} The formatted HTML message.
 */
function generateMessage1(firstname, lastname, email, phone, message) {
    return `
      <html>
        <body>
          <h1>New Contact Form Submission</h1>
          <p><strong>First Name:</strong> ${firstname}</p>
          <p><strong>Last Name:</strong> ${lastname}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </body>
      </html>
    `;
  }
  
  module.exports = { generateMessage1 };
  