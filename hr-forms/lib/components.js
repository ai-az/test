// المكوّنات المشتركة للنموذج الموحد — كل النماذج تُبنى من هذه القطع حصراً
const fs = require("fs");
const path = require("path");
const {
  Document, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, AlignmentType, VerticalAlign, ShadingType,
  Header, Footer, PageNumber, NumberFormat, HeightRule, TableLayoutType,
  VerticalMergeType,
} = require("docx");
const { COLORS: C, FONT, MARGINS, CONTENT_W, ENTITY, DEPT, CONFIDENTIAL } = require("./brand");

const LOGO = fs.readFileSync(path.join(__dirname, "..", "assets", "logo-primary.png"));
// نسبة الشعار الثابتة ١ : ١٫٦٧ — عرض الترويسة في الوورد ٣٫٥ سم حسب الدليل
const LOGO_W = 124, LOGO_H = Math.round(124 / 1.663);

// ── نصوص ──────────────────────────────────────────────
function T(text, o = {}) {
  return new TextRun({
    text,
    rightToLeft: true,
    font: FONT,
    size: o.size ?? 20,
    bold: o.bold ?? false,
    color: o.color ?? C.CHAR,
  });
}
// نص لاتيني (رموز النماذج والأكواد)
function LT(text, o = {}) {
  return new TextRun({ text, font: o.font ?? "Arial", size: o.size ?? 18, bold: o.bold ?? false, color: o.color ?? C.SLATE });
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
const EMPTY_P = () => new Paragraph({ children: [] });

// ── حدود ──────────────────────────────────────────────
const b = (color, size) => ({ style: BorderStyle.SINGLE, color, size });
const NB = { style: BorderStyle.NONE, size: 0, color: "auto" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };
const gridBorders = {
  top: b(C.BORDER, 4), bottom: b(C.BORDER, 4), left: b(C.BORDER, 4), right: b(C.BORDER, 4),
  insideHorizontal: b(C.BORDER, 4), insideVertical: b(C.BORDER, 4),
};

// ── خلايا وجداول ──────────────────────────────────────
function cell(children, o = {}) {
  return new TableCell({
    children,
    width: o.w ? { size: o.w, type: WidthType.DXA } : undefined,
    columnSpan: o.span,
    verticalMerge: o.vmerge,
    shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: "auto" } : undefined,
    verticalAlign: o.va ?? VerticalAlign.CENTER,
    margins: { top: o.pv ?? 70, bottom: o.pv ?? 70, left: o.ph ?? 110, right: o.ph ?? 110 },
    borders: o.borders,
  });
}
function tbl(rows, widths, o = {}) {
  return new Table({
    visuallyRightToLeft: true,
    layout: TableLayoutType.FIXED,
    columnWidths: widths,
    width: { size: widths.reduce((a, x) => a + x, 0), type: WidthType.DXA },
    rows,
    borders: o.borders ?? gridBorders,
  });
}
const row = (cells, o = {}) => new TableRow({
  children: cells,
  height: o.h ? { value: o.h, rule: HeightRule.ATLEAST } : undefined,
  tableHeader: o.headerRow ?? false,
});

const spacer = (h = 140) => P({ after: h });

// ── ترويسة الصفحة: شعار يمين + اسم النموذج + بطاقة بيانات النموذج، وتحتها الشريط الأخضر ──
function pageHeader({ title, code, version, issueDate }) {
  const wLogo = 2000, wMeta = 2450, wTitle = CONTENT_W - wLogo - wMeta;
  const metaCell = (label, valueRuns) =>
    cell([P({ children: [T(label + ":  ", { size: 16, color: C.SLATE, bold: true }), ...valueRuns] })],
      { w: wMeta, fill: C.WHISPER, pv: 34, ph: 90 });

  const headerTable = tbl([
    row([
      cell([P({ align: AlignmentType.CENTER, children: [
        new ImageRun({ type: "png", data: LOGO, transformation: { width: LOGO_W, height: LOGO_H } }),
      ] })], { w: wLogo, vmerge: VerticalMergeType.RESTART, fill: C.WHITE }),
      cell([
        P({ align: AlignmentType.CENTER, children: [T(ENTITY, { size: 21, bold: true, color: C.FOREST })], after: 20 }),
        P({ align: AlignmentType.CENTER, children: [T(DEPT, { size: 17, color: C.GRAY })], after: 60 }),
        P({ align: AlignmentType.CENTER, children: [T(title, { size: 26, bold: true, color: C.DEEP })] }),
      ], { w: wTitle, vmerge: VerticalMergeType.RESTART, fill: C.WHITE }),
      metaCell("رقم النموذج", [LT(code, { size: 17, bold: true, color: C.DEEP })]),
    ]),
    row([
      cell([EMPTY_P()], { w: wLogo, vmerge: VerticalMergeType.CONTINUE }),
      cell([EMPTY_P()], { w: wTitle, vmerge: VerticalMergeType.CONTINUE }),
      metaCell("رقم الإصدار", [T(version, { size: 16 })]),
    ]),
    row([
      cell([EMPTY_P()], { w: wLogo, vmerge: VerticalMergeType.CONTINUE }),
      cell([EMPTY_P()], { w: wTitle, vmerge: VerticalMergeType.CONTINUE }),
      metaCell("تاريخ الإصدار", [T(issueDate, { size: 16 })]),
    ]),
    row([
      cell([EMPTY_P()], { w: wLogo, vmerge: VerticalMergeType.CONTINUE }),
      cell([EMPTY_P()], { w: wTitle, vmerge: VerticalMergeType.CONTINUE }),
      metaCell("الصفحة", [new TextRun({
        rightToLeft: true, font: FONT, size: 16, color: C.CHAR,
        children: [PageNumber.CURRENT, " من ", PageNumber.TOTAL_PAGES],
      })]),
    ]),
  ], [wLogo, wTitle, wMeta]);

  // الشريط الأخضر بسماكة ٢ نقطة تحت الترويسة — حسب مواصفة الوورد في الدليل
  const greenBar = P({ before: 60, border: { bottom: { style: BorderStyle.SINGLE, color: C.GREEN, size: 16 } } });
  return new Header({ children: [headerTable, greenBar] });
}

