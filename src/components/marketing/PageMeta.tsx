import { useEffect } from "react";

interface PageMetaProps {
  title: string;
  description: string;
}

export default function PageMeta({ title, description }: PageMetaProps) {
  useEffect(() => {
    document.title = title;

    let tag = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );

    if (!tag) {
      tag = document.createElement("meta");
      tag.name = "description";
      document.head.appendChild(tag);
    }

    tag.content = description;
  }, [title, description]);

  return null;
}
