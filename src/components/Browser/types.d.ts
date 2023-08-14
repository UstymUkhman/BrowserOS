export type ToolbarProps = {
  onNavigate: (id: string, url: string) => void;
  onFocus?: (id: string) => void;
  onSearchStart?: () => void;
  onSearchEnd?: () => void;
  id: string;
};
