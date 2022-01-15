export function plural(
  count: number,
  singularWord: string,
  pluralWord: string = `${singularWord}s`
) {
  return count === 1 ? singularWord : pluralWord;
}

export function countString(
  count: number,
  singularWord: string,
  pluralWord: string = `${singularWord}s`
) {
  return `${count} ${plural(count, singularWord, pluralWord)}`;
}
