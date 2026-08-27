// المكوّنات المشتركة للنموذج الموحد — الإصدار الفني الثاني
// الثوابت: الشعار وألوان الهوية فقط. الباقي لغة تصميم تحريرية حرة:
// غلاف داكن بشعار معكوس + شريط ذهبي، أرقام أقسام شبحية، حقول بخطوط سفلية،
// جداول بخطوط أفقية فقط، وتواقيع بأعمدة حرة.
const fs = require("fs");
const path = require("path");
const {
  Document, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, AlignmentType, VerticalAlign, ShadingType,
  Header, Footer, PageNumber, NumberFormat, HeightRule, TableLayoutType,
} = require("docx");
const { COLORS: C, FONT, MARGINS, CONTENT_W, ENTITY, DEPT, CONFIDENTIAL } = require("./brand");

const LOGO_WHITE = fs.readFileSync(path.join(__dirname, "..", "assets", "logo-white.png"));
const LOGO_GREEN = fs.readFileSync(path.join(__dirname, "..", "assets", "logo-primary.png"));
const RATIO = 1.663; // نسبة الشعار الثابتة ١ : ١٫٦٧

// ألوان مساعدة من سلّم الهوية
const MID = "3EBB77", LIGHT = "7FD3A5", SOFT = "BEE9D1";

// ── نصوص ──────────────────────────────────────────────
function T(text, o = {}) {
  return new TextRun({
    text, rightToLeft: true, font: FONT,
    size: o.size ?? 20, bold: o.bold ?? false, color: o.color ?? C.CHAR,
  });
}
function LT(text, o = {}) {
  return new TextRun({ text, font: "Arial", size: o.size ?? 18, bold: o.bold ?? false, color: o.color ?? C.SLATE });
}
function P(o = {}) {
  return new Paragraph({
    bidirectional: true,
    alignment: o.align,
    spacing: { before: o.before ?? 0, after: o.after ?? 0, line: o.line, lineRule: o.line ? "auto" : undefined },
    children: o.children ?? [],
    border: o.border,
  });
}
const spacer = (h = 160) => P({ after: h });

// ── حدود ──────────────────────────────────────────────
const b = (color, size) => ({ style: BorderStyle.SINGLE, color, size });
const NB = { style: BorderStyle.NONE, size: 0, color: "auto" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

// ── خلايا وجداول ──────────────────────────────────────
function cell(children, o = {}) {
  return new TableCell({
    children,
    width: o.w ? { size: o.w, type: WidthType.DXA } : undefined,
    columnSpan: o.span,
    shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: "auto" } : undefined,
    verticalAlign: o.va ?? VerticalAlign.CENTER,
    margins: { top: o.pv ?? 60, bottom: o.pv ?? 60, left: o.ph ?? 90, right: o.ph ?? 90 },
    borders: o.borders ?? noBorders,
  });
}
function tbl(rows, widths) {
  return new Table({
    visuallyRightToLeft: true,
    layout: TableLayoutType.FIXED,
    columnWidths: widths,
    width: { size: widths.reduce((a, x) => a + x, 0), type: WidthType.DXA },
    rows,
    borders: noBorders,
  });
}
const row = (cells, o = {}) => new TableRow({
  children: cells,
  height: o.h ? { value: o.h, rule: o.exact ? HeightRule.EXACT : HeightRule.ATLEAST } : undefined,
  tableHeader: o.headerRow ?? false,
});

// سطر تعبئة: فراغ للكتابة فوق خط أخضر متوسط
const fillLine = (o = {}) => P({
  before: o.before ?? 300,
  border: { bottom: b(o.color ?? MID, o.size ?? 6) },
});
const fieldLabel = (text) => P({ children: [T(text, { size: 16, color: C.SLATE })] });

