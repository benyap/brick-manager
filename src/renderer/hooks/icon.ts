import { useEffect, useState } from "react";

export function useIconByName(name?: string, context?: string) {
  const [iconElement, setIconElement] = useState<JSX.Element>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!name) return;
    import(`~/components/icons/${name}`)
      .then((element) => {
        setIconElement(element[name]);
      })
      .catch((error) => {
        let message = `Failed to load icon "${name}"`;
        if (context) message += ` for ${context}`;
        message += `: ${error.code}`;
        setError(error);
        console.error(message);
      });
  }, [name, context]);

  return [iconElement, error] as const;
}
