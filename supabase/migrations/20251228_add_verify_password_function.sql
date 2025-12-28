/*
  # Create RPC Function to Verify Parent Credentials Password
  
  This function verifies a bcrypt-hashed password against user input.
  It's used during parent login with roll number.
*/

-- Create RPC function to verify parent credential password
CREATE OR REPLACE FUNCTION verify_parent_credential_password(
  p_password_hash text,
  p_password text
)
RETURNS boolean AS $$
BEGIN
  -- Compare the provided password with the stored bcrypt hash
  RETURN p_password_hash = crypt(p_password, p_password_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to anon users
GRANT EXECUTE ON FUNCTION verify_parent_credential_password(text, text) TO anon;
