import re
from pathlib import Path

root = Path(".")
text = (root / "js/course-context.js").read_text(encoding="utf-8")
ids = re.findall(r"'(week2-[^']+)':", text)
print("registry week2 ids", len(ids))
for i in ids:
    print(" ", i)

prog = (root / "js/week2-progress.js").read_text(encoding="utf-8")
cat = re.findall(r"activityId: '(week2-[^']+)'", prog)
print("catalog", len(cat))
print("missing from catalog", set(ids) - set(cat))
print("extra in catalog", set(cat) - set(ids))

folders = {
    "week2-session1-retrieval": "week-2/session1-retrieval",
    "week2-threat-vulnerability-learning": "week-2/threat-vulnerability-learning",
    "week2-malware-symptoms": "week-2/malware-symptoms",
    "week2-threat-vulnerability-sort": "week-2/threat-vulnerability-sort",
    "week2-vulnerabilities101-reflection": "week-2/vulnerabilities101",
    "week2-session2-retrieval": "week-2/session2-retrieval",
    "week2-northbank-vulnerability-analysis": "week-2/northbank-analysis",
    "week2-six-mark-response-guide": "week-2/six-mark-guide",
    "week2-ocr-question-practice": "week-2/ocr-practice",
    "week2-peer-marking-answer-improvement": "week-2/peer-marking",
    "week2-northbank-vulnerability-register": "week-2/vulnerability-register",
}
for aid, path in folders.items():
    p = root / path / "index.html"
    print(("OK" if p.exists() else "MISSING"), path)

# maximumScore per id
for aid in ids:
    m = re.search(
        rf"'{re.escape(aid)}': Object\.freeze\(\{{[\s\S]*?maximumScore: (\d+)",
        text,
    )
    print(aid, "max", m.group(1) if m else "NOT FOUND")
