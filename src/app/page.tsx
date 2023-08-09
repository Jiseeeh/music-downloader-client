import { HamburgerMenuIcon } from "@radix-ui/react-icons";

import { Header } from "@/components/header/Header";
import { HeaderImage } from "@/components/header/HeaderImage";
import { TypographyH3 } from "@/components/typography/TypographyH3";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RecentLinks } from "@/components/RecentLinks";
import { DownloadForm } from "@/components/Download";

export default function Home() {
  return (
    <section className="min-h-screen">
      <nav className="flex max-w-5xl mx-auto">
        <Sheet>
          <SheetTrigger>
            <HamburgerMenuIcon
              className="p-2 cursor-pointer"
              width={50}
              height={50}
            />
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SheetHeader>
              <SheetTitle>Recently used links</SheetTitle>
              <RecentLinks />
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <section className="p-2 ml-auto flex items-center">
          <HeaderImage height={40} width={40} />
          <TypographyH3 content="Downloader" />
        </section>
      </nav>
      <section>
        <Header />
        <DownloadForm />
      </section>
    </section>
  );
}
