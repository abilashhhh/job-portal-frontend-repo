import Link from "next/link";

const CareerStackLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-1 select-none">
      <span className="font-serif text-[22px] leading-none tracking-[-0.02em] bg-linear-to-br from-zinc-900 to-[#d4a017] dark:from-zinc-100 dark:to-[#d4a017] bg-clip-text text-transparent">
        Career
      </span>

      <span className="font-serif text-[22px] leading-none tracking-[-0.02em] bg-linear-to-br from-red-500 to-red-600 bg-clip-text text-transparent">
        Stack
      </span>

      {/* Live dot */}
      <span className="ml-1 mb-2.5 h-1.25 w-1.25 rounded-full bg-[#d4a017] animate-pulse" />
    </Link>
  );
};

export default CareerStackLogo;
