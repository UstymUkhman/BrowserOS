import { OS } from "@/app";
import { historyList } from "./utils";
import CSS from "./Toolbar.module.css";
import { createSignal } from "solid-js";
import type { ToolbarProps } from "./types";

import Arrow from "@/assets/icons/Browser/arrow.svg";
import Reload from "@/assets/icons/Browser/reload.svg";
import Search from "@/assets/icons/Browser/search.svg";

export const Toolbar = ({
  onSearchStart,
  onSearchEnd,
  onFocus,
  id
}: ToolbarProps) => {
  const [url, setUrl] = createSignal(historyList.current(id));

  const onReload = () => OS.Electron?.reloadBrowser(id);

  const onBackward = void 0;
  const onForward = void 0;

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") return onSearch();
    const { value } =  search as HTMLInputElement;
    setUrl(value);
  };

  const onToolbarFocus = () => onFocus?.(id);

  const onSearchFocus = () => {
    (search as HTMLInputElement).select();
    onSearchStart?.();
    onToolbarFocus();
  };

  const onSearch = () => {
    let link = url();

    if (!link.match(/https?:\/\/(www\.)?/))
      link = `http://${link}`;

    OS.Electron?.searchBrowser(id, link);
    (search as HTMLInputElement).blur();
    historyList.add(id, link);
  };

  let search: unknown;

  return (
    <div onClick={onToolbarFocus} class={CSS.toolbar}>
      <div class={CSS.buttons}>
        <button
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
        </button>

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
