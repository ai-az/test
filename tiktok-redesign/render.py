import json, subprocess, sys, time
from playwright.sync_api import sync_playwright

BASE = "/tmp/claude-0/-home-user-test/2be846cf-7625-597a-8eaa-58b118064faf/scratchpad"
FPS = 30
DUR = 88.446
FRAMES = int(DUR * FPS) + 1  # 2654

phrases = json.load(open(f"{BASE}/phrases.json"))
amps = json.load(open(f"{BASE}/amps.json"))

ff = subprocess.Popen([
    "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
    "-f", "image2pipe", "-framerate", str(FPS), "-i", "-",
    "-i", f"{BASE}/audio.m4a",
    "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p",
    "-c:a", "copy", "-shortest", "-movflags", "+faststart",
    f"{BASE}/A9ZL_final.mp4",
], stdin=subprocess.PIPE)

t0 = time.time()
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
                           args=["--no-sandbox", "--force-color-profile=srgb"])
    pg = b.new_page(viewport={"width": 1080, "height": 1920})
    pg.goto(f"file://{BASE}/page.html")
    pg.wait_for_timeout(700)
    pg.evaluate("([p,a]) => initData(p,a)", [phrases, amps])
    for n in range(FRAMES):
        pg.evaluate("t => seek(t)", n / FPS)
        shot = pg.screenshot(type="jpeg", quality=92)
        ff.stdin.write(shot)
        if n % 300 == 0:
            el = time.time() - t0
            print(f"frame {n}/{FRAMES}  {el:.0f}s  {n/max(el,0.01):.1f} fps", flush=True)
    b.close()

ff.stdin.close()
ff.wait()
print("ENCODE_DONE", ff.returncode, f"{time.time()-t0:.0f}s total", flush=True)
