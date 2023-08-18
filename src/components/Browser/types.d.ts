export type ToolbarProps = {
  onNavigate: (id: string, url: string) => void;
  onFocus?: (window: HTMLElement) => void;
  id: string;
};
