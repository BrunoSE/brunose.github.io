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
Bruno Stefoni - AI Engineer
Location: New York, NY | Email: brunostefoni12@gmail.com | Phone: +1 646 203 7124

PROFESSIONAL SUMMARY:
AI/ML Engineer with 8 years of experience architecting and deploying production AI systems, specialized in LLM agents, RAG pipelines, and cloud-native ML solutions. Proven track record leading both company product and customer-facing projects from design to deployment on GCP and AWS, building intelligent data systems and Agents that solve complex business problems, and implementing robust evaluation frameworks for AI applications.

RECENT EXPERIENCE:

CloudWerx - Senior AI/ML Engineer (Nov 2023 - Nov 2024) | Manhattan, New York
- Led 3 of 6 customer AI/ML projects end-to-end across healthcare, cybersecurity, ecommerce, and finance
- Deployed production systems on GCP using Vertex AI, Cloud Run, BigQuery, AlloyDB, and Kubeflow
- Built hybrid search engine with vector + keyword search using AlloyDB and Cloud Run
- Created RAG medical transcript system injecting clinical guidelines
- Developed Mixtral-powered cybersecurity chatbot with RAG for audit assistance
- Fine-tuned Stable Diffusion on Vertex AI for architecture design, improving approval rate from 30% to 60% using LoRA and GCS workflows
- Implemented Kubeflow MLOps CI/CD pipeline for medical x-ray detection with automated deployment and monitoring

Aetna - CVS Health - Data Scientist (Sep 2023 - Oct 2023) | Manhattan, New York
- Designed A/B test framework for 9M MAU mobile app to measure campaign impact on adoption KPIs
- Analyzed live A/A experiment data in BigQuery for demographic validation of test methodology

Google - Data Scientist Intern (Jun 2022 - Aug 2022) | Mountain View, California
- Built enterprise network datasets from multiple sources using PLX, BigQuery, and Python for strategic analysis
- Identified 15% user churn risk through survival and time series analysis of adoption data
- Presented insights to leadership, proposing new analytical methodologies for company-wide adoption

STP - Data Scientist (May 2018 - May 2022) | Santiago, Chile
- Deployed company-wide chatbot on on-prem infrastructure supporting 500+ field workers
- Increased revenue by identifying routes with 25% speed discrepancy through geospatial analysis
- Prevented $500K investment by leading statistical measurement campaign evaluating alternative solutions
- Detected battery issues in 20% of electric fleet via anomaly detection on telemetry data
- Improved KPI 6% by automating Twitter scraping and NLP classification for real-time disruption reporting

TECHNICAL SKILLS:
Certifications: Google Cloud Professional Machine Learning Engineer (May 2024 - May 2026)
Programming Languages: Python, Go, Java, R, MATLAB
AI/Agent Frameworks: Langchain, LangGraph, Google ADK, HuggingFace, Transformers, Instructor, Pydantic, OpenAI API, MCP, Arazzo, OAS 3.0, Claude Code
ML Libraries: PyTorch, PyTorch-Lightning, XGBoost, LGBM, scikit-learn, statsmodels
Cloud Platforms & Services: Google Cloud Platform (Vertex AI, Cloud Run, BigQuery, AlloyDB, Cloud Tasks, GCS, Compute Engine, Kubeflow), AWS (Bedrock, EC2, Lambda, RDS)
Databases: SQLite, PostgreSQL, Snowflake, Vector DBs (Milvus, Pinecone)
DevOps & Infrastructure: Git, Docker, Terraform, Bash, Linux, gRPC, REST APIs
Data Analysis: Pandas, NumPy, Plotly, Seaborn, Matplotlib
NLP: NLTK, SpaCy, fastText
Big Data: pySpark, Dask, Dataflow, Apache Beam
Languages: Native English and Spanish speaker, Intermediate Italian

KEY PROJECTS & PUBLICATIONS:
1. Anky: Developed production RAG system with fine-tuned LLM using SFT/DPO via llama.cpp, trained on social network data for personalized content generation
2. Deep Learning Competition: Implemented next-frame video prediction using Transformer and ResNet CNN architectures in Joint-Embedding Predictive Architecture (JEPA) network
3. Master's Thesis Publications: Published two peer-reviewed papers on computer microscopic simulation methodologies and applications
4. S&P Global Capstone Project: Achieved 90% accuracy in financial news classification by fine-tuning BERT model on unlabeled corpus using self-supervised learning
5. Text Topic Analysis: Applied LDA and GloVe word embeddings for topic modeling and semantic analysis on large-scale academic thesis corpus
6. Twitter Sentiment Analysis: Built sentiment analysis pipeline using fastText and fine-tuned BERT for content strategy assessment and brand monitoring
7. Hackathon Winner: Led team of 6 engineers to design and develop award-winning mobile application for public transit users

EDUCATION:
New York University - Master of Science in Data Science (2021-2023)
- GPA: 3.8/4.0
- Coursework: Deep Learning, Machine Learning, Big Data, Optimization & Linear Algebra, Probability & Statistics
- Teaching Assistant for Data Science course at NYU Stern School of Business for two semesters

Universidad de Chile - Bachelor and Master's degree in Engineering (2018)
- Final grade 6.6/7.0
- Graduated with highest distinction in top 10% GPA of cohort
- Granted Outstanding Student Award for academic excellence
- Teaching Assistant for five courses including Stochastic Processes and Network Optimization
- Key Modules: Data Mining, Computer Science I and II, Probability, Statistics, Optimization, Operations Research

NOTABLE ACHIEVEMENTS:
- Improved LLM evaluation expert agreement from 30% to 70% through calibration
- Reduced AI chatbot response latency from 5 minutes to 1 minute (80% improvement)
- Led 6 production AI deployments across healthcare, cybersecurity, ecommerce, and finance
- Improved Stable Diffusion approval rate from 30% to 60% (100% relative improvement)
- Prevented $500K investment through data-driven analysis
- Increased revenue through 25% route optimization discovery
- Built chatbot supporting 500+ field workers
- Achieved 90% accuracy on financial news classification
- Published 2 peer-reviewed papers
- Won hackathon with team of 6 engineers
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
        model: 'llama-3.3-70b-versatile',
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
- Don't make up information not in the knowledge base`
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
