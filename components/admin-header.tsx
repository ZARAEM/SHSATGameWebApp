import Link from 'next/link'

export function AdminHeader({ title }: { title: string }) {
  return (
    <div className="text-center mb-8">
      <Link href="/admin">
        <h1 className="text-4xl font-bold cursor-pointer hover:underline">
          {title}
        </h1>
      </Link>
    </div>
  )
}