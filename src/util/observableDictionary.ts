export const createObservableDictionary = <T>(
  dict: Record<string, T>,
  onChange: (key: string, value: T) => void
) =>
  new Proxy(dict, {
    set(target, key: string, value) {
      target[key] = value;
      onChange(key as string, value);
      return true;
    },
  });
