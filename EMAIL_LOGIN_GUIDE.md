# Email Login with OTP Verification - User Guide

## Overview
The UIET.social website now includes a secure email-based login system with OTP (One-Time Password) verification.

## Features

### 1. **Email Login**
- Users can log in using their email address
- No password required - uses OTP for authentication
- Clean, modern UI with smooth animations

### 2. **OTP Verification**
- 6-digit verification code sent to email
- 5-minute expiry for security
- Auto-focus on OTP input fields
- Only numeric input allowed
- Backspace navigation between fields

### 3. **Security Features**
- OTP expires after 5 minutes
- One-time use codes
- Session-based authentication
- Secure token generation
- Resend cooldown (60 seconds)

### 4. **User Experience**
- Responsive modal design
- Real-time validation
- Clear error messages
- Success animations
- Touch-friendly on mobile devices

## How to Use

### For Users:

1. **Click the Login Button**
   - Located in the top-right corner of the navigation bar
   
2. **Enter Your Email**
   - Type your email address in the input field
   - Click "Send Verification Code"

3. **Check Your Email**
   - You'll receive a 6-digit OTP code
   - (Demo Mode: The OTP is displayed in the browser console and in a success message)

4. **Enter the OTP**
   - Type the 6-digit code in the verification fields
   - The code auto-advances to the next field as you type

5. **Login Successful**
   - After verification, you'll be logged in
   - Your email username will appear in the navigation bar

6. **Logout**
   - Click your username in the navigation bar
   - Confirm logout when prompted

### Resend Code:
- If you didn't receive the code, click "Resend"
- Wait 60 seconds between resend attempts

## For Developers

### Current Implementation (Demo Mode):
The current implementation stores OTP in `sessionStorage` for demonstration purposes and logs it to the console.

### Production Setup:

To enable actual email sending, you need to:

1. **Set up a Backend API**
   Create an endpoint to handle OTP generation and email sending:
   ```javascript
   POST /api/auth/send-otp
   Body: { email: "user@example.com" }
   ```

2. **Integrate Email Service**
   Use services like:
   - SendGrid
   - AWS SES
   - Mailgun
   - Nodemailer with SMTP

3. **Update the sendOtp Function**
   Replace the simulated API call with actual API request:
   ```javascript
   async sendOtp(email) {
       const response = await fetch('/api/auth/send-otp', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ email })
       });
       return response.json();
   }
   ```

4. **Update the verifyOtp Function**
   ```javascript
   async verifyOtp(otp) {
       const response = await fetch('/api/auth/verify-otp', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ 
               email: this.currentEmail, 
               otp 
           })
       });
       return response.json();
   }
   ```

5. **Implement Proper JWT Authentication**
   - Backend should generate JWT tokens
   - Store tokens securely (httpOnly cookies)
   - Implement token refresh mechanism

### Email Template Example:

```html
Subject: Your UIET.social Verification Code

Hello!

Your verification code is: [OTP_CODE]

This code will expire in 5 minutes.

If you didn't request this code, please ignore this email.

Best regards,
UIET.social Team
```

### Security Recommendations:

1. **Rate Limiting**
   - Limit OTP requests per email (e.g., 3 per hour)
   - Implement CAPTCHA for suspicious activity

2. **Email Validation**
   - Verify email domains
   - Check for disposable email addresses

3. **OTP Storage**
   - Store hashed OTPs in database
   - Clear expired OTPs regularly

4. **Logging**
   - Log authentication attempts
   - Monitor for suspicious patterns

5. **HTTPS Only**
   - Always use HTTPS in production
   - Set secure flags on cookies

## Customization

### Styling:
Edit the CSS variables in the `<style>` section:
- `--primary-bg`: Background colors
- `--card-bg`: Modal background
- `--border-color`: Border colors
- Modal animations: `fadeIn`, `slideUp`

### OTP Configuration:
```javascript
// In the sendOtp function:
this.otpExpiry = Date.now() + (5 * 60 * 1000); // Change expiry time

// In the startResendTimer function:
let timeLeft = 60; // Change resend cooldown
```

### Text Customization:
Update modal content in the `loginModal.innerHTML` section for custom messaging.

## Testing in Demo Mode

1. Click the Login button
2. Enter any valid email format
3. Check the browser console for the OTP
4. The OTP is also displayed in a green success message
5. Enter the OTP in the verification fields
6. You'll be logged in!

## Troubleshooting

**OTP not received:**
- In demo mode, check the browser console
- Check the success message below the email input

**Invalid OTP error:**
- Ensure you're entering the exact 6-digit code
- Check if the code has expired (5 minutes)
- Request a new code if needed

**Can't resend code:**
- Wait for the 60-second cooldown
- The timer is displayed next to the resend button

## Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support  
- Safari: ✅ Full support
- Mobile browsers: ✅ Optimized for touch

## Accessibility
- Keyboard navigation supported
- Auto-focus on inputs
- Clear error messages
- Touch-friendly targets (44px minimum)
- Screen reader compatible

## Support
For issues or questions, contact: info@uiet.social
