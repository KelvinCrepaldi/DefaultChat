import Link from "next/link";

type EmptyAction = {
  href: string;
  label: string;
};

type EmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  actions?: EmptyAction[];
  className?: string;
};

const EmptyState = ({
  title,
  description,
  actionHref,
  actionLabel,
  actions,
  className = "",
}: EmptyStateProps) => {
  const resolvedActions =
    actions && actions.length > 0
      ? actions
      : actionHref && actionLabel
        ? [{ href: actionHref, label: actionLabel }]
        : [];

  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-6 py-16 ${className}`}
    >
      <h3 className="text-chatTitle text-xl font-semibold mb-2">{title}</h3>
      <p className="text-chatText max-w-[420px] leading-relaxed">{description}</p>
      {resolvedActions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full max-w-[420px] justify-center">
          {resolvedActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="button text-base py-2"
            >
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
