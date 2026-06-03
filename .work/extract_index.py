import fitz, unicodedata, re, json
doc=fitz.open("/home/user/test/.work/nizam-alamal-official.pdf")
def body(i): return "\n".join(b[4] for b in doc[i].get_text("blocks") if 105<=b[1]<=785)
full=unicodedata.normalize('NFKC',"\n".join(body(i) for i in range(3,doc.page_count))).replace('ـ','')
full=re.sub(r'[ \t]+',' ',full)

units={'الأولى':1,'الحادية':1,'الثانية':2,'الثالثة':3,'الرابعة':4,'الخامسة':5,
 'السادسة':6,'السابعة':7,'الثامنة':8,'التاسعة':9,'العاشرة':10}
tens={'العشرون':20,'العشرين':20,'الثلاثون':30,'الثلاثين':30,'الأربعون':40,'الأربعين':40,
 'الخمسون':50,'الخمسين':50,'الستون':60,'الستين':60,'السبعون':70,'السبعين':70,
 'الثمانون':80,'الثمانين':80,'التسعون':90,'التسعين':90}
chap={'الأول':1,'الثاني':2,'الثالث':3,'الرابع':4,'الخامس':5,'السادس':6,'السابع':7,
 'الثامن':8,'التاسع':9,'العاشر':10,'الحادي عشر':11,'الثاني عشر':12,'الثالث عشر':13,
 'الرابع عشر':14,'الخامس عشر':15,'السادس عشر':16}

def decode(s):
    s=re.split(r'["“”]', s)[0].strip()        # drop amendment marker
    s=re.sub(r'\s+',' ',s)
    base=0
    if 'بعد المائتين' in s or 'بعد المائتان' in s: base=200; s=re.sub(r'بعد المائت(ين|ان)','',s).strip()
    elif 'بعد المائة' in s: base=100; s=s.replace('بعد المائة','').strip()
    elif re.search(r'الم(ائت|ئت)(ان|ين)',s): return 200
    elif re.search(r'الم(ائ|ئ)ة',s): return 100
    m=re.match(r'^(\S+)\s+عشرة$',s)
    if m and m.group(1) in units: return base+10+units[m.group(1)]
    m=re.match(r'^(\S+)\s+و(\S+)$',s)
    if m and m.group(1) in units and m.group(2) in tens: return base+tens[m.group(2)]+units[m.group(1)]
    if s in tens: return base+tens[s]
    if s in units: return base+units[s]
    return None

pat=re.compile(r'الباب ([^:\n]{1,22}):|المادة ([^:\n]{1,40}?)\s*(مكرر)?\s*(?:["“][^"”]*["”])?\s*:')
chapters={}
cur=None
order=[]
for m in re.finditer(pat, full):
    if m.group(1) is not None:
        c=chap.get(m.group(1).strip())
        if c: cur=c; chapters.setdefault(c,[])
        continue
    if cur is None: continue
    n=decode(m.group(2)); muk=bool(m.group(3))
    if n is None: 
        print("UNDECODED:",repr(m.group(2))); continue
    key=(n,muk)
    if key not in [(x['n'],x['mukarrar']) for x in chapters[cur]]:
        chapters[cur].append({'n':n,'mukarrar':muk})

total=sum(len(v) for v in chapters.values())
print("chapters:",sorted(chapters)); print("total article slots:",total)
for c in sorted(chapters):
    ns=[x['n'] for x in chapters[c]]
    mk=[x['n'] for x in chapters[c] if x['mukarrar']]
    print(f"  B{c}: {len(ns)} مادة  range {min(ns)}–{max(ns)}" + (f"  مكرر:{mk}" if mk else ""))
json.dump(chapters, open("/home/user/test/.work/article_index.json","w"), ensure_ascii=False)
print("saved")
