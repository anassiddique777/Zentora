import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-muted/40 px-4 py-10">
      <Link
        href="/"
        className="flex items-center gap-2.5 text-2xl font-bold tracking-tight"
      >
        <Image src="/logo-icon.png" alt="" width={36} height={36} />
        Zentora
      </Link>
      {children}
    </div>
  );
}
