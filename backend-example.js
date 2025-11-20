/**
 * Example Backend Implementation for Email OTP Authentication
 * This is a Node.js/Express example with SendGrid email service
 * 
 * Installation:
 * npm install express @sendgrid/mail dotenv express-rate-limit
 */

const express = require('express');
const sgMail = require('@sendgrid/mail');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
app.use(express.json());

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// In-memory storage (use Redis or database in production)
const otpStore = new Map();

// Rate limiting - 5 requests per 15 minutes per IP
const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many OTP requests, please try again later.'
});

/**
 * Generate a 6-digit OTP
 */
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP via email
 */
async function sendOTPEmail(email, otp) {
    const msg = {
        to: email,
        from: process.env.SENDER_EMAIL, // Your verified sender
        subject: 'Your UIET.social Verification Code',
        text: `Your verification code is: ${otp}. This code will expire in 5 minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0;">UIET.social</h1>
                </div>
                <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #333;">Your Verification Code</h2>
                    <p style="color: #666; font-size: 16px;">Enter this code to complete your login:</p>
                    <div style="background: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        <h1 style="color: #667eea; font-size: 36px; letter-spacing: 5px; margin: 0;">${otp}</h1>
                    </div>
                    <p style="color: #999; font-size: 14px;">This code will expire in 5 minutes.</p>
                    <p style="color: #999; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        © 2025 UIET.social - Student Community Platform
                    </p>
                </div>
            </div>
        `,
    };

    await sgMail.send(msg);
}

/**
 * Endpoint: Send OTP
 */
app.post('/api/auth/send-otp', otpLimiter, async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email address'
            });
        }

        // Generate OTP
        const otp = generateOTP();
        const expiry = Date.now() + (5 * 60 * 1000); // 5 minutes

        // Store OTP (in production, use Redis with TTL)
        otpStore.set(email, {
            otp,
            expiry,
            attempts: 0
        });

        // Send email
        await sendOTPEmail(email, otp);

        // Clean up after 5 minutes
        setTimeout(() => {
            otpStore.delete(email);
        }, 5 * 60 * 1000);

        res.json({
            success: true,
            message: 'OTP sent successfully'
        });

    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send OTP. Please try again.'
        });
    }
});

/**
 * Endpoint: Verify OTP
 */
app.post('/api/auth/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        // Get stored OTP
        const stored = otpStore.get(email);

        if (!stored) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired or not found'
            });
        }

        // Check expiry
        if (Date.now() > stored.expiry) {
            otpStore.delete(email);
            return res.status(400).json({
                success: false,
                message: 'OTP has expired'
            });
        }

        // Check attempts (max 3)
        if (stored.attempts >= 3) {
            otpStore.delete(email);
            return res.status(400).json({
                success: false,
                message: 'Too many failed attempts'
            });
        }

        // Verify OTP
        if (stored.otp !== otp) {
            stored.attempts++;
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
                attemptsLeft: 3 - stored.attempts
            });
        }

        // OTP verified - clean up
        otpStore.delete(email);

        // Generate JWT token (install jsonwebtoken package)
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: { email }
        });

    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Verification failed. Please try again.'
        });
    }
});

/**
 * Endpoint: Resend OTP (with cooldown)
 */
app.post('/api/auth/resend-otp', otpLimiter, async (req, res) => {
    try {
        const { email } = req.body;

        // Check if there's an existing OTP
        const stored = otpStore.get(email);
        if (stored && stored.lastSent && Date.now() - stored.lastSent < 60000) {
            return res.status(429).json({
                success: false,
                message: 'Please wait before requesting another code'
            });
        }

        // Generate new OTP
        const otp = generateOTP();
        const expiry = Date.now() + (5 * 60 * 1000);

        otpStore.set(email, {
            otp,
            expiry,
            attempts: 0,
            lastSent: Date.now()
        });

        await sendOTPEmail(email, otp);

        res.json({
            success: true,
            message: 'New OTP sent successfully'
        });

    } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to resend OTP'
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

/**
 * Environment Variables (.env file):
 * 
 * SENDGRID_API_KEY=your_sendgrid_api_key
 * SENDER_EMAIL=noreply@uiet.social
 * JWT_SECRET=your_secure_random_string
 * PORT=3000
 */

/**
 * Alternative Email Services:
 * 
 * 1. AWS SES (Amazon Simple Email Service)
 * 2. Mailgun
 * 3. Nodemailer with Gmail/SMTP
 * 4. Postmark
 * 5. SparkPost
 */
