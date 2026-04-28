import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import CodeEditor from './components/CodeEditor';
import AnalysisResults from './components/AnalysisResults';
import { Play, Loader, Code2, Sparkles, Upload, FileCode } from 'lucide-react';

const socket = io('http://localhost:5000');

function App() {
  const [code, setCode] = useState('// Enter your code here or click "Upload File" above...\nfunction helloWorld() {\n  console.log("Hello, World!");\n}');
  const [language, setLanguage] = useState('javascript');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    socket.on('analysisUpdate', (data) => {
      setStatus(`Processing: ${data.step}...`);
    });

    socket.on('analysisComplete', (data) => {
      setIsAnalyzing(false);
      setResults(data);
      setStatus('Analysis Complete!');
    });

    socket.on('analysisError', (data) => {
      setIsAnalyzing(false);
      setStatus(`Error: ${data.error}`);
    });

    return () => {
      socket.off('analysisUpdate');
      socket.off('analysisComplete');
      socket.off('analysisError');
    };
  }, []);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setResults(null);
    setStatus('Initializing AI Refactoring...');
    try {
      const response = await axios.post('http://localhost:5000/api/v1/analysis', {
        code,
        language
      });
      const { jobId } = response.data;
      socket.emit('subscribeToJob', { jobId });
    } catch (error) {
      setIsAnalyzing(false);
      setStatus('Failed to connect to AI server');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Auto-detect language
    const ext = file.name.split('.').pop();
    if (ext === 'js' || ext === 'jsx') setLanguage('javascript');
    else if (ext === 'py') setLanguage('python');
    else if (ext === 'java') setLanguage('java');
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setCode(event.target.result);
    };
    reader.readAsText(file);
    // Reset input so the same file can be uploaded again if needed
    e.target.value = null;
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      {/* Header */}
      <header className="glass-panel px-6 py-4 flex justify-between items-center z-10 sticky top-0 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-primary-600 to-purple-600 rounded-lg shadow-lg shadow-primary-500/20">
            <Code2 className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            AI Refactoring Studio
          </h1>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="relative">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none bg-dark-800/80 hover:bg-dark-700 text-sm font-medium py-2.5 pl-4 pr-10 rounded-lg border border-white/10 outline-none focus:border-primary-500/50 transition shadow-inner cursor-pointer"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          
          <button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
            className="group relative flex items-center gap-2 bg-gradient-to-r from-primary-600 to-blue-500 hover:from-primary-500 hover:to-blue-400 px-6 py-2.5 rounded-lg font-semibold text-white transition-all shadow-lg hover:shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center gap-2">
              {isAnalyzing ? <Loader className="animate-spin" size={18} /> : <Sparkles size={18} />}
              {isAnalyzing ? 'Analyzing...' : 'Refactor Now'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col md:flex-row gap-6 p-6 overflow-hidden min-h-[500px]">
        {/* Left Panel: Editor */}
        <div className="w-full md:w-1/2 flex flex-col glass-card h-full overflow-hidden border-2 border-dark-700 hover:border-primary-500/50 transition-colors duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-dark-900/80 shrink-0">
            <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <FileCode className="text-primary-400" size={18} />
              Input Code
            </span>
            <div className="flex gap-3 items-center">
              <label className="cursor-pointer bg-primary-600/20 hover:bg-primary-600/40 text-primary-300 px-3 py-1.5 rounded text-xs font-medium border border-primary-500/30 transition flex items-center gap-2">
                <Upload size={14} /> Upload File
                <input type="file" className="hidden" accept=".js,.jsx,.ts,.py,.java,.txt" onChange={handleFileUpload} />
              </label>
              <span className="text-xs text-gray-500 font-mono bg-dark-950 px-2 py-1 rounded">index.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'java'}</span>
            </div>
          </div>
          
          <div className="flex-1 w-full bg-dark-900/90 relative min-h-[300px]">
             {/* If the user is struggling to see the editor, this placeholder text acts as a giant hint before Monaco fully loads */}
             {!code && (
               <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-mono text-sm pointer-events-none z-0">
                 Loading Editor...
               </div>
             )}
             <CodeEditor code={code} onChange={setCode} language={language} />
          </div>
        </div>
        
        {/* Right Panel: Results */}
        <div className="w-full md:w-1/2 flex flex-col glass-card h-full overflow-hidden relative border-2 border-dark-800">
          <div className="px-4 py-3 border-b border-white/5 bg-dark-900/80 flex justify-between items-center z-10 shrink-0">
            <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Sparkles className="text-purple-400" size={18} />
              AI Insights
            </span>
            {status && (
              <span className="text-xs font-mono px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full border border-primary-500/20">
                {status}
              </span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 relative">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary-500/5 blur-3xl rounded-full pointer-events-none" />
            
            {results ? (
              <AnalysisResults results={results} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center px-12 animate-fadeIn">
                <div className="w-24 h-24 mb-6 rounded-full bg-dark-800 border border-white/5 flex items-center justify-center shadow-2xl relative">
                  <div className="absolute inset-0 rounded-full border border-primary-500/30 animate-ping opacity-20"></div>
                  <Sparkles className="text-primary-500" size={32} />
                </div>
                <h3 className="text-2xl font-display font-semibold mb-3 text-white">Awaiting Instructions</h3>
                <p className="text-gray-400 leading-relaxed max-w-sm">
                  {isAnalyzing 
                    ? "Our AI is currently examining your code structure, detecting bugs, and generating an optimized refactor." 
                    : "Paste your code, type in the editor, or upload a file. Then hit 'Refactor Now' to unleash the AI."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
