import BaseView from "~/components/core/BaseView";
import InventoryDisplay from "~/components/inventory/InventoryDisplay";

export function InventoryView() {
  return (
    <BaseView root="/inventory">
      <InventoryDisplay id="default" />
    </BaseView>
  );
}
