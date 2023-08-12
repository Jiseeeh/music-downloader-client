import download from "downloadjs";
import { useState, ReactNode } from "react";
import { BarLoader } from "react-spinners";

import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Media } from "@/interfaces/Media";
import { Button } from "./ui/button";
import { Filter } from "@/enums/Filter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface DownloadFormatsProps {
  isLoading: boolean;
  formats: Media[];
  url: string;
}

const DownloadFormats: React.FC<DownloadFormatsProps> = ({
  isLoading,
  formats,
  url,
}) => {
  const skeletons = generateSkeletons();
  const [isDownloading, setIsDownloading] = useState(false);
  const [filterMode, setFilterMode] = useState<Filter>(Filter.AUDIO);
  const { toast } = useToast();

  const handleClick = (format: Media) => {
    return async () => {
      if (isDownloading) {
        toast({
          title: "Your file is still downloading.",
          description: "No need to hurry! Do not spam!",
        });
        return;
      }

      setIsDownloading(true);

      toast({
        title: "Please wait while we are getting your file.",
        description: "It will show up as long as it is finished.",
        duration: 10000,
      });

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/download?url=${url}&formatId=${format.id}`
        );

        const blob = await response.blob();

        download(blob, format.fileName, blob.type);

        toast({
          title: "Downloading done!",
        });
      } catch (error) {
        toast({
          title: "Sorry for the inconvenience!",
          description: "Please try again later or refresh the page, Thank you!",
        });
      } finally {
        setIsDownloading(false);
      }
    };
  };

  const tiles = formats
    .filter((format) => format.type === filterMode)
    .map((format) => {
      return (
        <Button key={format.id} type="button" onClick={handleClick(format)}>
          {`${format.quality.toUpperCase()} (${format.extension})`}
        </Button>
      );
    });

  const TilesGrid: React.FC<{ tiles: ReactNode }> = ({ tiles }) => {
    return (
      <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {tiles}
      </div>
    );
  };

  if (!isLoading) {
    return (
      <>
        {isDownloading && (
          <div className="fixed top-0 left-0 w-full">
            <BarLoader width={"100%"} height={6} color="#272e3f" />
          </div>
        )}
        <div className="p-3">
          <Accordion
            type="single"
            collapsible
            className="max-w-5xl"
            defaultValue={Filter.ALL} // so that no accordion item will be opened asap
            onValueChange={(val: Filter) => setFilterMode(val)}
          >
            <AccordionItem value={Filter.AUDIO}>
              <AccordionTrigger>{Filter.AUDIO.toUpperCase()}</AccordionTrigger>
              <AccordionContent>
                {tiles.length > 0 ? (
                  <TilesGrid tiles={tiles} />
                ) : (
                  "Audio types will show here."
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value={Filter.VIDEO}>
              <AccordionTrigger>{Filter.VIDEO.toUpperCase()}</AccordionTrigger>
              <AccordionContent>
                {tiles.length !== 0 ? (
                  <TilesGrid tiles={tiles} />
                ) : (
                  "Video types will show here."
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value={Filter.VIDEO_ONLY}>
              <AccordionTrigger>
                {Filter.VIDEO_ONLY.toUpperCase()}
              </AccordionTrigger>
              <AccordionContent>
                {tiles.length !== 0 ? (
                  <TilesGrid tiles={tiles} />
                ) : (
                  "Video only types will show here."
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </>
    );
  }

  return (
    <section className="mt-2 p-2 gap-2 flex flex-col max-w-5xl ">
      {skeletons}
    </section>
  );
};

function generateSkeletons() {
  return Array(3)
    .fill(null)
    .map((_, index) => (
      <Skeleton key={index} className="w-full h-11 px-4 py-2 rounded-md" />
    ));
}

export { DownloadFormats };
