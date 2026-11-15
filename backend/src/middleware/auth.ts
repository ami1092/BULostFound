import { Request, Response, NextFunction } from 'express'
import { createClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'

// Extend Express Request so req.user is typed
declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

// Use service role key server-side — bypasses RLS for DB queries
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

/**
 * Verifies the Supabase token and enforces @binghamton.edu domain.
 * Attaches req.user on success.
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided.' })
    return
  }

  const token = authHeader.split(' ')[1]
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    res.status(401).json({ message: 'Invalid or expired token.' })
    return
  }

  if (!user.email?.endsWith('@binghamton.edu')) {
    res.status(403).json({ message: 'Access restricted to Binghamton accounts only.' })
    return
  }

  req.user = user
  next()
}

/**
 * Checks the user's role in your users table.
 * Must come after requireAuth.
 */
export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated.' })
    return
  }

  const { data, error } = await supabase
    .from('users')           // change this if your table is named differently
    .select('role')
    .eq('email', req.user.email)
    .single()

  if (error || !data) {
    res.status(403).json({ message: 'User not found in database.' })
    return
  }

  if (data.role !== 'admin') {
    res.status(403).json({ message: 'Admin access required.' })
    return
  }

  next()
}