// This file is intentionally blank to remove authentication checks.
// You can define a layout for your protected routes here if needed in the future.
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
