import json
from faster_whisper import WhisperModel

model = WhisperModel("large-v3-turbo", device="cpu", compute_type="int8")
segments, info = model.transcribe(
    "/tmp/claude-0/-home-user-test/2be846cf-7625-597a-8eaa-58b118064faf/scratchpad/audio16k.wav",
    language="ar",
    word_timestamps=True,
    vad_filter=True,
    beam_size=5,
)

out = []
for seg in segments:
    words = [{"w": w.word, "s": round(w.start, 3), "e": round(w.end, 3)} for w in (seg.words or [])]
    out.append({"start": round(seg.start, 3), "end": round(seg.end, 3), "text": seg.text, "words": words})
    print(f"[{seg.start:7.2f} - {seg.end:7.2f}] {seg.text}")

with open("/tmp/claude-0/-home-user-test/2be846cf-7625-597a-8eaa-58b118064faf/scratchpad/words.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print("DONE")
