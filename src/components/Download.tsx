"use client";

import { useState } from "react";

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

interface DownloadFormProps {}

const DownloadForm: React.FC<DownloadFormProps> = ({}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formats, setFormats] = useState<Media[]>([]);
  const [filterMode, setFilterMode] = useState<Filter>(Filter.ALL);
  const [linkFieldValue, setLinkFieldValue] = useState("");
  const { toast } = useToast();

  return (
    <>
      <form
        className="p-2 grid place-items-center"
        onSubmit={async (e) => {
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

            setFormats(
              downloadInfo.filter((format) => format.type !== "unknown")
            );
          } catch (error) {
            toast({
              title: "Sorry for the inconvenience!",
              description:
                "Please use a valid youtube video link as it has the most support.",
            });
          } finally {
            setIsLoading(false);
          }
        }}
      >
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
              <SelectItem value={Filter.ALL}>All</SelectItem>
              <SelectItem value={Filter.AUDIO}>Audio</SelectItem>
              <SelectItem value={Filter.VIDEO}>Video</SelectItem>
              <SelectItem value={Filter.VIDEO_ONLY}>Video Only</SelectItem>
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
