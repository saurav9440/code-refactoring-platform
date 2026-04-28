import { getIO } from '../services/websocket.service.js';
import { analyzeJavaScriptCode } from '../services/ast.service.js';
import { getCodeAnalysisAndRefactor } from '../services/ai.service.js';
import crypto from 'crypto';

export const analyzeCode = async (req, res) => {
  const { code, language } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  const jobId = crypto.randomUUID();

  // Send initial response acknowledging the job
  res.status(202).json({ jobId, status: 'processing' });

  // Process asynchronously
  processAnalysis(jobId, code, language).catch(err => {
    console.error("Error processing analysis:", err);
    try {
      const io = getIO();
      io.to(jobId).emit('analysisError', { error: 'Failed to process analysis' });
    } catch (e) {}
  });
};

const processAnalysis = async (jobId, code, language) => {
  const io = getIO();

  // Step 1: AST Analysis (if JavaScript)
  let astIssues = [];
  let astScore = 100;
  
  if (language === 'javascript' || language === 'js') {
    const astResult = analyzeJavaScriptCode(code);
    if (astResult.success) {
      astIssues = astResult.issues;
      astScore = astResult.complexityScore;
    }
  }

  // Notify frontend that AST analysis is complete
  io.to(jobId).emit('analysisUpdate', { step: 'AST', status: 'completed' });

  // Step 2: AI Analysis
  const aiResult = await getCodeAnalysisAndRefactor(code, language || 'javascript');

  // Combine results
  const finalResult = {
    jobId,
    summary: aiResult.summary,
    analogy: aiResult.analogy,
    lineByLine: aiResult.lineByLine,
    issues: [...astIssues, ...(aiResult.issues || [])],
    qualityScore: Math.min(astScore, aiResult.qualityScore || 100),
    refactoredCode: aiResult.refactoredCode
  };

  // Notify frontend of completion
  io.to(jobId).emit('analysisComplete', finalResult);
};
