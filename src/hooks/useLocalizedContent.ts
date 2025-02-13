import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export const useLocalizedContent = () => {
  const currentLang = useSelector((state: RootState) => state.language.currentLang);
  const translations = useSelector((state: RootState) => state.language.translations);

  const t = (key: string): string => {
    const keys = key.split('.');
    let result = translations[currentLang];
    
    for (const k of keys) {
      if (!result) {
        return key;
      }
      const arrayMatch = k.match(/(\w+)\[(\d+)\]/);
      
      if (arrayMatch) {
        const [, prop, indexStr] = arrayMatch;
        const index = indexStr ? parseInt(indexStr) : 0;
        const obj = result as Record<string, any>;
        const propVal = obj[prop as keyof typeof obj];
        if (Array.isArray(propVal)) {
          result = propVal[index] ?? propVal[0];
        } else {
          result = undefined;
        }
      } else {
        result = (result as Record<string, any>)[k];
      }
    }
    
    return result !== undefined ? String(result) : key;
  };

  return { t, currentLang };
}; 