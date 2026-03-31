from google import genai
import os
import json
from dotenv import load_dotenv

# ✅ Load env
load_dotenv()

# ✅ FIX: initialize client globally
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# ✅ Load building data
with open("building.json") as f:
    building = json.load(f)


# 🧠 AI ANALYSIS
def analyze_crisis(text):
    prompt = f"""
You are an emergency command AI.

Tasks:
- Detect crisis type
- Determine severity
- Extract room number
- Determine floor (first digit of room)
- Assign response teams

Teams:
- security
- fire_team
- medical
- management

Rules:
- Fire → fire_team + security
- Medical → medical + security
- Accident → medical + fire_team
- Always include management

Return ONLY JSON:

{{
  "type": "",
  "severity": "",
  "location": "",
  "room": null,
  "floor": null,
  "teams": []
}}

Input: {text}
"""

    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt
        )

        raw = response.text.strip()

        print("RAW:", raw)  # debug

        # ✅ FIX: safe JSON extraction
        start = raw.find("{")
        end = raw.rfind("}") + 1
        json_str = raw[start:end]

        parsed = json.loads(json_str)

        return parsed

    except Exception as e:
        print("Gemini Error:", e)

        return {
            "type": "Emergency",
            "severity": "Moderate",
            "location": "Nearest hospital",
            "room": None,
            "floor": None,
            "teams": ["security", "management"]
        }


# 🔥 MAP TEAMS → REAL STAFF
def map_teams_to_staff(teams, floor):
    assigned = []

    # 🏢 floor-based staff
    if floor:
        for f in building["floors"]:
            if f["floor_number"] == floor:
                if "security" in teams:
                    assigned += f["staff"].get("security", [])
                if "maintenance" in teams:
                    assigned += f["staff"].get("maintenance", [])

    # 🌍 global teams
    if "fire_team" in teams:
        assigned += building["global_staff"]["fire_team"]

    if "medical" in teams:
        assigned += building["global_staff"]["medical"]

    if "management" in teams:
        assigned += building["global_staff"]["management"]

    return assigned