// ── ترويسة الصفحة الأولى: غلاف داكن بالشعار المعكوس + شريط ذهبي + سطر بيانات النموذج ──
function firstHeader({ title, code, version, issueDate }) {
  const wLogo = 2350, wTitle = CONTENT_W - wLogo;
  const band = tbl([
    row([
      cell([P({ align: AlignmentType.CENTER, children: [
        new ImageRun({ type: "png", data: LOGO_WHITE, transformation: { width: 118, height: Math.round(118 / RATIO) } }),
      ] })], { w: wLogo, fill: C.FOREST, pv: 150 }),
      cell([
        P({ children: [T(DEPT, { size: 17, color: LIGHT })], after: 60 }),
        P({ children: [T(title, { size: 36, bold: true, color: C.WHITE })] }),
      ], { w: wTitle, fill: C.FOREST, pv: 150, ph: 240 }),
    ], { h: 1250 }),
    // الشريط الذهبي — لمسة التمييز (≤ ١٠٪)
    row([cell([P({ children: [new TextRun({ text: " ", size: 2 })] })], { w: CONTENT_W, span: 2, fill: C.GOLD, pv: 0, ph: 0 })],
      { h: 80, exact: true }),
  ], [wLogo, wTitle]);

  const dot = () => T("   ·   ", { size: 16, color: C.GOLD, bold: true });
  const meta = P({
    before: 140, after: 60,
    border: { bottom: b(C.CLOUD, 4) },
    children: [
      T("رقم النموذج  ", { size: 16, color: C.SLATE }),
      LT(code, { size: 17, bold: true, color: C.DEEP }),
      dot(),
      T(`الإصدار  ${version}`, { size: 16, color: C.SLATE }),
      dot(),
      T(`تاريخ الإصدار  ${issueDate}`, { size: 16, color: C.SLATE }),
      dot(),
      new TextRun({
        rightToLeft: true, font: FONT, size: 16, color: C.SLATE,
        children: ["الصفحة ", PageNumber.CURRENT, " من ", PageNumber.TOTAL_PAGES],
      }),
    ],
  });
  return new Header({ children: [band, meta] });
}

// ── ترويسة الصفحات التالية: شريط نحيف داكن ──
function nextHeader({ title, code }) {
  const w1 = Math.round(CONTENT_W * 0.62), w2 = CONTENT_W - w1;
  return new Header({
    children: [
      tbl([
        row([
          cell([P({ children: [T(title, { size: 19, bold: true, color: C.WHITE })] })], { w: w1, fill: C.FOREST, pv: 80, ph: 240 }),
          cell([P({ align: AlignmentType.LEFT, children: [
            LT(code, { size: 16, bold: true, color: LIGHT }),
          ] })], { w: w2, fill: C.FOREST, pv: 80, ph: 240 }),
        ]),
        row([cell([P({ children: [new TextRun({ text: " ", size: 2 })] })], { w: CONTENT_W, span: 2, fill: C.GOLD, pv: 0, ph: 0 })],
          { h: 60, exact: true }),
      ], [w1, w2]),
    ],
  });
}

// ── التذييل: خيط فاصل ناعم · الجهة يمين · السرية وسط · الترقيم يسار ──
function pageFooter() {
  const w = Math.round(CONTENT_W / 3);
  const fcell = (children, align) => cell([P({ align, children })], {
    w, pv: 40, ph: 0,
    borders: { top: b(C.CLOUD, 4), bottom: NB, left: NB, right: NB },
  });
  return new Footer({
    children: [
      tbl([row([
        fcell([T(`${ENTITY} — ${DEPT}`, { size: 14, color: C.GRAY })]),
        fcell([T(CONFIDENTIAL, { size: 14, color: C.GRAY })], AlignmentType.CENTER),
        fcell([new TextRun({
          rightToLeft: true, font: FONT, size: 15, color: C.GRAY,
          children: ["صفحة ", PageNumber.CURRENT, " من ", PageNumber.TOTAL_PAGES],
        })], AlignmentType.LEFT),
      ])], [w, w, CONTENT_W - 2 * w]),
    ],
  });
}

// ── عنوان قسم: رقم شبحي كبير + عنوان غامق فوق خيط ذهبي ──
function sectionBar(num, title) {
  const wNum = 950;
  return tbl([
    row([
      cell([P({ align: AlignmentType.CENTER, children: [T(num, { size: 52, bold: true, color: SOFT })] })],
        { w: wNum, pv: 20, borders: { top: NB, left: NB, right: NB, bottom: b(C.GOLD, 8) } }),
      cell([P({ children: [T(title, { size: 26, bold: true, color: C.FOREST })] })],
        { w: CONTENT_W - wNum, pv: 20, va: VerticalAlign.BOTTOM,
          borders: { top: NB, left: NB, right: NB, bottom: b(C.GOLD, 8) } }),
    ], { h: 560 }),
  ], [wNum, CONTENT_W - wNum]);
}

