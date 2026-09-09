# -*- coding: utf-8 -*-
from icons import ICONS as I

def arcs(cls, specs):
    return f'<div class="arcs {cls}">' + "".join(
        f'<i style="width:{w}px;height:{w}px;left:{x}px;top:{y}px"></i>' for w,x,y in specs) + '</div>'

# ---------------------------------------------------------------- S1
S1 = f"""
<div class="scene bg-green" id="sc1"><div class="inner">
  {arcs('dark',[(1500,340,-540),(1180,480,-380),(880,620,-230),(1900,-560,1420)])}
  <div class="wrap center" style="top:118px">
    <img class="logo" src="__LOGO_DARK__" style="width:296px;margin:0 auto" data-a="fadeDown" data-d="0.15">
    <div class="s1-dept zn" style="margin-top:26px" data-a="fadeUp" data-d="0.35">قسم التطوير المؤسسي</div>
    <div class="s1-date" data-a="fadeUp" data-d="0.48">الخميس ١٠ سبتمبر ٢٠٢٦</div>
  </div>
  <div class="wrap center" style="top:470px">
    <img class="s1-kit" src="__KIT__" id="s1kit" data-a="pop" data-d="0.55" data-t="1.1">
  </div>
  <div class="wrap center" style="top:1090px">
    <h1 class="s1-title"><span class="ln" data-a="rise" data-d="0.95">الإسـعافـات الأوليـة</span><br>
      <span class="ln" data-a="rise" data-d="1.12">في مكان العمـل</span></h1>
    <div class="gold-rule" style="width:132px;margin:44px auto 0" data-a="drawX" data-d="1.4"></div>
  </div>
  <div class="wrap" style="top:1618px">
    <div class="hair" data-a="drawX" data-d="1.6"></div>
    <div class="meta" style="margin-top:36px">
      <div data-a="fadeUp" data-d="1.72">{I['clock']}<span>زمـن القـراءة: ٤ دقائـق</span></div>
      <div data-a="fadeUp" data-d="1.84">{I['dot']}<span>المحور: السلامة والصحة المهنية</span></div>
      <div data-a="fadeUp" data-d="1.96">{I['calendar']}<span>بمناسبة اليوم العالمي للإسعافات الأولية ١٢ سبتمبر</span></div>
    </div>
  </div>
  <div class="vig"></div>
</div></div>"""

# ---------------------------------------------------------------- S2
S2 = f"""
<div class="scene bg-cream" id="sc2"><div class="inner">
  <div class="blob" style="width:900px;height:900px;right:-320px;top:-300px"></div>
  <div class="wrap" style="top:96px">
    <img class="logo" src="__LOGO_LIGHT__" style="width:214px;margin-right:auto" data-a="fadeDown" data-d="0.1">
  </div>
  <div class="wrap right" style="top:330px">
    <h1 class="s2-title"><span class="ln" data-a="rise" data-d="0.30">الدقائـق الأولى</span><br>
      <span class="ln" data-a="rise" data-d="0.44">تصنـع الفـرق</span></h1>
    <p class="s2-p" data-a="fadeUp" data-d="0.72">قد تقع الإصابة أو الحالة الطارئة في أي وقت، وفي تلك اللحظات يكون التصرف السليم أهم من التصرف السريع.</p>
    <p class="s2-p" data-a="fadeUp" data-d="0.92">فمعرفتك بما يجب فعله، وما يجب تجنبه، قد تحمي زميلك من مضاعفات الإصابة إلى حين وصول المسعف المعتمد أو فريق الطوارئ.</p>
  </div>
  <div class="wrap" style="top:1140px">
    <div class="s2-card" data-a="rise" data-d="1.20">
      {arcs('dark',[(760,-180,-250),(560,-80,-150),(380,10,-60)])}
      <div class="ic">{I['kit']}</div>
      <p style="position:relative">في هـذه النشرة أربعـة مبادئ للتصرف السليم، وأساسيـات يجدر بكـل موظف أن يعرفها اليوم لا وقت الحاجـة.</p>
      <div class="gold-rule" style="width:124px;margin-top:40px;position:relative" data-a="drawX" data-d="1.75"></div>
    </div>
  </div>
</div></div>"""

# ---------------------------------------------------------------- S3
def card(n, num, icon, title, body, delay):
    return f"""<div class="card" data-a="rise" data-d="{delay}">
      <div class="num">{num}</div>
      <div class="circ">{I[icon]}</div>
      <div class="tx"><h3>{title}</h3><p>{body}</p></div>
    </div>"""

