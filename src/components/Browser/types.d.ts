export type ToolbarProps = {
  onFocus?: (id: string) => void;
  onSearchStart?: () => void;
  onSearchEnd?: () => void;
  id: string;
};
