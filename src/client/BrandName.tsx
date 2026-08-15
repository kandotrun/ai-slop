interface BrandNameProps {
  className?: string;
}

export function BrandName({ className = "" }: BrandNameProps) {
  return <span className={`giga-brand ${className}`.trim()}>ギガサイト便</span>;
}
