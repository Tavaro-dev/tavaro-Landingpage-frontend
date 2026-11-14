import Image from "next/image";
import type { ReactNode } from "react";
import { Reveal } from "@/components/shared/Reveal";

export function SplitSection({
  reverse = false,
  wide = false,
  placeholder,
  src,
  alt,
  children,
}: {
  reverse?: boolean;
  wide?: boolean;
  placeholder: string;
  src: string;
  alt: string;
  children: ReactNode;
}) {
  return (
    <Reveal className={`split${reverse ? " reverse" : ""}`}>
      <div className={`split-media ${wide ? "wide " : ""}${placeholder}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 861px) 50vw, 100vw"
        />
      </div>
      <div className="split-body">{children}</div>
    </Reveal>
  );
}
