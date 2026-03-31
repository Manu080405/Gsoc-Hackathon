import re

def extract_floor(text):
    match = re.search(r'\b\d{3}\b', text)
    if match:
        room = match.group()
        return int(room[0])  # 412 → 4
    return None