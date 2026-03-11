import { cn } from "@/lib/cn";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  src?: string;
  name: string;
  size?: AvatarSize;
  online?: boolean;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
};

function getInitials(name: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getColor(name: string): string {
  const colors = [
    "bg-primary text-white",
    "bg-[var(--color-secondary-500)] text-white",
    "bg-success text-white",
    "bg-warning text-[var(--color-warning-700)]",
    "bg-[var(--color-primary-700)] text-white",
    "bg-[var(--color-secondary-700)] text-white",
  ];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({ src, name, size = "md", online, className }: AvatarProps) {
  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn(
            "rounded-full object-cover",
            sizeStyles[size]
          )}
        />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center rounded-full font-medium",
            sizeStyles[size],
            getColor(name)
          )}
          aria-label={name}
        >
          {getInitials(name)}
        </div>
      )}
      {online !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-surface",
            size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5",
            online ? "bg-success" : "bg-text-tertiary"
          )}
          aria-label={online ? "В сети" : "Не в сети"}
        />
      )}
    </div>
  );
}

interface AvatarStackProps {
  users: { name: string; src?: string; online?: boolean }[];
  max?: number;
  size?: AvatarSize;
}

export function AvatarStack({ users, max = 3, size = "sm" }: AvatarStackProps) {
  const visible = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((user) => (
        <Avatar
          key={user.name}
          name={user.name}
          src={user.src}
          size={size}
          online={user.online}
          className="ring-2 ring-surface"
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-subtle text-text-secondary font-medium ring-2 ring-surface",
            sizeStyles[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
