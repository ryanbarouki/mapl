import { useCallback, useState } from "react";
import { loadAll, save, saveValue } from "../save_local";

function initializeEmptyValue(type) {
  switch (type) {
    case 'number':
      return 0;
    case 'string':
      return '';
    case 'boolean':
      return false;
    case 'object':
      return {};
    case 'array':
      return [];
    case 'null':
      return null;
    case 'undefined':
      return undefined;
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

export function useStore(key, dayString, type) {
  const [item, setItem] = useState(loadAll(key)[dayString] ?? initializeEmptyValue(type));

  const addItem = useCallback(newValue => {
    setItem(newValue);
    saveValue(dayString, key, newValue);
  },
    [dayString, key]
  );

  return [item, addItem];
}
