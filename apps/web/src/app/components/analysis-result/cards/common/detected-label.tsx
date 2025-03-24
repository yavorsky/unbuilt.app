import { useRouter } from 'next/navigation';

export const DetectedLabel = ({
  label,
  resultName,
  category,
  className,
}: {
  label: string;
  resultName: string;
  category: string;
  className?: string;
}) => {
  const router = useRouter();

  return (
    <span
      onClick={(evt) => {
        evt.stopPropagation();
        router.push(`/technologies/${category}/${resultName}`);
      }}
      className={`text-foreground hover:underline cursor-pointer ${className}`}
    >
      {label}
    </span>
  );
};
