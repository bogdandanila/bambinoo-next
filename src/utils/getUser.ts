import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function getUser() {
  const supabase = await createClient()
 
  const { data, error } = await supabase.auth.getUser()
  const user = data?.user

  if (error || !user) {
    redirect('/auth/login')
  }

  return { user, error }
}