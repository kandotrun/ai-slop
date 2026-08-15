import { useEffect, useRef } from "react";
import { Button } from "../ui/Button";
import { MenuIcon, PlusIcon, SearchIcon } from "../ui/icons";

interface TopbarProps {
  crumb: string;
  status?: string;
  showSearch: boolean;
  searchValue: string;
  onSearch: (value: string) => void;
  onUpload: () => void;
  onMenu: () => void;
}

export function Topbar({ crumb, status, showSearch, searchValue, onSearch, onUpload, onMenu }: TopbarProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="gs-topbar">
      <button className="gs-menu-btn" onClick={onMenu} aria-label="メニューを開く">
        <MenuIcon size={20} />
      </button>
      <div className="gs-crumb">
        {crumb}
        {status && status !== "準備完了" ? (
          <span className="gs-muted gs-mono" style={{ fontSize: 12, fontWeight: 400 }}>
            · {status}
          </span>
        ) : null}
      </div>
      <div className="gs-topbar-actions">
        {showSearch ? (
          <div className="gs-search">
            <SearchIcon size={15} />
            <input
              ref={searchRef}
              placeholder="サイトを検索…"
              value={searchValue}
              onChange={(event) => onSearch(event.target.value)}
            />
            <kbd className="gs-kbd">⌘K</kbd>
          </div>
        ) : null}

        <Button onClick={onUpload}>
          <PlusIcon size={16} />
          新規公開
        </Button>
      </div>
    </header>
  );
}
