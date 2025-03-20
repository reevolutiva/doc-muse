"use client"

import { redirect } from 'next/navigation'

export default function ProjectTemplatesRedirect() {
  redirect('/templates?tab=projects')
}