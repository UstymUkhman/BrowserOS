import { OS } from "@/app";
import CSS from "./Toolbar.module.css";
import type { ToolbarProps } from "./types";
import { DELTA_UPDATE } from "@/utils/Number";
import { startUrl, historyList } from "./utils";

import Arrow from "@/assets/icons/Browser/arrow.svg";
import { createSignal, createEffect } from "solid-js";
import Reload from "@/assets/icons/Browser/reload.svg";
import Search from "@/assets/icons/Browser/search.svg";

export const Toolbar = ({
  onNavigate,
  onFocus,
  id
}: ToolbarProps) => {
  const [last, setLast] = createSignal(true);
  const [cursor, setCursor] = createSignal(0);
  const [url, setUrl] = createSignal(startUrl);

  const onReload = () => OS.Electron?.reloadBrowser(id);

  const onKeyDown = (event: KeyboardEvent) =>
    event.key === "Enter" && onSearch(true);

  const onSearch = (update = false) => {
    const searchBar = search as HTMLInputElement;

    // Skip navigation if current URL matches the last one in history
    // except "onForward" click (but in that case "update" flag is false):
    if (update && setUrl(searchBar.value) === historyList.getLast(id)) return;

    // Add "http://" to typed URL string if it's missing:
    if (!url().match(/https?:\/\/(www\.)?/)) setUrl(`http://${url()}`);

    if (update) {
      historyList.add(id, url());
      setCursor(cursor() + 1);
    }

    onNavigate(id, url());
    searchBar.blur();
  };

  const onBackward = () => {
    const url = historyList.backward(id);
    setCursor(cursor() - 1);
    url && setUrl(url);
    onSearch();
  };

  const onForward = () => {
    const url = historyList.forward(id);
    setCursor(cursor() + 1);
    url && setUrl(url);
    onSearch();
  };

  const onClick = () => {
    const window = document.getElementById(id) as HTMLElement;
    if (window.style.zIndex !== "1") onFocus?.(window);
  };

  const select = () => {
    onClick();

    setTimeout(() => {
      OS.Electron?.blurBrowser(id);
      (search as HTMLInputElement).select();
    }, DELTA_UPDATE);
  };

  createEffect(() =>
    setLast(historyList.isLast(id, cursor()))
  );

  let search: unknown;

  return (
    <div onClick={onClick} class={CSS.toolbar}>
      <div class={CSS.buttons}>
        <button
          classList={{ [CSS.disabled]: !cursor() }}
          onClick={onBackward}
          title="Backward"
        >
          <Arrow />
        </button>

        <button
          classList={{ [CSS.disabled]: last() }}
          onClick={onForward}
          title="Forward"
        >
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
          data-prevent-window-focus
          onKeyDown={onKeyDown}
          onFocus={select}
          value={url()}
          type="text"
        />

        <button
          onClick={() => onSearch(true)}
          title="Search"
        >
          <Search />
        </button>
      </div>
    </div>
  );
};
