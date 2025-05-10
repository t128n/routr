import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from "@/lib/utils";

interface MarkdownProps {
  content: string;
  className?: string;
}

/**
 * Komponente zur Darstellung von Markdown-formatierten Inhalten
 * 
 * @param content - Der Markdown-formatierte Text
 * @param className - Optionale CSS-Klassen
 */
export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={cn("prose prose-sm dark:prose-invert", className)}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />,
          p: ({ node, ...props }) => <p className="my-2" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-2" {...props} />,
          li: ({ node, ...props }) => <li className="my-1" {...props} />,
          a: ({ node, ...props }) => <a className="text-blue-600 dark:text-blue-400 hover:underline" {...props} />,
          blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-3" {...props} />,
          code: ({ node, className, inline, ...props }) => (
            inline ? 
              <code className="bg-gray-200 dark:bg-gray-800 rounded px-1 py-0.5" {...props} /> : 
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto my-4">
                <code className="text-sm" {...props} />
              </pre>
          ),
          img: ({ node, ...props }) => <img className="max-w-full h-auto rounded-md my-4" {...props} />,
          table: ({ node, ...props }) => <table className="border-collapse w-full my-4" {...props} />,
          th: ({ node, ...props }) => <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left" {...props} />,
          td: ({ node, ...props }) => <td className="border border-gray-300 dark:border-gray-700 px-4 py-2" {...props} />
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 