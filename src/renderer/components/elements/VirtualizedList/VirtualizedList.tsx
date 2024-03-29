import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList, ListChildComponentProps } from "react-window";

export interface VirtualizedListProps<T> {
  listRef?: React.LegacyRef<FixedSizeList<T[]>>;
  data: T[];
  rowHeight: number;
  children: (props: ListChildComponentProps<T[]>) => JSX.Element;
}

/**
 * NOTE: this component causes some rendering issues when used with
 * the `Transition` component from `@headless-ui/react`. Avoid using
 * this component where there are transitions involved.
 *
 * TODO: add better keyboard navigation support
 */
export function VirtualizedList<T>(props: VirtualizedListProps<T>) {
  const { listRef, data, rowHeight, children } = props;
  return (
    <AutoSizer>
      {({ width, height }) => (
        <FixedSizeList
          ref={listRef}
          itemCount={data.length}
          itemData={data}
          itemSize={rowHeight}
          width={width}
          height={height}
        >
          {children}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
}
