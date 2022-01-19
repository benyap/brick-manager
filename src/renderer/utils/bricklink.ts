export class BrickLinkScraper {
  private partUrl(id: string) {
    return `https://www.bricklink.com/v2/catalog/catalogitem.page?P=${id}`;
  }

  private async getPageSource(url: string, signal?: AbortSignal): Promise<string> {
    return await fetch(url, { signal })
      .then((res) => res.text())
      .catch((error) => {
        if (error.message.includes("aborted a request")) return "";
        throw error;
      });
  }

  getPartImages(id: string) {
    const controller = new AbortController();
    const url = this.partUrl(id);
    const promise = this.getPageSource(url, controller.signal).then((source) => {
      const re = new RegExp(`img\\.bricklink\\.com/[\\w/]+/${id}\\.png`, "gi");
      const matches = source.matchAll(re);
      return Array.from(matches).map((m) => `https://${m[0]}`);
    });
    return { promise, controller };
  }
}

export const brickLinkScraper = new BrickLinkScraper();
