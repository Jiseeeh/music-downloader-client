"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Media } from "@/interfaces/Media";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "@/enums/Filter";
import { DownloadFormats } from "./DownloadFormats";
import { useToast } from "@/components/ui/use-toast";

const DownloadForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formats, setFormats] = useState<Media[]>([]);
  const [filterMode, setFilterMode] = useState<Filter>(Filter.ALL);
  const [linkFieldValue, setLinkFieldValue] = useState("");
  const { toast } = useToast();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

      if (links) {
        recentLinks = JSON.parse(links);

        // prevent entering existing link
        if (recentLinks.includes(linkFieldValue)) return;

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
        `http://localhost:3001/api/download/info?url=${linkFieldValue}`
      );

      const data = await response.json();
      const downloadInfo: Media[] = data.downloadInfo;

      setFormats(downloadInfo.filter((format) => format.type !== "unknown"));
    } catch (error) {
      toast({
        title: "Sorry for the inconvenience!",
        description:
          "Please use a valid youtube video link as it has the most support.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className="p-2 grid place-items-center" onSubmit={onSubmit}>
        <section className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="text"
            placeholder="Link"
            value={linkFieldValue}
            onChange={(e) => setLinkFieldValue(e.target.value)}
          />
          <Button type="submit" disabled={isLoading}>
            Check
          </Button>
        </section>
      </form>
      <section className="flex flex-col max-w-5xl mx-auto">
        <div className="self-end p-3">
          <Select
            onValueChange={(val: Filter) => {
              setFilterMode(val);
            }}
            defaultValue={filterMode}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Filter.ALL}>
                {Filter.ALL.toUpperCase()}
              </SelectItem>
              <SelectItem value={Filter.AUDIO}>
                {Filter.AUDIO.toUpperCase()}
              </SelectItem>
              <SelectItem value={Filter.VIDEO}>
                {Filter.VIDEO.toUpperCase()}
              </SelectItem>
              <SelectItem value={Filter.VIDEO_ONLY}>
                {Filter.VIDEO_ONLY.toUpperCase()}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DownloadFormats
          isLoading={isLoading}
          formats={formats}
          filter={filterMode}
          url={linkFieldValue}
        />
      </section>
    </>
  );
};

export { DownloadForm };
