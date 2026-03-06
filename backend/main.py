import os
import json
import re
from typing import Literal
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import openai
from fastapi.responses import JSONResponse

load_dotenv()

app = FastAPI(title="Momentum API", description="Turn curiosity into action")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GeneratePlanRequest(BaseModel):
    topic: str
    time_available: Literal["15 min", "30 min", "1 hour", "2 hours"]
    goal: Literal["Learn basics", "Build a small project", "Explore career path"]


class DayPlan(BaseModel):
    day: int
    objective: str
    task: str
    expected_result: str


class ActionPlan(BaseModel):
    title: str
    description: str
    days: list[DayPlan]


def extract_json_from_response(content: str) -> dict:
    """Extract and parse JSON from various response formats."""
    content = content.strip()

    # Try to find JSON in markdown code block
    code_block_pattern = r'```(?:json)?\s*\n?(.*?)\n?```'
    match = re.search(code_block_pattern, content, re.DOTALL)

    if match:
        json_str = match.group(1).strip()
    else:
        # No code block, try to find JSON object directly
        json_match = re.search(r'(\{[\s\S]*\})', content)
        if json_match:
            json_str = json_match.group(1)
        else:
            json_str = content

    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse JSON: {e}. Content preview: {json_str[:200]}")


def transform_to_standard_format(data: dict) -> dict:
    """Transform various response formats to our standard format."""
    days = []

    for day_data in data.get("days", []):
        day_num = day_data.get("day", len(days) + 1)

        # Handle different field names
        objective = day_data.get("objective") or day_data.get("topic", "")

        # Handle task - could be string or array
        task = day_data.get("task", "")
        if not task and "tasks" in day_data:
            if isinstance(day_data["tasks"], list):
                task = " ".join(day_data["tasks"])
            else:
                task = str(day_data["tasks"])

        # Handle expected_result - might be missing
        expected_result = day_data.get("expected_result", "")
        if not expected_result:
            expected_result = f"Complete Day {day_num} objectives"

        days.append({
            "day": day_num,
            "objective": objective,
            "task": task,
            "expected_result": expected_result
        })

    return {
        "title": data.get("title", "7 Day Action Plan"),
        "description": data.get("description", "Your personalized learning sprint"),
        "days": days
    }


@app.get("/")
async def root():
    return {"message": "Momentum API - Turn curiosity into action"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/generate-plan", response_model=ActionPlan)
async def generate_plan(request: GeneratePlanRequest):
    system_prompt = f"""You are an expert learning coach creating a 7-day action plan.

CRITICAL INSTRUCTIONS:
1. Create exactly 7 days of content
2. Each day MUST have these exact fields: "day" (number), "objective" (string), "task" (string), "expected_result" (string)
3. Tasks should be achievable in {request.time_available}
4. Goal: {request.goal}
5. Topic: {request.topic}

Return ONLY this exact JSON structure (no markdown, no explanations):
{{
    "title": "7 Day {request.topic} Sprint",
    "description": "A focused plan to {request.goal.lower()} in {request.time_available}/day",
    "days": [
        {{
            "day": 1,
            "objective": "Clear one-sentence objective",
            "task": "Specific actionable task description",
            "expected_result": "What the learner accomplishes"
        }}
    ]
}}"""

    user_prompt = f"Create a 7-day action plan for learning {request.topic} with {request.time_available} per day. Goal: {request.goal}"

    try:
        client = openai.OpenAI(
            api_key=os.getenv("OPENAI_API_KEY"),
            base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
        )

        response = client.chat.completions.create(
            model=os.getenv("MODEL_NAME", "hf:zai-org/GLM-4.7"),
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=4000
        )

        content = response.choices[0].message.content

        # Parse and transform the response
        raw_data = extract_json_from_response(content)
        plan_data = transform_to_standard_format(raw_data)

        # Validate we have 7 days
        if len(plan_data["days"]) != 7:
            # Pad or trim to exactly 7 days
            while len(plan_data["days"]) < 7:
                day_num = len(plan_data["days"]) + 1
                plan_data["days"].append({
                    "day": day_num,
                    "objective": f"Day {day_num} learning",
                    "task": f"Continue exploring {request.topic}",
                    "expected_result": f"Progress on Day {day_num}"
                })
            plan_data["days"] = plan_data["days"][:7]

        # Create DayPlan objects
        days = [DayPlan(**day) for day in plan_data["days"]]

        return ActionPlan(
            title=plan_data["title"],
            description=plan_data["description"],
            days=days
        )

    except Exception as e:
        import traceback
        print(f"Error: {e}")
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to generate plan: {str(e)}"}
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)