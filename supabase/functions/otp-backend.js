
import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*', // Allow all origins for simplicity
    credentials: true,
}
));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  // Store OTP in Supabase
  const { error } = await supabase.from('email_otps').insert({ email, otp, expires_at: expiresAt });
  if (error) return res.status(500).json({ error: 'Failed to store OTP' });

  // Send OTP email
  try {
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

  // OTP is valid, delete it
  await supabase.from('email_otps').delete().eq('id', data.id);

  // Fetch user info (role, id, name, etc.)
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, name, email, phone, role')
    .eq('email', email)
    .single();


  if (userError || !user) return res.status(200).json({ success: true, user: null });

  res.json({ success: true, user });
});

app.listen(4000, () => console.log('OTP backend running on port 4000'));
const PORT = process.env.PORT || 4000;