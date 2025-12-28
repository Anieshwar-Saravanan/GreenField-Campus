import { supabase } from './supabase';

/**
 * Authenticate parent using roll number and password
 * @param rollNumber - Student's roll number
 * @param password - Last 4 digits of roll number
 * @returns Parent user data or null if authentication fails
 */
export async function authenticateParentByRollNumber(
  rollNumber: string,
  password: string
) {
  try {
    // Find credential by username (roll number)
    const { data: credential, error: credentialError } = await supabase
      .from('parent_credentials')
      .select('parent_id, password_hash')
      .eq('username', rollNumber.trim())
      .single();

    if (credentialError || !credential) {
      throw new Error('Invalid roll number');
    }

    // Verify password using RPC function
    const { data: passwordValid, error: verifyError } = await supabase.rpc(
      'verify_parent_credential_password',
      {
        p_password_hash: credential.password_hash,
        p_password: password.trim()
      }
    );

    if (verifyError || !passwordValid) {
      throw new Error('Invalid password');
    }

    // Get parent user data
    const { data: parentUser, error: userError } = await supabase
      .from('users')
      .select('id, name, email, phone, role')
      .eq('id', credential.parent_id)
      .single();

    if (userError || !parentUser) {
      throw new Error('User not found');
    }

    return parentUser;
  } catch (error: any) {
    console.error('Parent authentication error:', error);
    throw error;
  }
}

/**
 * Get all student roll numbers for a parent
 * @param parentId - Parent's user ID
 * @returns Array of student roll numbers
 */
export async function getParentStudentRollNumbers(parentId: string) {
  try {
    const { data: credentials, error } = await supabase
      .from('parent_credentials')
      .select('username')
      .eq('parent_id', parentId);

    if (error) {
      throw error;
    }

    return credentials?.map(c => c.username) || [];
  } catch (error: any) {
    console.error('Error fetching student roll numbers:', error);
    throw error;
  }
}

/**
 * Update parent credential password (when roll number changes)
 * @param studentId - Student's ID
 * @param newRollNumber - New roll number
 */
export async function updateParentCredentialRollNumber(
  studentId: string,
  newRollNumber: string
) {
  try {
    // Get the current credential to find parent_id
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('parent_id')
      .eq('id', studentId)
      .single();

    if (studentError || !student) {
      throw new Error('Student not found');
    }

    // Delete old credential if exists
    await supabase
      .from('parent_credentials')
      .delete()
      .eq('student_id', studentId);

    // Create new credential with updated roll number
    const hashedPassword = await supabase.rpc(
      'generate_bcrypt_hash',
      {
        p_password: newRollNumber.slice(-4)
      }
    );

    const { error: insertError } = await supabase
      .from('parent_credentials')
      .insert({
        parent_id: student.parent_id,
        student_id: studentId,
        username: newRollNumber,
        password_hash: hashedPassword.data
      });

    if (insertError) {
      throw insertError;
    }
  } catch (error: any) {
    console.error('Error updating parent credential:', error);
    throw error;
  }
}
