import { TranslationProvider } from '@/context/TranslationContext';
import { Home } from '@/components/page-components/Home';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ReduxProvider } from '@/providers/redux-provider';

export default function Page() {
  return (
    <TranslationProvider>
      <ReduxProvider>
        <Header />
        <Home />
        <Footer />
      </ReduxProvider>
    </TranslationProvider>
  );
}