// ── التذييل: الجهة يمين · سرية المستند وسط · رقم الصفحة يسار · ٩pt رمادي ──
function pageFooter() {
  const w = Math.round(CONTENT_W / 3);
  const fcell = (children, align) =>
    cell([P({ align, children })], {
      w, pv: 40, ph: 0,
      borders: { top: b(C.GREEN, 8), bottom: NB, left: NB, right: NB },
    });
  return new Footer({
    children: [
      tbl([
        row([
          fcell([T(`${ENTITY} — ${DEPT}`, { size: 15, color: C.GRAY })], undefined),
          fcell([T(CONFIDENTIAL, { size: 15, color: C.GRAY })], AlignmentType.CENTER),
          fcell([new TextRun({
            rightToLeft: true, font: FONT, size: 15, color: C.GRAY,
            children: ["صفحة ", PageNumber.CURRENT, " من ", PageNumber.TOTAL_PAGES],
          })], AlignmentType.LEFT),
        ]),
      ], [w, w, CONTENT_W - 2 * w], { borders: noBorders }),
    ],
  });
}

// ── شريط قسم: شارة رقمية داكنة بذهبي + عنوان أبيض على الأخضر الأساسي ──
function sectionBar(num, title) {
  const wNum = 700;
  return tbl([
    row([
      cell([P({ align: AlignmentType.CENTER, children: [T(num, { size: 21, bold: true, color: C.GOLD })] })],
        { w: wNum, fill: C.FOREST, pv: 60 }),
      cell([P({ children: [T(title, { size: 22, bold: true, color: C.WHITE })] })],
        { w: CONTENT_W - wNum, fill: C.GREEN, pv: 60 }),
    ], { h: 380 }),
  ], [wNum, CONTENT_W - wNum], { borders: noBorders });
}

// ── شبكة حقول: أزواج (تسمية/قيمة) — التسمية على أخضر همسي والقيمة فارغة للتعبئة ──
// rows: مصفوفة صفوف، كل صف مصفوفة تسميات (١ أو ٢ في الصف)
function fieldGrid(rows, o = {}) {
  const wL = o.labelW ?? 1750;
  const half = Math.round(CONTENT_W / 2);
  const out = rows.map((r) => {
    if (r.length === 1) {
      return row([
        cell([P({ children: [T(r[0], { size: 19, bold: true, color: C.FOREST })] })], { w: wL, fill: C.MIST }),
        cell([P({ children: r._value ? [T(r._value, { size: 19 })] : [] })], { w: CONTENT_W - wL, span: 3 }),
      ], { h: o.h ?? 440 });
    }
    return row([
      cell([P({ children: [T(r[0], { size: 19, bold: true, color: C.FOREST })] })], { w: wL, fill: C.MIST }),
      cell([P({})], { w: half - wL }),
      cell([P({ children: [T(r[1], { size: 19, bold: true, color: C.FOREST })] })], { w: wL, fill: C.MIST }),
      cell([P({})], { w: CONTENT_W - half - wL }),
    ], { h: o.h ?? 440 });
  });
  return tbl(out, [wL, half - wL, wL, CONTENT_W - half - wL]);
}

// ── جدول قوائم: ترويسة خضراء بنص أبيض + صفوف فارغة بديلة التظليل — مواصفة جداول الوورد ──
function listTable(headers, weights, nRows, o = {}) {
  const total = weights.reduce((a, x) => a + x, 0);
  const widths = weights.map((x) => Math.round((x / total) * CONTENT_W));
  widths[widths.length - 1] += CONTENT_W - widths.reduce((a, x) => a + x, 0);
  const head = row(
    headers.map((h, i) => cell(
      [P({ align: AlignmentType.CENTER, children: [T(h, { size: 19, bold: true, color: C.WHITE })] })],
      { w: widths[i], fill: C.GREEN, pv: 60 })),
    { h: 420, headerRow: true }
  );
  const body = [];
  for (let r = 0; r < nRows; r++) {
    body.push(row(
      widths.map((w, i) => {
        const preset = o.rowsText && o.rowsText[r] && o.rowsText[r][i] != null ? o.rowsText[r][i] : null;
        return cell([P({
          align: o.alignRows ?? AlignmentType.CENTER,
          children: preset != null ? [T(preset, { size: 19 })] : [],
        })], { w, fill: r % 2 === 1 ? C.WHISPER : C.WHITE });
      }),
      { h: o.rowH ?? 460 }
    ));
  }
  return tbl([head, ...body], widths);
}

