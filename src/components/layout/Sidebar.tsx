export default function Sidebar() {
  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 md:flex md:flex-col">
      <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-700">
        <span className="text-lg font-semibold">App</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">{/* Navigation items */}</nav>
    </aside>
  );
}
