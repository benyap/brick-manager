import PartImage, { PartImageProps } from "~/components/parts/PartImage";

export interface PartImageWithIdentifiersProps
  extends Pick<PartImageProps, "part" | "partColors" | "selectedColorId"> {}

export function PartImageWithIdentifiers(props: PartImageWithIdentifiersProps) {
  const { part, partColors, selectedColorId } = props;
  const { BrickLink, LEGO } = part?.identifiers ?? {};
  return (
    <div className="flex flex-wrap gap-8 mb-4">
      <PartImage
        className="w-52 h-52 flex-shrink-0 flex items-center justify-center"
        classes={{ image: "rounded-md" }}
        fade
        part={part}
        partColors={partColors}
        selectedColorId={selectedColorId}
      />
      <div className="flex flex-col gap-3">
        {BrickLink && BrickLink.length > 0 && (
          <VendorIDs name="BrickLink" ids={BrickLink} />
        )}
        {LEGO && LEGO.length > 0 && <VendorIDs name="LEGO" ids={LEGO} />}
      </div>
    </div>
  );
}

function VendorIDs(props: { name: string; ids: string[] }) {
  const { name, ids } = props;
  return (
    <div>
      <p className="text-sm font-medium text-lego-navy-300">{name} ID</p>
      <ul>
        {ids.map((id) => (
          <li key={id} className="text-xl text-lego-navy font-bold">
            {id}
          </li>
        ))}
      </ul>
    </div>
  );
}
