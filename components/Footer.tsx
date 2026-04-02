export default function Footer() {
  return (
    <footer className="bg-white border-t mt-10 py-4 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} Finance Tracker. All rights reserved.
    </footer>
  );
}
