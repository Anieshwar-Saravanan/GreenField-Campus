// Node.js version of parent roll-number login
// Usage: deploy as an Express route or serverless function.
// Requires env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import express from 'express';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
});

const router = express.Router();

router.post('/parent-login', async (req, res) => {
  try {
    const { rollNumber, password } = req.body || {};
    if (!rollNumber || !password) {
      return res.status(400).json({ error: 'rollNumber and password are required' });
    }

    // 1) Fetch credential by username (roll number)
    const { data: credential, error: credentialError } = await supabase
      .from('parent_credentials')
      .select('parent_id, password_hash')
      .eq('username', String(rollNumber).trim())
      .single();

    if (credentialError || !credential) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 2) Verify password using RPC (bcrypt compare)
    const { data: verified, error: verifyError } = await supabase.rpc(
      'verify_parent_credential_password',
      {
        p_password_hash: credential.password_hash,
        p_password: String(password).trim(),
      }
    );

    if (verifyError || !verified) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3) Fetch parent user
    const { data: parentUser, error: userError } = await supabase
      .from('users')
      .select('id, name, email, phone, role')
      .eq('id', credential.parent_id)
      .single();

    if (userError || !parentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ user: parentUser });
  } catch (err) {
    console.error('parent-login error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

// If you want to run as a standalone server:
// import bodyParser from 'body-parser';
// const app = express();
// app.use(bodyParser.json());
// app.use(router);
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`Parent login API running on ${PORT}`));
