"use client";

import { useState, useEffect } from "react";

import { useToast } from "./ui/use-toast";

interface RecentLinksProps {}

const RecentLinks: React.FC<RecentLinksProps> = ({}) => {
  const [recentLinks, setRecentLinks] = useState([]);

  useEffect(() => {
    let recentLinksFromLocal = localStorage.getItem("recentLinks");

    if (recentLinksFromLocal) {
      setRecentLinks(JSON.parse(recentLinksFromLocal));
    }
  }, []);

  if (!recentLinks) {
    return "You currently don't have any recently used links.";
  }

  return (
    <section className="flex flex-col">
      {recentLinks.map((link, index) => (
        <Item key={index} content={link} />
      ))}
    </section>
  );
};

const Item: React.FC<{ content: string }> = ({ content }) => {
  const { toast } = useToast();

  const handleOnClick = async () => {
    try {
      await navigator.clipboard.writeText(content);

      toast({
        title: "Successfully copied to your clipboard!",
      });
    } catch (error) {
      toast({
        title: "There was a problem when copying the link to your clipboard.",
      });
    }
  };

  return (
    <section
      className="p-3 rounded-md transition-colors ease-in-out delay-75 cursor-pointer hover:bg-gray-300"
      onClick={handleOnClick}
    >
      {content}
    </section>
  );
};

export { RecentLinks };
