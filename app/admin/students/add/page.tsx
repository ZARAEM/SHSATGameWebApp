"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AdminHeader } from "@/components/admin-header"

export default function AddStudent() {
  const [name, setName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })
      if (!response.ok) {
        throw new Error('Failed to add student')
      }
      alert('Student added successfully')
      setName('')
    } catch (error) {
      console.error('Error adding student:', error)
      alert('Failed to add student')
    }
  }

  return (
    <div className="p-8 flex flex-col items-center">
      <AdminHeader title="Add Student" />
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Student Name"
          required
        />
        <Button type="submit" className="w-full">Add Student</Button>
      </form>
    </div>
  )
}