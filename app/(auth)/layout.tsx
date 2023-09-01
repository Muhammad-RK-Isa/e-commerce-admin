
export default function AuthLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="grid h-full place-content-center">
            {children}
        </div>
    )
};