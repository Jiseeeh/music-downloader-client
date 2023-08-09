interface TypographyH3Props {
  className?: string;
  content: string;
}

const TypographyH3: React.FC<TypographyH3Props> = ({ className, content }) => {
  return (
    <h3
      className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}
    >
      {content}
    </h3>
  );
};

export { TypographyH3 };
