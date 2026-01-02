// Utility script to check admin users
// Run with: npx ts-node scripts/check-admin-users.ts
// Or use in the app: create a page/API route that calls getAllUsers and filters for admins

import { getAllUsers } from '../src/app/actions/admin'

async function checkAdminUsers() {
  try {
    const users = await getAllUsers()
    const admins = users.filter(user => user.role === 'admin' && user.isActive)
    
    console.log('\n=== ADMIN USERS ===\n')
    
    if (admins.length === 0) {
      console.log('⚠️  No active admin users found in the database.')
      console.log('\nTo create an admin user:')
      console.log('1. Login to the app as any user')
      console.log('2. Go to /admin/users (if you have admin access)')
      console.log('3. Create a new user and set role to "admin"')
      console.log('OR use Firebase Console to manually set a user\'s role in Firestore')
    } else {
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.displayName || 'No name'}`)
        console.log(`   Email: ${admin.email}`)
        console.log(`   ID: ${admin.id}`)
        console.log(`   Created: ${admin.createdAt.toLocaleString()}`)
        console.log('')
      })
    }
    
    console.log(`\nTotal active admins: ${admins.length}`)
  } catch (error) {
    console.error('Error checking admin users:', error)
  }
}

checkAdminUsers()

