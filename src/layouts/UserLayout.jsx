export default function UserLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="p-4 bg-white shadow">
        <h1 className="text-xl font-semibold">User Website</h1>
      </header>

      <main className="p-4">{children}</main>
    </div>
  );
}
