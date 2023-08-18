import { OS } from "@/app";
import CSS from "./Toolbar.module.css";
import { createSignal } from "solid-js";
import type { ToolbarProps } from "./types";
import { DELTA_UPDATE } from "@/utils/Number";
import { startUrl, historyList } from "./utils";

import Arrow from "@/assets/icons/Browser/arrow.svg";
import Reload from "@/assets/icons/Browser/reload.svg";
import Search from "@/assets/icons/Browser/search.svg";

export const Toolbar = ({
  onNavigate,
  onFocus,
  id
}: ToolbarProps) => {
  const [cursor, setCursor] = createSignal(0);
  const [url, setUrl] = createSignal(startUrl);

  const onReload = () => OS.Electron?.reloadBrowser(id);

  const onKeyDown = (event: KeyboardEvent) =>
    event.key === "Enter" ? onSearch()
      : setUrl((search as HTMLInputElement).value);

  const onClick = () => {
    const window = document.getElementById(id) as HTMLElement;
    if (window.style.zIndex !== "1") onFocus?.(window);
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

  const onSearch = () => {
    if (historyList.getLast(id) === url()) return;

    if (!url().match(/https?:\/\/(www\.)?/))
      setUrl(`http://${url()}`);

    onNavigate(id, url());
    setCursor(cursor() + 1);
    (search as HTMLInputElement).blur();
  };

  const select = () => {
    onClick();

    setTimeout(() => {
      OS.Electron?.blurBrowser(id);
      (search as HTMLInputElement).select();
    }, DELTA_UPDATE);
  };

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
          classList={{ [CSS.disabled]: true }}
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
          onClick={onSearch}
          title="Search"
        >
          <Search />
        </button>
      </div>
    </div>
  );
};
