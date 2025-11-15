// app/admin/layout.tsx
export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            {children}
        </div>
    )
}