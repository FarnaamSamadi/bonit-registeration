const FA_ALPHABET = 'ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی'
const FA_NUMBER = '۰۱۲۳۴۵۶۷۸۹'
const FA_SHORT_VOWELS = 'َُِ'
const FA_OTHERS = '‌آاً'
const FA_MIXED_WITH_ARABIC = 'ًٌٍَُِّْٰٔءك‌ةۀأإيـئؤى،'

const FA_TEXT = FA_ALPHABET + FA_NUMBER + FA_SHORT_VOWELS + FA_OTHERS
const FA_COMPLEX_TEXT = FA_TEXT + FA_MIXED_WITH_ARABIC
const COMMON_TEXT = `"'-+()؟\\s.`

export const ACCEPTABLE_TO_BE_PERSIAN = new RegExp(
  // eslint-disable-next-line
  `^[${`${FA_COMPLEX_TEXT + COMMON_TEXT}1234567890`}]+$`,
)

