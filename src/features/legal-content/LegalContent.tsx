import ReactMarkdown from 'react-markdown';

interface LegalContentProps {
  content: string;
  title: string;
}

export function LegalContent({ content, title }: LegalContentProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <main className="max-w-4xl mx-auto py-16">
          <article className="prose lg:prose-xl">
            <h1 className="text-6xl font-extrabold text-gray-900 mb-8 underline underline-offset-4">
              {title}
            </h1>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
} 