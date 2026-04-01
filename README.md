# 🚨 HospAlert AI

## Problem Statement
In large public spaces such as hotels, malls, and event venues, emergency response is often slow, uncoordinated, and dependent on manual communication. This leads to delays in evacuation, inefficient staff deployment, and increased risk to human life.

There is no unified system that can:
- Detect crises in real-time  
- Coordinate staff instantly  
- Guide users during panic situations  
- Provide multilingual, intelligent assistance  

---

## Project Description
HospAlert AI is a real-time AI-powered emergency response system that detects crises, assigns staff, and guides users through evacuation using intelligent automation.

### 🔥 How it works:
1. User inputs emergency via **text, voice, or image**
2. AI analyzes the situation using Google Gemini
3. System:
   - Detects crisis type & severity  
   - Identifies floor/location  
   - Assigns response teams & staff  
4. Live dashboard updates instantly  
5. Google Maps displays evacuation routes  
6. Panic Mode:
   - Plays siren 🔊  
   - Provides voice guidance 🎤  
   - Triggers visual alert animations 🚨  
7. Admin dashboard allows:
   - Monitoring all crises  
   - Marking issues as resolved  

---

### 💡 What makes it unique:
- 🧠 AI-driven decision system (not just detection)
- 🎤 Panic mode with real-time voice assistance
- 🗺️ Evacuation route simulation using maps
- 👨‍🚒 Automated staff allocation using building data
- 📊 Crisis lifecycle tracking (Active → Resolved)

---

## Google AI Usage

### Tools / Models Used
- Google Gemini (gemini-1.5-flash)
- Google Maps Platform
- Google Cloud APIs

### How Google AI Was Used
Google Gemini is used as the core intelligence engine of the system.

It processes user input and:
- Classifies emergency type (fire, medical, accident, etc.)
- Determines severity level
- Extracts room number and floor
- Suggests response teams

This AI output is then used by the backend to:
- Assign real staff from building data  
- Generate structured emergency response  
- Trigger evacuation and panic mode features  

---

