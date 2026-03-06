import os
from dotenv import load_dotenv
load_dotenv()

print("Environment variables:")
print(f"API_KEY: {os.getenv('OPENAI_API_KEY')[:20]}..." if os.getenv('OPENAI_API_KEY') else "NOT SET")
print(f"BASE_URL: {os.getenv('OPENAI_BASE_URL')}")
print(f"MODEL: {os.getenv('MODEL_NAME')}")
print()

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
- task: specific actionable task that fits the time available
- expected_result: what the user will accomplish

Constraints:
- Tasks must fit within the time available per day
- Encourage building or doing something, not only consuming content
- Keep instructions simple and actionable
- Make the user feel momentum and progress

Return ONLY a JSON object in this exact format with no markdown, no code blocks, no extra text:
{
    "title": "7 Day [Topic] Sprint",
    "description": "A beginner-friendly sprint to [achieve goal]",
    "days": [
        {
            "day": 1,
            "objective": "Clear objective for day 1",
            "task": "Specific task for day 1",
            "expected_result": "What will be accomplished on day 1"
        }
    ]
}"""

user_prompt = """Topic: AI agents
Time available per day: 30 min
Goal: Learn basics

Generate a practical 7-day action plan."""

try:
    print("Sending request to API...")
    response = client.chat.completions.create(
        model=os.getenv('MODEL_NAME'),
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.7,
        max_tokens=2000
    )
    print("Got response!")

    content = response.choices[0].message.content.strip()
    print(f"\nContent length: {len(content)}")
    print(f"First 200 chars: {repr(content[:200])}")

    # Try multiple strategies to extract JSON
    plan_data = None
    extraction_errors = []

    # Strategy 1: Try to parse the entire content as JSON
    try:
        plan_data = json.loads(content)
        print("Strategy 1 (direct parse): SUCCESS")
    except json.JSONDecodeError as e:
        extraction_errors.append(f"Direct parse: {e}")

    # Strategy 2: Extract JSON from markdown code block
    if plan_data is None:
        json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', content, re.DOTALL)
        if json_match:
            try:
                plan_data = json.loads(json_match.group(1))
                print("Strategy 2 (code block): SUCCESS")
            except json.JSONDecodeError as e:
                extraction_errors.append(f"Code block: {e}")

    # Strategy 3: Find the first JSON object in the content
    if plan_data is None:
        json_match = re.search(r'(\{.*\})', content, re.DOTALL)
        if json_match:
            try:
                plan_data = json.loads(json_match.group(1))
                print("Strategy 3 (regex): SUCCESS")
            except json.JSONDecodeError as e:
                extraction_errors.append(f"Regex extract: {e}")

    if plan_data is None:
        print(f"\nAll strategies failed:")
        for err in extraction_errors:
            print(f"  - {err}")
    else:
        print(f"\nTitle: {plan_data.get('title')}")
        print(f"Days: {len(plan_data.get('days', []))}")

except Exception as e:
    print(f"Error: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()