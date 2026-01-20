// frontend/src/components/CodeEditor/Editor.tsx
import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { codeApi } from '../../services/api';
import { Play, Wand2, Bug, FileQuestion, Loader2 } from 'lucide-react';

export const CodeEditor: React.FC = () => {
  const [code, setCode] = useState('// Введите ваш код здесь\n');
  const [language, setLanguage] = useState('javascript');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'cpp', name: 'C++' },
    { id: 'csharp', name: 'C#' },
    { id: 'go', name: 'Go' },
    { id: 'rust', name: 'Rust' },
    { id: 'php', name: 'PHP' },
    { id: 'ruby', name: 'Ruby' },
  ];

  const handleAction = async (action: 'analyze' | 'fix' | 'explain') => {
    setIsLoading(true);
    setActiveAction(action);
    try {
      let response;
      switch (action) {
        case 'analyze':
          response = await codeApi.analyze(code, language);
          setResult(response.data.analysis);
          break;
        case 'fix':
          response = await codeApi.fix(code, undefined, language);
          setResult(response.data.fixed_code);
          break;
        case 'explain':
          response = await codeApi.explain(code, language);
          setResult(response.data.explanation);
          break;
      }
    } catch (error) {
      setResult('Произошла ошибка при обработке запроса');
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleAction('analyze')}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {activeAction === 'analyze' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            <span>Анализ</span>
          </button>
          
          <button
            onClick={() => handleAction('fix')}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {activeAction === 'fix' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Bug className="w-4 h-4" />
            )}
            <span>Исправить</span>
          </button>
          
          <button
            onClick={() => handleAction('explain')}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {activeAction === 'explain' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileQuestion className="w-4 h-4" />
            )}
            <span>Объяснить</span>
          </button>
        </div>
      </div>

      {/* Editor and Results */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 border-r border-gray-700">
          <MonacoEditor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Results Panel */}
        <div className="w-1/2 flex flex-col bg-gray-800">
          <div className="px-4 py-3 border-b border-gray-700">
            <h3 className="text-white font-medium">Результат</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {result ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-gray-300 text-sm">
                  {result}
                </pre>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Wand2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Выберите действие для анализа кода</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
