import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
};

const EmptyState = ({
  title,
  description,
  actionHref,
  actionLabel,
  className = "",
}: EmptyStateProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-6 py-16 ${className}`}
    >
      <h3 className="text-chatTitle text-xl font-semibold mb-2">{title}</h3>
      <p className="text-chatText max-w-[420px] leading-relaxed">{description}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="button mt-6 max-w-[280px] text-base py-2"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
