import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*', // Allow all origins for simplicity (adjust for production)
  credentials: true,
}));

// ✅ Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ✅ Nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Route: Send OTP
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  // Store OTP in Supabase
  const { error } = await supabase
    .from('email_otps')
    .insert({ email, otp, expires_at: expiresAt });

  if (error) return res.status(500).json({ error: 'Failed to store OTP' });

  try {
    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// ✅ Route: Verify OTP
app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });

  const { data, error } = await supabase
    .from('email_otps')
    .select('*')
    .eq('email', email)
    .eq('otp', otp)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !data) return res.status(401).json({ error: 'Invalid or expired OTP' });

  // OTP is valid → delete it
  await supabase.from('email_otps').delete().eq('id', data.id);

  // Fetch user info
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, name, email, phone, role')
    .eq('email', email)
    .single();

  if (userError || !user) return res.status(200).json({ success: true, user: null });

  res.json({ success: true, user });
});

// ----- WhatsApp OTP routes -----
// Environment variables required:
// WHATSAPP_PHONE_NUMBER_ID - the phone number id from the WhatsApp Business account
// WHATSAPP_ACCESS_TOKEN - bearer token for the WhatsApp Business API
app.post('/api/send-whatsapp-otp', async (req, res) => {
  try {
    const { phone } = req.body || {};
    if (!phone) return res.status(400).json({ error: 'Phone number required' });

    // Normalize phone to E.164-ish digits only (keep leading + if provided)
    const normalized = String(phone).trim();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Store OTP in Supabase table `phone_otps`
    const { error: insertErr } = await supabase
      .from('phone_otps')
      .insert({ phone: normalized, otp, expires_at: expiresAt });
    if (insertErr) {
      console.error('Failed to store phone otp', insertErr);
      return res.status(500).json({ error: 'Failed to store OTP' });
    }

    // Send via WhatsApp Business API (Meta Graph)
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    if (!phoneNumberId || !token) {
      console.error('WhatsApp credentials missing');
      return res.status(500).json({ error: 'WhatsApp credentials not configured' });
    }

    const url = `https://graph.facebook.com/v15.0/${phoneNumberId}/messages`;
    const body = {
      messaging_product: 'whatsapp',
      to: normalized,
      type: 'text',
      text: { body: `Your GreenField Campus OTP is: ${otp}. It expires in 5 minutes.` },
    };

    const r = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const txt = await r.text();
      console.error('WhatsApp send failed', r.status, txt);
      return res.status(500).json({ error: 'Failed to send WhatsApp message' });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('send-whatsapp-otp error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/verify-phone-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body || {};
    if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP required' });

    const normalized = String(phone).trim();

    const { data, error } = await supabase
      .from('phone_otps')
      .select('*')
      .eq('phone', normalized)
      .eq('otp', otp)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) return res.status(401).json({ error: 'Invalid or expired OTP' });

    // delete used OTP
    await supabase.from('phone_otps').delete().eq('id', data.id);

    // attempt to fetch user by phone
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, email, phone, role')
      .eq('phone', normalized)
      .single();

    if (userError || !user) {
      // Fallback: try matching by last 10 digits
      const { data: users, error: usersErr } = await supabase
        .from('users')
        .select('id, name, email, phone, role');
      if (!usersErr && users && users.length) {
        const found = users.find((u) => String(u.phone || '').replace(/\D/g, '').slice(-10) === String(normalized).replace(/\D/g, '').slice(-10));
        if (found) {
          return res.json({ success: true, user: found });
        }
      }
      return res.json({ success: true, user: null });
    }

    return res.json({ success: true, user });
  } catch (err) {
    console.error('verify-phone-otp error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Route: Enquiry form -> send email to configured address
app.post('/api/enquiry', async (req, res) => {
  try {
    const { studentName, parentName, email, phone, message } = req.body || {};
    if (!studentName || !parentName || !email) {
      return res.status(400).json({ error: 'studentName, parentName and email are required' });
    }

    // Default enquiries to configured env var or the provided fixed target
    const toAddress = process.env.ENQUIRY_EMAIL || process.env.EMAIL_USER || 'Jonathansamuel59@gmail.com';
    const subject = `New admission enquiry from ${parentName}`;
    const body = `New admission enquiry received:\n\nStudent Name: ${studentName}\nParent Name: ${parentName}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\nMessage:\n${message || 'N/A'}\n\nReceived at: ${new Date().toISOString()}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toAddress,
      subject,
      text: body,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error('Failed to send enquiry email', err);
    return res.status(500).json({ error: 'Failed to send enquiry' });
  }
});

// ✅ Server setup
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`OTP backend running at http://74.225.192.191:${PORT}`);
});
