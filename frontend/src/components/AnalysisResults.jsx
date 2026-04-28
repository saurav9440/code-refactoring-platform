import React from 'react';
import ScoreRing from './ScoreRing';
import Editor from '@monaco-editor/react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export default function AnalysisResults({ results }) {
  if (!results) return null;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Section: Score and Summary */}
      <div className="flex gap-6 items-start">
        <ScoreRing score={results.qualityScore} />
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">Analysis Summary</h2>
          <p className="text-gray-300 leading-relaxed mb-4">{results.summary}</p>
          <div className="bg-dark-800 p-4 rounded-lg border border-dark-700 flex gap-3">
            <Info className="text-primary-500 shrink-0 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-primary-400 mb-1">Analogy</h3>
              <p className="text-sm text-gray-400">{results.analogy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Issues Section */}
      {results.issues && results.issues.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="text-red-400" />
            Detected Issues
          </h3>
          <ul className="space-y-2">
            {results.issues.map((issue, idx) => (
              <li key={idx} className="bg-red-950/30 border border-red-900/50 p-3 rounded-md text-red-200 text-sm flex gap-3 items-start">
                <span className="bg-red-500/20 text-red-400 px-2 rounded text-xs py-0.5 mt-0.5 shrink-0">Issue</span>
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.issues && results.issues.length === 0 && (
        <div className="bg-green-950/30 border border-green-900/50 p-4 rounded-lg flex items-center gap-3">
          <CheckCircle2 className="text-green-500" />
          <span className="text-green-200">Great job! No major issues found.</span>
        </div>
      )}

      {/* Line by Line Explanation */}
      {results.lineByLine && results.lineByLine.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Line by Line Breakdown</h3>
          <div className="bg-dark-800 rounded-lg overflow-hidden border border-dark-700">
            {results.lineByLine.map((item, idx) => (
              <div key={idx} className="flex border-b border-dark-700 last:border-0 hover:bg-dark-700/50 transition">
                <div className="w-12 shrink-0 bg-dark-900 text-gray-500 flex items-center justify-center text-xs font-mono border-r border-dark-700">
                  {item.line}
                </div>
                <div className="p-3 text-sm text-gray-300">
                  {item.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refactored Code */}
      {results.refactoredCode && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-green-400">Suggested Refactor</h3>
          <div className="h-64 rounded-lg overflow-hidden border border-dark-700">
            <Editor
              height="100%"
              language="javascript"
              value={results.refactoredCode}
              theme="vs-dark"
              options={{ readOnly: true, minimap: { enabled: false } }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
