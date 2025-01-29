import { TranslationProvider } from '@/context/TranslationContext';
import { TermsAndConditions } from '@/components/page-components/terms-and-conditions';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ReduxProvider } from '@/providers/redux-provider';

export default function Page() {
  return (
    <TranslationProvider>
      <ReduxProvider>
        <Header />
        <TermsAndConditions />
        <Footer />
      </ReduxProvider>
    </TranslationProvider>
  );
}