// ── صف خيارات: تسمية + مربعات اختيار ──
function checkRow(label, options, o = {}) {
  const wL = o.labelW ?? 1750;
  const opts = [];
  options.forEach((op, i) => {
    if (i) opts.push(T("      ", { size: 20 }));
    opts.push(new TextRun({ text: "☐ ", font: "Segoe UI Symbol", size: 21, color: C.DEEP }));
    opts.push(T(op, { size: 19 }));
  });
  return tbl([
    row([
      cell([P({ children: [T(label, { size: 19, bold: true, color: C.FOREST })] })], { w: wL, fill: C.MIST }),
      cell([P({ children: opts })], { w: CONTENT_W - wL }),
    ], { h: 440 }),
  ], [wL, CONTENT_W - wL]);
}

// ── صندوق ملاحظات/إقرار: خلفية أخضر ضبابي + شريط جانبي أخضر — مواصفة الاقتباسات ──
function noteBox(title, lines, o = {}) {
  const paras = [];
  if (title) paras.push(P({ children: [T(title, { size: 19, bold: true, color: C.FOREST })], after: 70 }));
  lines.forEach((ln) => paras.push(P({ children: [T(ln, { size: 18, color: C.CHAR })], after: 50, line: 300 })));
  return tbl([
    row([cell(paras, {
      w: CONTENT_W, fill: C.MIST, pv: 130, ph: 180, va: VerticalAlign.TOP,
      borders: { top: NB, bottom: NB, left: NB, right: { style: BorderStyle.SINGLE, color: C.GREEN, size: 24 } },
    })]),
  ], [CONTENT_W], { borders: noBorders });
}

// ── صندوق كتابة فارغ ──
function writeBox(hint, hTwips = 1400) {
  return tbl([
    row([cell(
      hint ? [P({ children: [T(hint, { size: 16, color: C.GRAY })] })] : [EMPTY_P()],
      { w: CONTENT_W, va: VerticalAlign.TOP, pv: 90, ph: 140 }
    )], { h: hTwips }),
  ], [CONTENT_W]);
}

// ── كتلة الاعتمادات: إعداد / مراجعة / اعتماد ──
function approvalBlock(roles, o = {}) {
  const heads = ["الصفة", "الاسم", "المسمى الوظيفي", "التوقيع", "التاريخ"];
  const weights = [16, 24, 24, 20, 16];
  const total = weights.reduce((a, x) => a + x, 0);
  const widths = weights.map((x) => Math.round((x / total) * CONTENT_W));
  widths[4] += CONTENT_W - widths.reduce((a, x) => a + x, 0);
  const head = row(
    heads.map((h, i) => cell(
      [P({ align: AlignmentType.CENTER, children: [T(h, { size: 18, bold: true, color: C.WHITE })] })],
      { w: widths[i], fill: C.GREEN, pv: 50 })),
    { h: 380, headerRow: true }
  );
  const body = roles.map(([stage, roleTitle]) => row([
    cell([P({ align: AlignmentType.CENTER, children: [T(stage, { size: 18, bold: true, color: C.FOREST })] })],
      { w: widths[0], fill: C.MIST }),
    cell([P({})], { w: widths[1] }),
    cell([P({ align: AlignmentType.CENTER, children: roleTitle ? [T(roleTitle, { size: 17, color: C.SLATE })] : [] })], { w: widths[2] }),
    cell([P({})], { w: widths[3] }),
    cell([P({})], { w: widths[4] }),
  ], { h: 560 }));
  return tbl([head, ...body], widths);
}

// ── تجميع مستند كامل ──
function buildDoc({ title, code, version = "١٫٠", issueDate = "        /        /        ", children }) {
  return new Document({
    creator: ENTITY,
    title,
    description: `${title} — ${ENTITY} · ${DEPT}`,
    styles: {
      default: {
        document: { run: { font: FONT, size: 20, color: C.CHAR } },
      },
    },
    sections: [{
      properties: {
        page: {
          margin: MARGINS,
          pageNumbers: { formatType: NumberFormat.HINDI_NUMBERS },
        },
      },
      headers: { default: pageHeader({ title, code, version, issueDate }) },
      footers: { default: pageFooter() },
      children,
    }],
  });
}

module.exports = {
  T, LT, P, spacer, cell, tbl, row, b, NB, noBorders, gridBorders,
  sectionBar, fieldGrid, listTable, checkRow, noteBox, writeBox, approvalBlock, buildDoc,
  AlignmentType, VerticalAlign, HeightRule, C, CONTENT_W,
};
