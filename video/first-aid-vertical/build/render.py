from playwright.sync_api import sync_playwright
import pathlib, time, shutil, sys

FR = pathlib.Path('frames')
if FR.exists(): shutil.rmtree(FR)
FR.mkdir()

with sync_playwright() as p:
    b = p.chromium.launch(
        executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
        args=["--no-sandbox","--disable-lcd-text","--font-render-hinting=none",
              "--force-color-profile=srgb","--disable-gpu-vsync","--hide-scrollbars"])
    pg = b.new_page(viewport={"width":1080,"height":1920}, device_scale_factor=1)
    pg.goto("file://"+str(pathlib.Path('video.html').resolve()))
    pg.wait_for_function("document.fonts.status==='loaded'", timeout=90000)
    pg.wait_for_timeout(1200)
    meta = pg.evaluate("window.__meta")
    fps, total = meta['fps'], meta['total']
    n = int(round(total*fps))
    print(f"rendering {n} frames @ {fps}fps ({total}s)", flush=True)
    t0 = time.time()
    for i in range(n):
        pg.evaluate("window.__render(%.6f)" % (i/fps))
        pg.screenshot(path=str(FR/f"f{i:05d}.jpg"), type="jpeg", quality=96)
        if i % 150 == 0 and i:
            el = time.time()-t0
            print(f"  {i}/{n}  {el:.0f}s elapsed, eta {el/i*(n-i):.0f}s", flush=True)
    b.close()
print("frames done in %.0fs" % (time.time()-t0), flush=True)
