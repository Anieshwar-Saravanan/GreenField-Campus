/*
  # Helper to generate bcrypt hashes
  Provides a deterministic way to hash a password using bcrypt so that
  edge functions or backend code can call this RPC instead of handling
  hashing in the client.
*/

-- Ensure pgcrypto extension is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function: generate_bcrypt_hash(password text) -> text
CREATE OR REPLACE FUNCTION generate_bcrypt_hash(p_password text)
RETURNS text AS $$
BEGIN
  RETURN crypt(p_password, gen_salt('bf', 10));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION generate_bcrypt_hash(text) TO anon, authenticated;