// ── شبكة حقول: تسمية صغيرة فوق خط تعبئة — بلا صناديق ──
function fieldGrid(rows) {
  const GAP = 340;
  const out = [];
  rows.forEach((r) => {
    if (r.length === 1) {
      out.push(row([cell([fieldLabel(r[0]), fillLine()], { w: CONTENT_W, pv: 70, ph: 20, va: VerticalAlign.TOP })]));
    } else {
      const wF = Math.round((CONTENT_W - GAP) / 2);
      out.push(row([
        cell([fieldLabel(r[0]), fillLine()], { w: wF, pv: 70, ph: 20, va: VerticalAlign.TOP }),
        cell([P({})], { w: GAP, pv: 70, ph: 0 }),
        cell([fieldLabel(r[1]), fillLine()], { w: CONTENT_W - wF - GAP, pv: 70, ph: 20, va: VerticalAlign.TOP }),
      ]));
    }
  });
  // توحيد أعمدة الجدول: ثلاثة أعمدة دائماً (الصف المفرد يمتد عليها)
  const wF = Math.round((CONTENT_W - GAP) / 2);
  const fixed = rows.map((r, i) => {
    if (r.length === 1) {
      return row([cell([fieldLabel(r[0]), fillLine()], { w: CONTENT_W, span: 3, pv: 70, ph: 20, va: VerticalAlign.TOP })]);
    }
    return out[i];
  });
  return tbl(fixed, [wF, GAP, CONTENT_W - wF - GAP]);
}

// ── جدول قوائم تحريري: ترويسة بخيط أخضر سميك، صفوف بخيوط أفقية ناعمة فقط ──
function listTable(headers, weights, nRows, o = {}) {
  const total = weights.reduce((a, x) => a + x, 0);
  const widths = weights.map((x) => Math.round((x / total) * CONTENT_W));
  widths[widths.length - 1] += CONTENT_W - widths.reduce((a, x) => a + x, 0);
  const head = row(
    headers.map((h, i) => cell(
      [P({ align: AlignmentType.CENTER, children: [T(h, { size: 18, bold: true, color: C.FOREST })] })],
      { w: widths[i], pv: 70, borders: { top: NB, left: NB, right: NB, bottom: b(C.GREEN, 12) } })),
    { h: 400, headerRow: true }
  );
  const body = [];
  for (let r = 0; r < nRows; r++) {
    const strong = o.strongRows && o.strongRows.includes(r);
    body.push(row(
      widths.map((w, i) => {
        const preset = o.rowsText && o.rowsText[r] && o.rowsText[r][i] != null ? o.rowsText[r][i] : null;
        return cell([P({
          align: o.alignRows ?? AlignmentType.CENTER,
          children: preset != null ? [T(preset, { size: 18, bold: strong, color: strong ? C.FOREST : C.DEEP })] : [],
        })], {
          w, fill: strong ? C.MIST : undefined,
          borders: { top: NB, left: NB, right: NB, bottom: b(strong ? C.GREEN : C.CLOUD, strong ? 8 : 4) },
        });
      }),
      { h: o.rowH ?? 480 }
    ));
  }
  return tbl([head, ...body], widths);
}

// ── صف خيارات: تسمية صغيرة + مربعات اختيار خضراء ──
function checkRow(label, options) {
  const opts = [];
  options.forEach((op, i) => {
    if (i) opts.push(T("        ", { size: 20 }));
    opts.push(new TextRun({ text: "☐ ", font: "Segoe UI Symbol", size: 22, color: C.GREEN }));
    opts.push(T(op, { size: 19 }));
  });
  return tbl([
    row([cell([fieldLabel(label), P({ before: 120, children: opts })],
      { w: CONTENT_W, pv: 70, ph: 20, va: VerticalAlign.TOP,
        borders: { top: NB, left: NB, right: NB, bottom: b(C.CLOUD, 4) } })]),
  ], [CONTENT_W]);
}

