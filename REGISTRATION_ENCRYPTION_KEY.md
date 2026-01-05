# REGISTRATION_ENCRYPTION_KEY Setup

## The Error: "bad decrypt"

If you see the error `error:1C800064:Provider routines::bad decrypt`, it means the encryption key used to decrypt the password doesn't match the key used to encrypt it.

## Why This Happens

The registration system encrypts passwords before storing them in Firestore. When an admin approves a registration, the system decrypts the password to create the Firebase Auth user.

The encryption key is stored in the `REGISTRATION_ENCRYPTION_KEY` environment variable. If this key:
- Is not set → A random key is generated each time the server starts
- Changes → Old encrypted passwords can't be decrypted
- Is missing → Each server restart generates a new key

## Solution

Add a **stable encryption key** to your `.env.local` file:

```bash
# Registration Encryption Key (32 bytes = 64 hex characters)
# Generate one with: openssl rand -hex 32
REGISTRATION_ENCRYPTION_KEY=your-64-character-hex-key-here
```

## How to Generate a Key

Run this command to generate a secure random key:

```bash
openssl rand -hex 32
```

This will output a 64-character hexadecimal string. Copy it to your `.env.local` file:

```bash
REGISTRATION_ENCRYPTION_KEY=abc123def456... (64 characters total)
```

## Important Notes

1. **Keep the same key**: Once you set this key, don't change it. Changing it will make existing pending registrations un-decryptable.

2. **Restart server**: After adding the key to `.env.local`, restart your development server.

3. **Existing registrations**: If you have existing pending registrations encrypted with a different key, you'll need to either:
   - Use the old key (if you know what it was)
   - Delete and re-create the registration requests
   - Approve them manually via Firebase Console (create the user directly)

4. **Production**: Make sure to set this environment variable in your production environment as well!

## Example .env.local Entry

```bash
# ... other environment variables ...

# Registration Encryption Key (64 hex characters)
REGISTRATION_ENCRYPTION_KEY=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

## Verify It's Working

After setting the key and restarting the server:
1. Try approving a registration request
2. If it works, the key is correct
3. If you still get "bad decrypt", the existing registration was encrypted with a different key


