import os
from dotenv import load_dotenv
load_dotenv()
import openai

client = openai.OpenAI(
    api_key=os.getenv('OPENAI_API_KEY'),
    base_url=os.getenv('OPENAI_BASE_URL')
)

response = client.chat.completions.create(
    model=os.getenv('MODEL_NAME'),
    messages=[
        {'role': 'system', 'content': 'Be concise. Return valid JSON.'},
        {'role': 'user', 'content': 'Generate a 7-day plan for learning Python basics in 30 min/day. Return as JSON with title, description, and days array.'}
    ],
    temperature=0.5,
    max_tokens=4000
)

content = response.choices[0].message.content.strip()
print(f"Total length: {len(content)}")
print(f"\nLast 200 characters:")
print(repr(content[-200:]))
print(f"\nComplete JSON? {content.endswith('}')}")

# Save full content
with open('response.txt', 'w') as f:
    f.write(content)
print("\nFull response saved to response.txt")