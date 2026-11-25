import React from "react";
import { SectionHeading } from "./SectionHeading";

/** Name used across inner pages; renders the shared ornamental heading. */
export function IslamicDivider({ title }: { title: string }) {
  return (
    <div className="my-3">
      <SectionHeading title={title} />
    </div>
  );
}
