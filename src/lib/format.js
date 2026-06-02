// أدوات تنسيق — أرقام عربية-هندية وأسماء المواد بالترتيب

const AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function toArabicDigits(value) {
  return String(value).replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]);
}

// رقم المادة بصيغة العرض حسب اللغة (٣ للعربية، 3 للإنجليزية)
export function displayNumber(value, lang = "ar") {
  return lang === "ar" ? toArabicDigits(value) : String(value);
}

const ORDINALS = [
  "",
  "الأولى",
  "الثانية",
  "الثالثة",
  "الرابعة",
  "الخامسة",
  "السادسة",
  "السابعة",
  "الثامنة",
  "التاسعة",
  "العاشرة",
];

// «الباب الخامس» / «الفصل الثاني» … (يكفي حتى 10 للأبواب والفصول)
export function ordinalAr(n) {
  return ORDINALS[n] || toArabicDigits(n);
}
