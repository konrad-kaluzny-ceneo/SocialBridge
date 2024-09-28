export default function H1Backgrounded({
  children,
}: {
  children: string;
}) {
  return <span className="bg-primary px-2 text-white">{children}</span>;
}
