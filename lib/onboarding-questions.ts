// ── Onboarding Question Bank ─────────────────────────────────
// Phase 5: Soft Skills Assessment
// 20 situational questions × 5 axes (4 questions per axis)

export interface OnboardingOption {
  value: 'A' | 'B' | 'C' | 'D'
  label: string
  description?: string
}

export interface OnboardingQuestion {
  id: string
  axis: 'initiative' | 'expertise' | 'speed' | 'communication' | 'flexibility'
  text: string
  options: OnboardingOption[]
}

export type AxisType = OnboardingQuestion['axis']

// ── Type mappings ────────────────────────────────────────
export type AnswerValue = 'A' | 'B' | 'C' | 'D'

// ── Question Bank (20 total) ────────────────────────────
export const QUESTIONS: OnboardingQuestion[] = [
  // ── Initiative (4 questions) ─────────────────────────
  {
    id: 'q_init_01',
    axis: 'initiative',
    text: 'Команда застряла на техническом вопросе, никто не знает как движение дальше. Ты...',
    options: [
      { value: 'A', label: 'Жду, когда лидер примет решение' },
      { value: 'B', label: 'Осторожно предлагаю свою идею' },
      { value: 'C', label: 'Берусь помочь и предлагаю решение' },
      { value: 'D', label: 'Сразу беру инициативу и решаю проблему' },
    ],
  },
  {
    id: 'q_init_02',
    axis: 'initiative',
    text: 'На встречу никто не пришёл со списком задач для спринта. Ты...',
    options: [
      { value: 'A', label: 'Жду указаний от старшего' },
      { value: 'B', label: 'Предлагаю помощь в подготовке' },
      { value: 'C', label: 'Помогаю собрать и структурировать задачи' },
      { value: 'D', label: 'Беру на себя подготовку бэклога' },
    ],
  },
  {
    id: 'q_init_03',
    axis: 'initiative',
    text: 'Видишь проблему в процессе, которая замедляет работу. Ты...',
    options: [
      { value: 'A', label: 'Молчу, это не моя ответственность' },
      { value: 'B', label: 'Упоминаю об этом в чате' },
      { value: 'C', label: 'Предлагаю способ решения' },
      { value: 'D', label: 'Беру инициативу и внедряю улучшение' },
    ],
  },
  {
    id: 'q_init_04',
    axis: 'initiative',
    text: 'Проект неожиданно потерял лидера. Ты...',
    options: [
      { value: 'A', label: 'Жду назначения нового руководителя' },
      { value: 'B', label: 'Предлагаю поддержку' },
      { value: 'C', label: 'Помогаю координировать команду' },
      { value: 'D', label: 'Беру на себя координацию' },
    ],
  },

  // ── Expertise (4 questions) ──────────────────────────
  {
    id: 'q_exp_01',
    axis: 'expertise',
    text: 'Перед дедлайном обнаруживаешь серьёзный баг в чужом коде. Ты...',
    options: [
      { value: 'A', label: 'Быстро закидываю патч и переходу к своему' },
      { value: 'B', label: 'Быстро патч + кратко объясню автору' },
      { value: 'C', label: 'Починю + разберусь в корневой причине' },
      { value: 'D', label: 'Детально разберусь, рефакторю, обучу автора' },
    ],
  },
  {
    id: 'q_exp_02',
    axis: 'expertise',
    text: 'Нужна новая технология для проекта, которую ты не знаешь. Ты...',
    options: [
      { value: 'A', label: 'Слепо копирую примеры из интернета' },
      { value: 'B', label: 'Изучу базовые примеры и начну использовать' },
      { value: 'C', label: 'Изучу документацию, пойму принципы' },
      { value: 'D', label: 'Глубоко изучу, стану экспертом в команде' },
    ],
  },
  {
    id: 'q_exp_03',
    axis: 'expertise',
    text: 'Возникает код review на сложном модуле. Ты...',
    options: [
      { value: 'A', label: 'Быстро согласуюсь, не углубляясь' },
      { value: 'B', label: 'Проверю синтаксис и очевидные баги' },
      { value: 'C', label: 'Проверю логику, производительность' },
      { value: 'D', label: 'Проанализирую архитектуру, предложу улучшения' },
    ],
  },
  {
    id: 'q_exp_04',
    axis: 'expertise',
    text: 'Тебя просят стать экспертом в области, где ты новичок. Ты...',
    options: [
      { value: 'A', label: 'Откажусь, это не моё' },
      { value: 'B', label: 'Согласусь, но полагаюсь на помощь' },
      { value: 'C', label: 'Согласусь и глубоко изучу область' },
      { value: 'D', label: 'Согласусь и стану лучшим экспертом в команде' },
    ],
  },

  // ── Speed (4 questions) ──────────────────────────────
  {
    id: 'q_speed_01',
    axis: 'speed',
    text: 'Дедлайн завтра, можешь сделать черновик сейчас или идеальное решение через неделю. Ты...',
    options: [
      { value: 'A', label: 'Жди идеального решения, дедлайны не критичны' },
      { value: 'B', label: 'Сначала черновик, потом улучшу' },
      { value: 'C', label: 'Быстро найду баланс между качеством и скоростью' },
      { value: 'D', label: 'Выдам решение быстро, потом итерирую' },
    ],
  },
  {
    id: 'q_speed_02',
    axis: 'speed',
    text: 'Нужно выбрать между «сделать за 2 часа с техдолгом» и «за 2 дня идеально». Ты...',
    options: [
      { value: 'A', label: 'Выбираю идеально, даже если долго' },
      { value: 'B', label: 'Хочу идеально, но учту крайний срок' },
      { value: 'C', label: 'Баланс: быстро + без критического долга' },
      { value: 'D', label: 'Быстро, потом рефакторю по ходу' },
    ],
  },
  {
    id: 'q_speed_03',
    axis: 'speed',
    text: 'Можешь выпустить фичу за 3 дня, но нужна неделя на тесты. Ты...',
    options: [
      { value: 'A', label: 'Тесты важнее, жду неделю' },
      { value: 'B', label: 'Сначала базовые тесты, потом полные' },
      { value: 'C', label: 'Выпускаю с основным покрытием за 4 дня' },
      { value: 'D', label: 'Выпускаю сразу, тестирую в боевых условиях' },
    ],
  },
  {
    id: 'q_speed_04',
    axis: 'speed',
    text: 'Требования меняются часто, нужно быть гибким. Ты...',
    options: [
      { value: 'A', label: 'Переделываю всё идеально каждый раз' },
      { value: 'B', label: 'Стараюсь быстро адаптироваться' },
      { value: 'C', label: 'Быстро меняюсь, минимизирую переделки' },
      { value: 'D', label: 'Мгновенно переходу на новые требования' },
    ],
  },

  // ── Communication (4 questions) ──────────────────────
  {
    id: 'q_comm_01',
    axis: 'communication',
    text: 'Разногласие с коллегой по подходу к решению. Ты...',
    options: [
      { value: 'A', label: 'Молчу, может сам разберётся' },
      { value: 'B', label: 'Спокойно обсуждаю тет-а-тет' },
      { value: 'C', label: 'Проводу один-на-один обсуждение, ищу консенсус' },
      { value: 'D', label: 'Активно участвую в обсуждении, убеждаю' },
    ],
  },
  {
    id: 'q_comm_02',
    axis: 'communication',
    text: 'На встречу нужно объяснить сложную техническую идею. Ты...',
    options: [
      { value: 'A', label: 'Слушу, редко что говорю' },
      { value: 'B', label: 'Осторожно объясню свою идею' },
      { value: 'C', label: 'Ясно объясню, отвечу на вопросы' },
      { value: 'D', label: 'Энергично презентую, увлекаю аудиторию' },
    ],
  },
  {
    id: 'q_comm_03',
    axis: 'communication',
    text: 'Нужно дать критику коллеге за плохой код. Ты...',
    options: [
      { value: 'A', label: 'Не говорю ничего, неловко' },
      { value: 'B', label: 'Деликатно упоминаю о проблемах' },
      { value: 'C', label: 'Прямо объясню, предложу улучшение' },
      { value: 'D', label: 'Активно обсуждаю, требую переделки' },
    ],
  },
  {
    id: 'q_comm_04',
    axis: 'communication',
    text: 'В команде есть молчаливый разговор. Ты...',
    options: [
      { value: 'A', label: 'Слушаю со стороны' },
      { value: 'B', label: 'Осторожно включусь, если нужно' },
      { value: 'C', label: 'Активно участвую, помогаю найти компромисс' },
      { value: 'D', label: 'Модерирую разговор, веду команду' },
    ],
  },

  // ── Flexibility (4 questions) ───────────────────────
  {
    id: 'q_flex_01',
    axis: 'flexibility',
    text: 'Требования изменились на 70% за день. Ты...',
    options: [
      { value: 'A', label: 'Раздражён, это была потрачена работа' },
      { value: 'B', label: 'Принимаю, но нужно обсудить' },
      { value: 'C', label: 'Быстро адаптируюсь к новым требованиям' },
      { value: 'D', label: 'Мгновенно перестраиваюсь, вижу новые возможности' },
    ],
  },
  {
    id: 'q_flex_02',
    axis: 'flexibility',
    text: 'Нужно переключиться на другой проект экстренно. Ты...',
    options: [
      { value: 'A', label: 'Сопротивляюсь переключению' },
      { value: 'B', label: 'Согласусь, но нужна переходная фаза' },
      { value: 'C', label: 'Быстро переключусь на новый контекст' },
      { value: 'D', label: 'Мгновенно включусь, уже готов к изменениям' },
    ],
  },
  {
    id: 'q_flex_03',
    axis: 'flexibility',
    text: 'Твой план встретил критику на встречу. Ты...',
    options: [
      { value: 'A', label: 'Жду отстаиваю свой план' },
      { value: 'B', label: 'Обдумаю критику, может потом изменю' },
      { value: 'C', label: 'Слушаю, быстро меняю подход если нужно' },
      { value: 'D', label: 'Благодарю за критику, мгновенно адаптирую' },
    ],
  },
  {
    id: 'q_flex_04',
    axis: 'flexibility',
    text: 'Технический долг требует полной переделки архитектуры. Ты...',
    options: [
      { value: 'A', label: 'Не хочу переделывать, слишком много работы' },
      { value: 'B', label: 'Согласусь, но дайте время на планирование' },
      { value: 'C', label: 'Быстро спланирую и начну переделку' },
      { value: 'D', label: 'Сразу готов к переделке, вижу новые возможности' },
    ],
  },
]

export const TOTAL_QUESTIONS = 20

// ── Axis Question Mappings ──────────────────────────────
export const AXIS_QUESTIONS: Record<AxisType, string[]> = {
  initiative: ['q_init_01', 'q_init_02', 'q_init_03', 'q_init_04'],
  expertise: ['q_exp_01', 'q_exp_02', 'q_exp_03', 'q_exp_04'],
  speed: ['q_speed_01', 'q_speed_02', 'q_speed_03', 'q_speed_04'],
  communication: ['q_comm_01', 'q_comm_02', 'q_comm_03', 'q_comm_04'],
  flexibility: ['q_flex_01', 'q_flex_02', 'q_flex_03', 'q_flex_04'],
}
