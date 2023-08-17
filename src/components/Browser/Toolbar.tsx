import { OS } from "@/app";
import { startUrl } from "./utils";
// import { historyList } from "./utils";
import CSS from "./Toolbar.module.css";
import { createSignal } from "solid-js";
import type { ToolbarProps } from "./types";

// import Arrow from "@/assets/icons/Browser/arrow.svg";
import Reload from "@/assets/icons/Browser/reload.svg";
import Search from "@/assets/icons/Browser/search.svg";

export const Toolbar = ({
  onSearchStart,
  onSearchEnd,
  onNavigate,
  onFocus,
  id
}: ToolbarProps) => {
  const [url, setUrl] = createSignal(startUrl);

  const onReload = () => OS.Electron?.reloadBrowser(id);

  const onKeyDown = (event: KeyboardEvent) =>
    event.key === "Enter" ? onSearch()
      : setUrl((search as HTMLInputElement).value);

  const onToolbarFocus = () => onFocus?.(id);

  const onSearchFocus = () => {
    (search as HTMLInputElement).select();
    onSearchStart?.();
    onToolbarFocus();
  };

  const onSearch = () => {
    let link = url();
    // if (historyList.last === link) return;

    if (!link.match(/https?:\/\/(www\.)?/))
      setUrl(link = `http://${link}`);

    onNavigate(id, link);
    // historyList.add(id, link);
    (search as HTMLInputElement).blur();
  };

  let search: unknown;

  return (
    <div onClick={onToolbarFocus} class={CSS.toolbar}>
      <div class={CSS.buttons}>
        {/* <button
          onClick={onBackward}
          title="Backward"
          classList={{
          [CSS.disabled]: !historyList.backward(id)
        }}>
          <Arrow />
        </button>

        <button
          onClick={onForward}
          title="Forward"
          classList={{
          [CSS.disabled]: !historyList.forward(id)
        }}>
          <Arrow />
        </button> */}

        <button
          onClick={onReload}
          title="Reload"
        >
          <Reload />
        </button>
      </div>

      <div class={CSS.search}>
        <input
          ref={search as HTMLInputElement}
          // data-prevent-window-focus
          onFocus={onSearchFocus}
          onKeyDown={onKeyDown}
          onBlur={onSearchEnd}
          value={url()}
          type="text"
        />

        <button
          onClick={onSearch}
          title="Search"
        >
          <Search />
        </button>
      </div>
    </div>
  );
};
