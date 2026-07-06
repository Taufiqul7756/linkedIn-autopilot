export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} All rights reserved.
      </div>
    </footer>
  );
}
