# How to Populate Parent Credentials Table

## Option 1: Via Supabase Dashboard (Easiest)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Create a new query
5. Copy the SQL from `/supabase/scripts/populate_parent_credentials.sql`
6. Run the query

## Option 2: Via Supabase CLI

```bash
# Make sure you're in the project directory
cd GreenField-Campus

# Run the migration
supabase db push

# This will apply all pending migrations including the parent_credentials table
```

## Option 3: Verify the Data After Population

Run this query to verify credentials were created:

```sql
-- Show all parent credentials
SELECT 
  pc.id,
  u.name as parent_name,
  u.email,
  s.name as student_name,
  s.roll_number,
  pc.username
FROM parent_credentials pc
JOIN users u ON pc.parent_id = u.id
JOIN students s ON pc.student_id = s.id
ORDER BY u.name, s.name;

-- Count statistics
SELECT COUNT(*) as total_credentials FROM parent_credentials;
```

## What Gets Created

For each student with a parent:
- **Username**: Student's roll_number (e.g., "A001")
- **Password Hash**: roll_number:last4digits (e.g., "A001:0001")
  - Used for validation against the last 4 digits
- **Link**: Automatically connects parent to student account

## Example

If a student has:
- Roll Number: `A001`
- Parent: John Doe

Then the credential created will be:
- Username: `A001`
- Password (hash): `A001:0001` (for validation)
- Parents can login with username `A001` and password `0001`

## Verify Before and After

```sql
-- Before: Check how many students have parents
SELECT COUNT(*) as students_with_parents FROM students WHERE parent_id IS NOT NULL;

-- After: Check how many credentials were created
SELECT COUNT(*) as credentials_created FROM parent_credentials;

-- Should be equal (or similar) unless some roll numbers were duplicates
```

---

**Next Step**: Once populated, we'll create the authentication logic to support roll number + password login.
