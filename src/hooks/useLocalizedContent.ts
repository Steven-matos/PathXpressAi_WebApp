import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export const useLocalizedContent = () => {
  const currentLang = useSelector((state: RootState) => state.language.currentLang);
  const translations = useSelector((state: RootState) => state.language.translations);

  const t = (key: string): string => {
    const keys = key.split('.');
    let result = translations[currentLang];
    
    for (const k of keys) {
      if (!result) break;
      const arrayMatch = k.match(/(\w+)\[(\d+)\]/);
      
      if (arrayMatch) {
        const [, prop, index] = arrayMatch;
        result = result[prop]?.[parseInt(index)];
      } else {
        result = result[k];
      }
    }
    
    return result || key;
  };

  return { t, currentLang };
}; 