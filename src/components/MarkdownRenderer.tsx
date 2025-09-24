import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer = ({ content, className = '' }: MarkdownRendererProps) => {
  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          // 제목 스타일링
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-lol-gold mb-4 border-b border-gray-600 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-lol-gold mb-3 mt-6">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-white mb-2 mt-4">
              {children}
            </h3>
          ),
          
          // 단락 스타일링
          p: ({ children }) => (
            <p className="text-gray-300 mb-3 leading-relaxed">
              {children}
            </p>
          ),
          
          // 리스트 스타일링
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-300">
              {children}
            </li>
          ),
          
          // 강조 텍스트 스타일링
          strong: ({ children }) => (
            <strong className="font-bold text-lol-gold">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-blue-300">
              {children}
            </em>
          ),
          
          // 코드 블록 스타일링
          code: ({ children, ...props }) => {
            const isInline = !props.className;
            if (isInline) {
              return (
                <code className="bg-gray-800 text-lol-gold px-1 py-0.5 rounded text-sm">
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-gray-800 text-gray-300 p-4 rounded-lg overflow-x-auto mb-4">
                <code>{children}</code>
              </pre>
            );
          },
          
          // 인용문 스타일링
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-lol-gold bg-gray-800 pl-4 py-2 mb-4 italic text-gray-300">
              {children}
            </blockquote>
          ),
          
          // 테이블 스타일링
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-gray-600">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-800">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="bg-gray-900">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-gray-600">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="text-left text-lol-gold font-semibold px-4 py-2 border-r border-gray-600">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="text-gray-300 px-4 py-2 border-r border-gray-600">
              {children}
            </td>
          ),
          
          // 구분선 스타일링
          hr: () => (
            <hr className="border-gray-600 my-6" />
          ),
          
          // 링크 스타일링
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="text-blue-400 hover:text-blue-300 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;