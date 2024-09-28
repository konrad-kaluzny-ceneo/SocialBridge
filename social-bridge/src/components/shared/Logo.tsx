import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="z-40 flex font-semibold">
      Logo<span className="text-primary">Bold</span>
    </Link>
  );
}