S3 = f"""
<div class="scene bg-cream" id="sc3"><div class="inner">
  <div class="topbar" data-a="drawX" data-d="0.05"></div>
  <div class="wrap" style="top:78px;display:flex;justify-content:space-between;align-items:flex-start">
    <div class="chip" data-a="fadeDown" data-d="0.30">ماذا تفعل عند وقوع إصابة؟</div>
    <img class="logo" src="__LOGO_LIGHT__" style="width:190px" data-a="fadeDown" data-d="0.12">
  </div>
  <div class="wrap right" style="top:250px">
    <h1 class="s3-title"><span class="ln" data-a="rise" data-d="0.42">أربعة مبـادئ تحمي المصاب</span></h1>
    <div class="s3-sub" data-a="fadeUp" data-d="0.58">حتى وصول المسعف المعتمد أو فريق الطوارئ</div>
  </div>
  <div class="wrap" style="top:508px;display:flex;flex-direction:column;gap:30px">
    {card(1,'١','shield_check','حافظ على هدوئك واطلب المساعدة','تأكد أولًا من سلامة المكان، ثم أبلغ عن الحالة فورًا واطلب المسعف المعتمد أو فريق الطوارئ.',0.80)}
    {card(2,'٢','pin_plus','اعرف مواقع الإسعاف قبل أن تحتاجها','أين حقيبة الإسعافات الأولية في مبناك؟ من المسعفون المعتمدون في موقعك؟ وهل أرقام الطوارئ ومسؤول السلامة محفوظ في جوالك؟',0.98)}
    {card(3,'٣','stretcher','لا تحرّك المصاب بعد السقوط','خصوصًا عند الاشتباه بإصابة في الرأس أو الرقبة أو الظهر، ولا تنقله إلا إذا كان بقاؤه في مكانه خطرًا مباشرًا عليه.',1.16)}
    {card(4,'٤','ban','لا تقدم علاجًا لا تعرفه','لا أدوية ولا طعام ولا شراب، ولا إجراء إسعافي لا تتقن طريقته الصحيحة، اتبع تعليمات المسعف أو المختصين.',1.34)}
  </div>
</div></div>"""

# ---------------------------------------------------------------- S4
def step(num, icon, title, body, delay):
    return f"""<div class="step" data-a="slideR" data-d="{delay}">
      <div class="node">{I[icon]}<div class="badge">{num}</div></div>
      <div class="tx"><h3>{title}</h3><p>{body}</p></div>
    </div>"""

S4 = f"""
<div class="scene bg-deep" id="sc4"><div class="inner">
  {arcs('dark',[(1700,-620,1500),(1300,-420,1650),(1500,560,-620)])}
  <div class="wrap" style="top:92px">
    <img class="logo" src="__LOGO_DARK__" style="width:196px;margin-right:auto" data-a="fadeDown" data-d="0.10">
  </div>
  <div class="wrap right" style="top:280px">
    <h1 class="s4-title"><span class="ln" data-a="rise" data-d="0.30">تسلســل التصرف السليم</span><br>
      <span class="ln" data-a="rise" data-d="0.44">عند أي إصابة</span></h1>
    <div class="s4-sub" data-a="fadeUp" data-d="0.62">الدقائق الأولى بعد الإصابة مهمة، ومعرفتك بالأساسيات قد تنقذ حياة زميل</div>
  </div>
  <div class="wrap tl" style="top:625px">
    <div class="spine" style="height:742px" data-a="drawY" data-d="0.80"></div>
    <div style="display:flex;flex-direction:column;gap:52px;position:relative">
      {step('١','shield_alert','أمّن المكان','تأكد أن لا خطر عليك أو على المصاب',0.90)}
      {step('٢','bell','أبلغ','عن الحالة فورًا لمسؤولك أو الرقم الداخلي',1.06)}
      {step('٣','phone','اطلب المساعدة','المسعف المعتمد أو فريق الطوارئ',1.22)}
      {step('٤','stretcher','لا تحرّك المصاب','إلا عند وجود خطر مباشر عليه',1.38)}
      {step('٥','cross','اتبع تعليمات المختصين','حتى وصولهم وبعده',1.54)}
    </div>
  </div>
  <div class="wrap" style="top:1618px">
    <div class="remind" data-a="rise" data-d="1.78">
      <b>تذكّر</b><span></span>
      <p>دورك ليس أن تعالج، بل أن تحمي المصاب من التدهور حتى يصل من يعالج</p>
    </div>
  </div>
  <div class="vig"></div>
</div></div>"""

# ---------------------------------------------------------------- S5
def item(title, body, delay):
    return f"""<div class="item" data-a="slideR" data-d="{delay}">
      <div class="ck">{I['check']}</div>
      <div class="tx"><h3>{title}</h3><p>{body}</p></div>
    </div>"""

