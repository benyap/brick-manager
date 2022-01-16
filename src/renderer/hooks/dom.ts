export function useDocumentBody() {
  return document.body;
}

function useNode(id: string) {
  const node = document.getElementById(id);
  if (!node) throw new Error(`${id} node not found`);
  return node;
}

export function useAppNode() {
  return useNode("app");
}

export function usePortalNode() {
  return useNode("portal");
}
