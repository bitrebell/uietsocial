# Quick Start Guide - Email Login with OTP

## 🚀 Test It Now (Demo Mode)

### Step 1: Open the Website
Simply open `index.html` in your web browser:
- Double-click the file, OR
- Right-click → Open with → Your browser

### Step 2: Click Login
Look for the purple "Login" button in the top-right corner of the page.

### Step 3: Enter Email
Type any valid email address:
- Example: `student@uiet.social`
- Example: `test@example.com`
- Example: `your.name@gmail.com`

### Step 4: Get Your OTP
After clicking "Send Verification Code", look for the OTP in **TWO PLACES**:

#### Option 1: Success Message (Easy!)
A green success message will appear with the OTP:
```
✅ Verification code sent! (Demo OTP: 123456)
```

#### Option 2: Browser Console
1. Press `F12` or `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)
2. Look for a line like:
```
OTP for student@uiet.social: 123456
```

### Step 5: Enter the OTP
Type the 6-digit code in the boxes. The cursor will automatically move to the next box as you type.

### Step 6: You're In! 🎉
After successful verification:
- The modal will close automatically
- Your username will appear in the navbar (instead of "Login")
- You're now logged in!

### Step 7: Logout (Optional)
Click your username in the navbar and confirm to logout.

---

## 📋 Example Test Run

```
1. Click "Login" button
2. Enter: test@uiet.social
3. Click "Send Verification Code"
4. See message: "✅ Verification code sent! (Demo OTP: 456123)"
5. Enter: 4-5-6-1-2-3 in the boxes
6. Click "Verify & Login"
7. Success! Logged in as "test"
```

---

## 🔧 Common Scenarios

### Didn't receive the code?
1. Check the green success message below the email input
2. Open browser console (F12)
3. Click "Resend" (wait 60 seconds between attempts)

### Wrong code entered?
- Try again - you have up to 3 attempts
- Request a new code if needed

### Code expired?
- Codes expire after 5 minutes
- Click "Resend" to get a new code

---

## 🎯 Features to Try

✅ **Auto-advance**: Type a digit and watch the cursor move automatically
✅ **Backspace navigation**: Press backspace to go to previous box
✅ **Resend cooldown**: Try resending - you'll see a 60-second timer
✅ **Error messages**: Enter wrong OTP to see error handling
✅ **Logout**: Click your username to logout

---

## 📱 Mobile Testing

Works great on mobile devices:
1. Open the website on your phone
2. Login button is touch-friendly
3. OTP inputs are optimized for mobile keyboards
4. All features work smoothly

---

## 🎨 What You'll See

### Login Modal
- Clean, modern design
- Purple gradient matching your site theme
- Smooth animations

### Success States
- Green checkmark and success message
- Button turns green briefly
- Automatic modal close

### Error States
- Red error messages
- Clear instructions
- Option to try again

---

## 💡 Pro Tips

1. **Keep Console Open**: Easier to copy the OTP during testing
2. **Try Different Emails**: Each email gets its own OTP
3. **Test Expiry**: Wait 5 minutes to test OTP expiration
4. **Test Resend**: Try the resend button with timer
5. **Test Logout**: Click username to logout and test login again

---

## 🚀 Ready for Production?

When you're ready to deploy with real email sending:

1. Read `EMAIL_LOGIN_GUIDE.md` for detailed setup
2. Check `backend-example.js` for backend implementation
3. Set up an email service (SendGrid, AWS SES, etc.)
4. Deploy your backend API
5. Update the frontend to call your API

---

## ❓ Questions?

- Check `README.md` for complete implementation details
- Check `EMAIL_LOGIN_GUIDE.md` for comprehensive documentation
- Email: info@uiet.social

---

**Enjoy testing your new login system! 🎉**