S5 = f"""
<div class="scene bg-cream" id="sc5"><div class="inner">
  <div class="stripes"></div>
  <div class="blob" style="width:1000px;height:1000px;left:-260px;top:-420px;background:rgba(12,134,67,.05)"></div>
  <div class="wrap" style="top:96px">
    <img class="logo" src="__LOGO_LIGHT__" style="width:200px;margin-right:auto" data-a="fadeDown" data-d="0.10">
  </div>
  <div class="wrap right" style="top:330px">
    <h1 class="s5-title"><span class="ln" data-a="rise" data-d="0.30">ثلاثـة أمور اعرفها</span><br>
      <span class="ln" data-a="rise" data-d="0.44">قبل أن تحتاجها</span></h1>
  </div>
  <div class="wrap" style="top:640px;display:flex;flex-direction:column;gap:76px">
    {item('موقع أقرب حقيبة إسعافات أولية','في مبناك أو موقع عملك، وطريق الوصول إليها.',0.72)}
    <div class="sep" data-a="drawX" data-d="0.86"></div>
    {item('أسماء المسعفين المعتمدين','من هم في مبناك أو ورديتك، وكيف تستدعيهم بسرعة',0.96)}
    <div class="sep" data-a="drawX" data-d="1.10"></div>
    {item('أرقام الطوارئ ومسؤول السلامة','احفظ في جوالك رقم الطوارئ الموحد ٩١١ والهلال الأحمر ٩٩٧، ورقم مسؤول السلامة والصحة المهنية تحويلة رقم 167.',1.20)}
  </div>
</div></div>"""

# ---------------------------------------------------------------- S6
S6 = f"""
<div class="scene bg-green" id="sc6"><div class="inner">
  {arcs('dark',[(1600,-500,-460),(1250,-320,-300),(1800,420,1420)])}
  <div class="wrap" style="top:120px">
    <img class="logo" src="__LOGO_DARK__" style="width:200px;margin-right:auto" data-a="fadeDown" data-d="0.10">
  </div>
  <div class="wrap" style="top:600px">
    <div class="trio">
      <div class="tri" data-a="pop" data-d="0.34"><div class="o">{I['search']}</div><b>اعـرف</b></div>
      <div class="conn" data-a="drawX" data-d="0.62"></div>
      <div class="tri" data-a="pop" data-d="0.48"><div class="o">{I['bell']}</div><b>أبلـغ</b></div>
      <div class="conn" data-a="drawX" data-d="0.70"></div>
      <div class="tri" data-a="pop" data-d="0.62"><div class="o">{I['shield_alert']}</div><b>ساعد بأمان</b></div>
    </div>
  </div>
  <div class="wrap" style="top:1120px">
    <div class="s6-line"><span class="ln" data-a="rise" data-d="0.95">تحقق اليوم من الأمور الثلاثة،</span><br>
      <span class="ln" data-a="rise" data-d="1.10">وشارك زميلك ما عرفته.</span></div>
    <div class="gold-rule" style="width:120px;margin:56px auto 0" data-a="drawX" data-d="1.35"></div>
  </div>
  <div class="vig"></div>
</div></div>"""

# ---------------------------------------------------------------- S7
S7 = f"""
<div class="scene bg-deep" id="sc7"><div class="inner">
  {arcs('dark',[(1700,-560,1420),(1300,-360,1560)])}
  <div class="wrap" style="top:120px">
    <img class="logo" src="__LOGO_DARK__" style="width:200px;margin-right:auto" data-a="fadeDown" data-d="0.10">
  </div>
  <div class="wrap" style="top:560px">
    <div class="s7-lead"><span class="ln" data-a="rise" data-d="0.30">كُن مستعدًا، فقد تكون معرفتك</span><br>
      <span class="ln" data-a="rise" data-d="0.44">أول خطوة نحو إنقاذ حياة.</span></div>
  </div>
  <div class="wrap" style="top:880px">
    <div class="s7-thanks" data-a="thanks" data-d="0.70">شُكرًا لكم</div>
  </div>
  <div class="wrap" style="top:1290px">
    <div class="hair" data-a="drawX" data-d="1.20"></div>
  </div>
  <div class="wrap center" style="top:1430px">
    <div class="s7-card" data-a="rise" data-d="1.35">
      <b>إدارة الموارد البشرية</b><i>التطوير المؤسسي</i>
    </div>
  </div>
  <div class="vig"></div>
</div></div>"""

SCENES = [S1,S2,S3,S4,S5,S6,S7]
