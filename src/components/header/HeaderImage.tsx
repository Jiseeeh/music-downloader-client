import Image from "next/image";

interface HeaderImageProps {
  className?: string;
  height: number;
  width: number;
  priority?: boolean;
}

const HeaderImage: React.FC<HeaderImageProps> = ({
  className,
  height,
  width,
  priority = false,
}) => {
  return (
    <Image
      className={className}
      src="/logo.png"
      alt="Illustration of musical notes"
      height={height}
      width={width}
      priority={priority}
    />
  );
};

export { HeaderImage };
