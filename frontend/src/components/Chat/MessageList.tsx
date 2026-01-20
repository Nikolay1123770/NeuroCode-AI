// frontend/src/components/Chat/MessageList.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Message } from '../../types';
import { Bot, User, Copy, Check } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Начните диалог с NeuroCode-AI
          </h3>
          <p className="text-gray-400 max-w-md">
            Задайте вопрос о программировании, попросите проанализировать код 
            или помочь с задачей
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              message.role === 'user'
                ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                : 'bg-gray-800 text-gray-100'
            }`}
          >
            <div className="flex items-start space-x-3">
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="flex-1 overflow-hidden">
                <ReactMarkdown
                  className="prose prose-invert prose-sm max-w-none"
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      const codeString = String(children).replace(/\n$/, '');
                      const codeId = `${message.id}-${Math.random()}`;
                      
                      if (!inline && match) {
                        return (
                          <div className="relative group">
                            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => copyToClipboard(codeString, codeId)}
                                className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                              >
                                {copiedId === codeId ? (
                                  <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Copy className="w-4 h-4 text-gray-300" />
                                )}
                              </button>
                            </div>
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              className="rounded-xl !bg-gray-900/50 !my-2"
                              {...props}
                            >
                              {codeString}
                            </SyntaxHighlighter>
                          </div>
                        );
                      }
                      return (
                        <code className="px-1.5 py-0.5 bg-gray-700 rounded text-sm" {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
