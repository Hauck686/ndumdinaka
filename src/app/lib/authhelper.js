import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

export async function getCurrentUser () {
  const session = await getServerSession(authOptions)
  return session?.user || null
}
