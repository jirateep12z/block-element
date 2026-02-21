import { Coffee, Heart } from 'lucide-react';

export function Footer() {
  const HandleDonateClick = () => {
    chrome.tabs.create({ url: 'https://buymeacoffee.com/jirateep12z' });
  };

  return (
    <footer className="border-border mt-4 border-t pt-3">
      <div className="flex flex-col items-center gap-3">
        <p className="text-muted-foreground flex items-center gap-1 text-xs">
          Made with <Heart className="h-3 w-3 fill-red-500 text-red-500" /> by
          <span className="text-foreground font-medium">jirateep12z</span>
        </p>
        <button
          onClick={HandleDonateClick}
          className="flex items-center gap-1.5 rounded-full bg-yellow-400/20 px-3 py-1.5 text-xs font-medium text-yellow-600 hover:bg-yellow-400/30 dark:bg-yellow-400/10 dark:text-yellow-400 dark:hover:bg-yellow-400/20"
        >
          <Coffee className="h-3.5 w-3.5" />
          Buy me a coffee
        </button>
      </div>
    </footer>
  );
}
