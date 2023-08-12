"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Media } from "@/interfaces/Media";
import { DownloadFormats } from "./DownloadFormats";
import { useToast } from "@/components/ui/use-toast";

const DownloadForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formats, setFormats] = useState<Media[]>([]);
  const [linkFieldValue, setLinkFieldValue] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!linkFieldValue) {
        toast({
          title: "Please input a link.",
        });

        return;
      }

      const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

      if (!linkFieldValue.match(urlRegex)) {
        toast({
          title: "Please at least enter a valid link.",
        });
        return;
      }

      let links = localStorage.getItem("recentLinks");

      let recentLinks: string[] = [];

      if (links !== null) {
        recentLinks = JSON.parse(links);

        // prevent entering existing link
        if (!recentLinks.includes(linkFieldValue))
          recentLinks.push(linkFieldValue);

        localStorage.setItem("recentLinks", JSON.stringify(recentLinks));
      } else {
        recentLinks.push(linkFieldValue);
        localStorage.setItem("recentLinks", JSON.stringify(recentLinks));
      }

      setIsLoading(true);

      toast({
        title: "Please wait while we are getting the link's data.",
        description:
          "You can click on your preferred format once the loading is done.",
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/download/info?url=${linkFieldValue}`
      );

      const data = await response.json();
      const downloadInfo: Media[] = data.downloadInfo;

      setFormats(
        downloadInfo.filter(
          (format) => format.type !== "unknown" && format.quality !== "unknown"
        )
      );
    } catch (error) {
      toast({
        title: "Sorry for the inconvenience!",
        description:
          "There must be an error on the server, please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="p-2 grid place-items-center">
        <form
          className="flex w-full max-w-sm items-center space-x-2"
          onSubmit={handleSubmit}
        >
          <Input
            type="text"
            placeholder="Link"
            value={linkFieldValue}
            onChange={(e) => setLinkFieldValue(e.target.value)}
          />

          <Button type="submit" disabled={isLoading}>
            Check
          </Button>
        </form>
      </section>
      <section className="max-w-5xl mx-auto">
        <DownloadFormats
          isLoading={isLoading}
          formats={formats}
          url={linkFieldValue}
        />
      </section>
    </>
  );
};

export { DownloadForm };
