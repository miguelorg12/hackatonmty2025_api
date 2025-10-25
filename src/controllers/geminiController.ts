import { Request, Response } from 'express';
import { generateResponse } from '../services/geminiService';
import { ResponseMode } from '../types/gemini';

export const generateContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, mode, maxLength } = req.body;

    if (!message?.trim()) {
      res.status(400).json({ success: false, error: 'Message is required' });
      return;
    }

    if (message.length > 10000) {
      res.status(400).json({ success: false, error: 'Message too long (max 10,000)' });
      return;
    }

    if (mode && !Object.values(ResponseMode).includes(mode)) {
      res.status(400).json({ 
        success: false, 
        error: `Invalid mode. Options: ${Object.values(ResponseMode).join(', ')}` 
      });
      return;
    }

    if (maxLength && (maxLength < 50 || maxLength > 5000)) {
      res.status(400).json({ success: false, error: 'maxLength must be 50-5000' });
      return;
    }

    const response = await generateResponse(
      message, 
      mode || ResponseMode.NORMAL, 
      maxLength
    );

    res.json({
      success: true,
      data:response,
    });

  } catch (error: any) {
    console.error('Gemini error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate content',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
