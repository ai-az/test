// تطبيع النص العربي للبحث: إزالة التشكيل والتطويل، وتوحيد الهمزات والألف والتاء المربوطة،
// وتحويل الأرقام العربية-الهندية إلى لاتينية. يجعل البحث يعمل مع/بدون تشكيل وبصيغ متقاربة.

const TASHKEEL = /[ً-ْٰـ]/g; // الحركات + التطويل
const AR_DIGITS = { "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9" };

export function normalizeAr(input = "") {
  return String(input)
    .replace(TASHKEEL, "")
    .replace(/[٠-٩]/g, (d) => AR_DIGITS[d])
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ء/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}
