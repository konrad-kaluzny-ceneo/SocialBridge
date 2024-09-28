import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="z-40 flex font-semibold">
      Social<span className="text-primary">Bridge</span>
    </Link>
  );
}
