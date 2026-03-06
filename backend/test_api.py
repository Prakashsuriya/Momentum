import os
from dotenv import load_dotenv
load_dotenv()
import openai
import json
import re

client = openai.OpenAI(
    api_key=os.getenv('OPENAI_API_KEY'),
    base_url=os.getenv('OPENAI_BASE_URL')
)

SYSTEM_PROMPT = """You are an expert learning coach.

Your job is to convert a curiosity topic into a realistic 7-day action sprint.

Generate a practical and motivating 7-day action plan.

Each day must contain:
- day: day number (1-7)
- objective: clear objective for the day
- task: specific actionable task
- expected_result: what the user will accomplish

Return ONLY a JSON object in this exact format:
{
    "title": "7 Day Python Programming Sprint",
    "description": "A beginner-friendly sprint to learn Python basics",
    "days": [
        {
            "day": 1,
            "objective": "Set up environment",
            "task": "Install Python and write your first Hello World program",
            "expected_result": "Python installed and first program running"
        },
        {
            "day": 2,
            "objective": "Learn variables",
            "task": "Practice creating variables of different types",
            "expected_result": "Understanding of variables and data types"
        }
    ]
}

IMPORTANT: Return ONLY the JSON object, no markdown, no code blocks, no extra text."""

user_prompt = """Topic: Python programming
Time available per day: 30 min
Goal: Learn basics

Generate a practical 7-day action plan."""

try:
    response = client.chat.completions.create(
        model=os.getenv('MODEL_NAME'),
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.7,
        max_tokens=2000
    )

    content = response.choices[0].message.content
    print("Raw response:")
    print(content)
    print("\n" + "="*50 + "\n")

    # Try to extract JSON from markdown code block if present
    json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', content, re.DOTALL)
    if json_match:
        content = json_match.group(1)
        print("Extracted from code block")
    else:
        # Try to find JSON object directly
        json_match = re.search(r'(\{.*\})', content, re.DOTALL)
        if json_match:
            content = json_match.group(1)
            print("Extracted JSON object")

    print("Content to parse:")
    print(content[:500])
    print("\n" + "="*50 + "\n")

    plan_data = json.loads(content)
    print("Parsed successfully!")
    print("Title:", plan_data.get('title'))
    print("Days count:", len(plan_data.get('days', [])))
except Exception as e:
    print("Error:", str(e))
    import traceback
    traceback.print_exc()