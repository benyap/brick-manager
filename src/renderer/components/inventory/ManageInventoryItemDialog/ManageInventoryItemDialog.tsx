import { FormEvent, Fragment, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";

import { Inventory } from "~/models";
import { useResource } from "~/components/core/ResourceProvider";

import TextField from "~/components/elements/TextField";
import TextArea from "~/components/elements/TextArea";
import ColorSelector from "~/components/core/ColorSelector";
import PartImage from "~/components/parts/PartImage";
import PartSelector from "~/components/parts/PartSelector";
import Alert from "~/components/elements/Alert";
import Button from "~/components/elements/Button";

import { IColor, IInventoryItem, IPart } from "~/types";

export interface ManageInventoryItemDialogProps {
  open?: boolean;
  onClose?: () => any;
  onSave?: (
    item: Pick<IInventoryItem, "partId" | "colorId" | "count" | "comment">
  ) => any;
  title?: React.ReactNode;
  inventory?: Inventory;
  initialPart?: IPart;
  initialColor?: IColor;
  initialCount?: number;
  initialComment?: string;
}

export function ManageInventoryItemDialog(props: ManageInventoryItemDialogProps) {
  const {
    open,
    onClose = () => null,
    onSave,
    title = "Manage inventory item",
    inventory,
    initialPart,
    initialColor,
    initialCount,
    initialComment,
  } = props;

  const parts = useResource("parts").byId;
  const colorsById = useResource("colors").byId;

  const [part, setPart] = useState<IPart | undefined>();
  const [color, setColor] = useState<IColor | undefined>();
  const [count, setCount] = useState(initialCount ?? 1);
  const [comment, setComment] = useState(initialComment ?? "");
  const [error, setError] = useState("");

  // Reset fields on open
  useEffect(() => {
    if (!open) return;
    setPart(undefined);
    setColor(undefined);
    setCount(initialCount ?? 1);
    setComment(initialComment ?? "");
    setError("");
  }, [open, initialPart, initialColor, initialCount, initialComment]);

  const partColors = useMemo(() => {
    if (initialPart) return parts[initialPart.id].colors;
    if (part) return parts[part.id].colors;
    return null;
  }, [parts, initialPart, part]);

  const colors = useMemo(() => {
    if (!partColors) return null;
    return Object.keys(partColors).map((colorId) => colorsById[colorId]);
  }, [partColors, colorsById]);

  const item = useMemo(() => {
    if ((initialPart || part) && inventory)
      return inventory.getItem(initialPart?.id ?? part!.id, color?.id);
    return null;
  }, [initialPart, part, inventory, color]);

  // Reset error when part changes
  useEffect(() => {
    setError("");
  }, [part]);

  // Reset selected color when part changes
  useEffect(() => {
    setColor(undefined);
  }, [part]);

  // Set values when matching inventory item is found
  useEffect(() => {
    setComment(item?.comment ?? "");
    setCount(item?.count ?? 1);
  }, [item]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();

    if (!initialPart && !part) {
      setError("No part selected");
      return;
    }

    if (count < 0) {
      setError("Count must not be negative");
      return;
    }

    onClose?.();

    onSave?.({
      partId: initialPart?.id ?? part!.id,
      colorId: initialColor?.id ?? color?.id,
      comment,
      count,
    });
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        onClose={onClose}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="min-h-screen px-4 flex items-center justify-center">
          <Transition.Child
            enter="ease-out duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-20" />
          </Transition.Child>
          <Transition.Child
            className={clsx(
              "inline-block overflow-hidden transition transform",
              "w-full max-w-xl p-6 bg-white shadow-xl rounded-lg my-8"
            )}
            enter="ease-out duration-150"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Title className="text-lego-navy text-2xl font-bold mb-2 flex justify-between items-center">
              <span>{title}</span>
              {item && !initialPart && (
                <span className="text-sm font-semibold px-3 py-1 rounded-full bg-lego-navy bg-opacity-10">
                  already in your inventory
                </span>
              )}
            </Dialog.Title>
            {error && (
              <Alert type="error" className="mt-3">
                {error}
              </Alert>
            )}
            <form className="mt-3" onSubmit={onSubmit}>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <PartSelector
                    className="mb-4"
                    selected={initialPart ?? part}
                    onSelect={setPart}
                    disabled={Boolean(initialPart)}
                  />
                  <ColorSelector
                    className="mb-4"
                    label="Color"
                    options={colors}
                    selected={initialColor ?? color}
                    onSelect={setColor}
                    disabled={Boolean(!colors || initialPart)}
                  />
                  <TextField
                    className="mb-4"
                    type="number"
                    label="Count"
                    value={String(count)}
                    onChange={(value) => setCount(Number(value))}
                  />
                  <TextArea
                    className="mb-4"
                    label="Comments"
                    value={comment}
                    onChange={setComment}
                  />
                </div>
                <div className="w-1/2 flex flex-col justify-center items-center">
                  <PartImage
                    className="w-48 h-48 flex justify-center"
                    classes={{ image: "rounded" }}
                    fade
                    part={initialPart ?? part}
                    partColors={partColors}
                    selectedColorId={initialColor?.id ?? color?.id}
                  />
                  <p className="text-sm text-center text-lego-navy-300 font-semibold pt-4 px-6">
                    {initialPart?.name ?? part?.name}
                  </p>
                </div>
              </div>
              <Button type="submit">{initialPart || item ? "Update" : "Add"}</Button>
            </form>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
