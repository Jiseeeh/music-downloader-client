import download from "downloadjs";
import { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Media } from "@/interfaces/Media";
import { Button } from "./ui/button";
import { Filter } from "@/enums/Filter";

interface DownloadFormatsProps {
  isLoading: boolean;
  formats: Media[];
  filter: Filter;
  url: string;
}

const DownloadFormats: React.FC<DownloadFormatsProps> = ({
  isLoading,
  formats,
  filter,
  url,
}) => {
  const skeletons = generateSkeletons();
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const tiles = formats
    .filter((format) => {
      if (filter === "all") return true;

      return format.type === filter;
    })
    .map((format) => {
      return (
        <Button
          key={format.id}
          type="button"
          onClick={async () => {
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

            let mimeType = "";

            try {
              const response = await fetch(
                `http://localhost:3001/api/download?url=${url}&formatId=${format.id}`
              );

              switch (format.extension) {
                case "webm": {
                  if (format.type === "audio") mimeType = "audio/webm";
                  else mimeType = "video/webm";
                  break;
                }
                case "mp4" || "m4a":
                  mimeType = "video/mp4";
              }

              const blob = await response.blob();

              download(blob, format.fileName, mimeType);
            } catch (error) {
              toast({
                title: "Sorry for the inconvenience!",
                description:
                  "Please try again later or refresh the page, Thank you!",
              });
            } finally {
              setIsDownloading(false);
            }
          }}
        >
          {format.type}({format.quality})
        </Button>
      );
    });

  if (!isLoading) {
    return (
      <section className="mt-2 p-2 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
        {tiles}
      </section>
    );
  }

  return (
    <section className="mt-2 p-2 grid place-items-center grid-cols-2 gap-2 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
      {skeletons}
    </section>
  );
};

function generateSkeletons() {
  return Array(5)
    .fill(null)
    .map((_, index) => (
      <Skeleton key={index} className="w-[100px] h-9 px-4 py-2 rounded-md" />
    ));
}

export { DownloadFormats };