// ── صندوق إقرار/تنويه: خلفية همسية وشريط ذهبي جانبي ──
function noteBox(title, lines) {
  const paras = [];
  if (title) paras.push(P({ children: [T(title, { size: 20, bold: true, color: C.FOREST })], after: 90 }));
  lines.forEach((ln) => paras.push(P({ children: [T(ln, { size: 18, color: C.CHAR })], after: 60, line: 310 })));
  return tbl([
    row([cell(paras, {
      w: CONTENT_W, fill: C.WHISPER, pv: 160, ph: 240, va: VerticalAlign.TOP,
      borders: { top: NB, bottom: NB, left: NB, right: { style: BorderStyle.SINGLE, color: C.GOLD, size: 28 } },
    })]),
  ], [CONTENT_W]);
}

// ── مساحة كتابة حرة: أسطر مُسطّرة للكتابة اليدوية ──
function writeBox(hint, hTwips = 1400) {
  const lines = Math.max(2, Math.round(hTwips / 480));
  const paras = [];
  if (hint) paras.push(P({ children: [T(hint, { size: 15, color: C.GRAY })], after: 40 }));
  for (let i = 0; i < lines; i++) paras.push(fillLine({ before: 340, color: C.BORDER, size: 6 }));
  return tbl([row([cell(paras, { w: CONTENT_W, pv: 40, ph: 20, va: VerticalAlign.TOP })])], [CONTENT_W]);
}

// ── كتلة الاعتمادات: أعمدة حرة — وسم أخضر، مسمى، ثم خطوط الاسم والتوقيع والتاريخ ──
function approvalBlock(roles) {
  const n = roles.length;
  const GAP = 300;
  const wCol = Math.round((CONTENT_W - GAP * (n - 1)) / n);
  const cells = [];
  const widths = [];
  roles.forEach(([stage, roleTitle], i) => {
    if (i) { cells.push(cell([P({})], { w: GAP, ph: 0 })); widths.push(GAP); }
    cells.push(cell([
      P({ align: AlignmentType.CENTER, children: [T(stage, { size: 18, bold: true, color: C.DEEP })], after: 30 }),
      P({ align: AlignmentType.CENTER, children: [T(roleTitle || " ", { size: 14, color: C.GRAY })], after: 60 }),
      fieldLabel("الاسم"), fillLine({ before: 260 }),
      fieldLabel("التوقيع"), fillLine({ before: 300 }),
      fieldLabel("التاريخ"), fillLine({ before: 260 }),
    ], {
      w: wCol, pv: 90, ph: 110, va: VerticalAlign.TOP,
      borders: { top: b(C.GREEN, 12), bottom: NB, left: NB, right: NB },
      fill: C.WHISPER,
    }));
    widths.push(wCol);
  });
  widths[widths.length - 1] += CONTENT_W - widths.reduce((a, x) => a + x, 0);
  return tbl([row(cells)], widths);
}

// ── تجميع مستند كامل ──
function buildDoc({ title, code, version = "١٫٠", issueDate = "      /      /      ", children }) {
  return new Document({
    creator: ENTITY,
    title,
    description: `${title} — ${ENTITY} · ${DEPT}`,
    styles: { default: { document: { run: { font: FONT, size: 20, color: C.CHAR } } } },
    sections: [{
      properties: {
        titlePage: true,
        page: { margin: MARGINS, pageNumbers: { formatType: NumberFormat.HINDI_NUMBERS } },
      },
      headers: {
        first: firstHeader({ title, code, version, issueDate }),
        default: nextHeader({ title, code }),
      },
      footers: { default: pageFooter() },
      children,
    }],
  });
}

module.exports = {
  T, LT, P, spacer, cell, tbl, row, b, NB, noBorders,
  sectionBar, fieldGrid, listTable, checkRow, noteBox, writeBox, approvalBlock, buildDoc,
  AlignmentType, VerticalAlign, C, CONTENT_W, LOGO_GREEN,
};
