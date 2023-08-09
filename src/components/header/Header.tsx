import { HeaderImage } from "./HeaderImage";

const Header: React.FC = () => {
  return (
    <section className="grid place-items-center">
      <HeaderImage priority height={300} width={300} />
    </section>
  );
};

export { Header };
