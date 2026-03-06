# Momentum

Turn curiosity into action. Momentum helps you convert a topic you're curious about into a structured 7-day action plan.

## Overview

Momentum is a simple web application that takes a topic of curiosity and generates a personalized 7-day action plan using AI. Whether you want to learn AI agents, start photography, or explore a new career path, Momentum breaks it down into achievable daily tasks.

## Features

- Simple, minimal UI inspired by tools like Notion and Linear
- Input your topic, available time per day, and goal
- AI-generated 7-day action plan with daily objectives, tasks, and expected outcomes
- Responsive design for all devices
- Loading states for smooth UX
- "Start Day 1" button for psychological commitment

## Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Inter font

**Backend:**
- FastAPI (Python)
- OpenAI API
- Pydantic

## Project Structure

```
momentum/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main application component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Styles (Tailwind)
│   ├── index.html           # HTML template
│   ├── package.json         # Node dependencies
│   ├── tailwind.config.js   # Tailwind configuration
│   └── vite.config.js       # Vite configuration
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file:
```bash
cp .env.example .env
```

5. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

6. Run the backend:
```bash
python main.py
```

The backend will start at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Run the frontend:
```bash
npm run dev
```

The frontend will start at `http://localhost:3000`

## Deployment

### Deploy Frontend to Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variable: `VITE_API_URL` pointing to your backend
4. Deploy

### Deploy Backend to Render

1. Push your code to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Select your repository
4. Configure:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python main.py`
5. Add environment variable: `OPENAI_API_KEY`
6. Deploy

### Environment Variables for Production

**Frontend (Vercel):**
```
VITE_API_URL=https://your-backend-url.onrender.com
```

**Backend (Render):**
```
OPENAI_API_KEY=your_openai_api_key
```

## API Endpoints

### POST /generate-plan

Generate a 7-day action plan.

**Request Body:**
```json
{
  "topic": "AI agents",
  "time_available": "30 min",
  "goal": "Build a small project"
}
```

**Response:**
```json
{
  "title": "7 Day AI Agents Starter Sprint",
  "description": "A beginner-friendly sprint to start building AI agents",
  "days": [
    {
      "day": 1,
      "objective": "Understand the concept",
      "task": "Read about what AI agents are and how they work",
      "expected_result": "Basic understanding of agents"
    }
  ]
}
```

## Customization

### Changing AI Model

Edit `backend/main.py` and change the model in the OpenAI API call:
```python
model="gpt-4o-mini"  # or "gpt-4", "gpt-3.5-turbo", etc.
```

### Modifying the Prompt

The system prompt is defined in `backend/main.py` as `SYSTEM_PROMPT`. Edit this to customize how plans are generated.

### Styling

The frontend uses Tailwind CSS. Modify `tailwind.config.js` or `src/index.css` to customize the design.

## License

MIT