const express = require('express');
const router = express.Router();
const axios = require('axios');
const rateLimit = require('express-rate-limit');

// Rate limiter: 10 requests per minute per IP
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// API key authentication middleware
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const expectedApiKey = process.env.BRUNO_API_KEY;

  if (!expectedApiKey) {
    console.error('BRUNO_API_KEY not set in environment');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  if (!apiKey || apiKey !== expectedApiKey) {
    console.warn('Unauthorized request - invalid or missing API key');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

// Bruno's knowledge base (same as frontend)
const BRUNO_KNOWLEDGE = `
Bruno Stefoni - AI/ML Engineer
Location: New York, NY | Email: brunostefoni12@gmail.com
LinkedIn: https://www.linkedin.com/in/bruno-stefoni-escudero/ | GitHub: https://github.com/BrunoSE | Website: https://brunose.github.io/

PROFESSIONAL SUMMARY:
AI/ML Engineer with 8 years of experience building production AI infrastructure. Specialized in LLMOps, AI observability, and evaluation frameworks for production LLM systems. Track record of architecting agentic systems, building LLM-as-judge evaluation pipelines, and deploying AI infrastructure using MCP servers. Hands-on expertise in Python, GCP, and AWS.

CURRENT ROLE:
DRW Holdings - AI Engineer (May 2026 – Present) | Manhattan, New York
- Principal trading firm; currently ramping up as AI Engineer

MOST RECENT ROLE:
VideoAmp - Principal AI Engineer (Dec 2024 – Apr 2026) | Manhattan, New York
- Drove 0-to-1 creation of LLM evaluation infrastructure; calibrated LLM judge reaching 70% agreement with domain-expert labels (up from 30%) on a labelled dataset of 100 real workflows; the eval set (those 100 plus 100 synthetic variations) runs weekly across 4 production AI applications
- Engineered in-house Go/Python AI agent (Claude via AWS Bedrock) for automated data analysis against Snowflake; modular primitives (intent filtering, domain knowledge injection, query decomposition, answer synthesis); reduced latency from 5min to 1min
- Designed standards-based agent infrastructure using MCP with Arazzo and OpenAPI 3.0; K6 load testing achieved 50% server cost reduction
- Designed automated AI report processing pipeline using AWS Bedrock, Temporal, and Kafka
- Led MCP servers re-design with Progressive Discovery pattern via tool-search meta-tools; 93% context length reduction for agents connecting to 70+ tools
- Developed Go microservices with gRPC and REST APIs powering AI-driven analytics (codebase was roughly 90% Python, 10% Go; Python is his primary language)
- The AI agent was used by multiple internal and client-facing teams
- Worked with the Claude Code SDK at VideoAmp

CloudWerx - Senior AI/ML Engineer (Nov 2023 – Nov 2024) | Manhattan, New York
- Architected Analyze-Plan-Execute agentic framework for patient notes; cut documentation time from 7 to 2 minutes per note
- Led 3 of 6 AI/ML projects across healthcare, cybersecurity, ecommerce, and finance
- Deployed production systems on GCP (Vertex AI, Cloud Run, BigQuery, AlloyDB, Kubeflow)
- Primary technical liaison with Google Cloud for 6 company migrations into GCP
- Built hybrid vector + keyword search, medical RAG, Mixtral cybersecurity chatbot
- Implemented Kubeflow MLOps CI/CD for medical x-ray detection

Aetna - CVS Health - Data Scientist (Sep 2023 – Oct 2023) | Manhattan, New York
- Designed A/B test framework for 9M MAU mobile app; analyzed A/A experiment data in BigQuery

Google - Data Scientist Intern (Jun 2022 – Aug 2022) | Mountain View, California
- Built enterprise network datasets (PLX, BigQuery, Python); identified 15% user churn risk via survival analysis

STP - Data Scientist (May 2018 – May 2022) | Santiago, Chile
- Company-wide chatbot supporting 500+ field workers
- Identified routes with 25% speed discrepancy; prevented $500K investment via measurement campaign
- Detected battery issues in 20% of electric fleet; improved KPI 6% via Twitter NLP pipeline

TECHNICAL SKILLS:
Certifications: Google Cloud Professional Machine Learning Engineer (May 2024 – May 2026)
Languages: Python, Go, Java
AI/Agent Frameworks: MCP, Arazzo, OAS 3.0, Claude Code, LangChain, LangGraph, HuggingFace, Transformers, Instructor, Pydantic
ML: PyTorch, PyTorch-Lightning, XGBoost, LGBM, scikit-learn, statsmodels
Cloud: GCP (Vertex AI, Cloud Run, BigQuery, AlloyDB, Cloud Tasks, GCS, Compute Engine, Kubeflow), AWS (Bedrock, EC2, Lambda, RDS)
Databases: Snowflake, PostgreSQL, SQLite, Vector DBs (Milvus, Pinecone)
DevOps: Git, Docker, Terraform, K6, Temporal, Kafka, gRPC, REST APIs, Bash, Linux
Data: Pandas, NumPy, pySpark, Dask, Apache Beam, Plotly, Seaborn, Matplotlib
NLP: NLTK, SpaCy, fastText
Spoken: Native English and Spanish, Intermediate Italian

KEY PROJECTS & PUBLICATIONS:
1. Anky: Production RAG with fine-tuned LLM (SFT/DPO via llama.cpp) on social network data
2. Deep Learning Competition: JEPA next-frame video prediction (Transformer + ResNet CNN)
3. Master's Thesis: Two peer-reviewed papers on microscopic simulation
4. S&P Global Capstone: 90% accuracy financial news classification via BERT self-supervised fine-tuning
5. Hackathon Winner: Led team of 6 on award-winning public transit mobile app
6. Git Agent via Pure RL: Trained Qwen3-4B to chain multi-turn git tool calls through pure reinforcement learning (GRPO), with no demonstrations or SFT. Built a sandboxed environment with 13 git tools and 200 episodes, iterated the reward function through offline ablations, and reached 0.97-1.00 reward. Documented in a blog series at brunose.github.io.
7. Nombre Guaguas: Serverless dashboard on Cloudflare Workers and D1 exploring Chilean baby name trends from 1920 to 2025 using Civil Registry data, with an AI chat assistant for natural-language exploration. Live at guaguas.pages.dev.

AVAILABILITY:
No information. This knowledge base says nothing about whether Bruno is looking for a job, open to new roles, or open to relocation.

EDUCATION:
New York University - M.S. Data Science (2021–2023), GPA 3.8/4.0; TA at NYU Stern
Universidad de Chile - Bachelor and Master's in Engineering (2018), 6.6/7.0, highest distinction, top 10%

NOTABLE ACHIEVEMENTS:
- LLM judge agreement 30% → 70% via iterative calibration
- Agent latency 5 min → 1 min (5x)
- 93% context length reduction for agents with 70+ MCP tools (Progressive Discovery)
- 50% server cost reduction via K6 load testing
- Patient note documentation 7 min → 2 min
- Stable Diffusion approval rate 30% → 60%
- Eval framework running weekly across 4 production AI apps
- Prevented $500K investment; chatbot for 500+ field workers; 90% financial news accuracy; 2 papers; hackathon win
`.trim();

// POST /chat endpoint with rate limiting and API key auth
router.post('/', chatLimiter, validateApiKey, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get Groq API key from environment
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      console.error('GROQ_API_KEY not set in environment');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Call Groq API
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'openai/gpt-oss-120b',
        messages: [
          {
            role: 'system',
            content: `You are ResumeAI, an AI assistant that helps people learn about Bruno Stefoni's professional experience and expertise. Use the following knowledge base to answer questions accurately and concisely. If asked about something not in the knowledge base, politely say you don't have that information.

KNOWLEDGE BASE:
${BRUNO_KNOWLEDGE}

Instructions:
- Be friendly and professional
- Keep responses concise (2-3 sentences typically)
- Highlight specific achievements and technical skills
- If the question is about Bruno's experience, reference specific projects or companies
- Don't make up information not in the knowledge base
- If asked whether Bruno is looking for a job, open to new roles, or open to relocation, say you have no information about that`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Return the AI response
    res.json({
      response: response.data.choices[0].message.content
    });

  } catch (error) {
    console.error('Error calling Groq API:', error.message);
    if (error.response) {
      console.error('Groq API error response:', error.response.data);
    }
    res.status(500).json({
      error: 'Failed to process chat request'
    });
  }
});

module.exports = router;
