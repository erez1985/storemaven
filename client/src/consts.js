export const GAME_PHASES = {
    WAITING: 'waiting',
    SHOW_SHAPE: 'show',
    HIDE_SHAPE: 'hide',
    SHOW_ANSWER: 'show_answer'
}

export const KEYS = {
    LEFT_KEY: 'a',
    RIGHT_KEY: 'l'
}

export const ANSWER = {
    NONE: { text: '', style: {}},
    TOO_SOON: { text: 'Too soon', style: { color: 'red' }},
    TOO_LATE: { text: 'Too late', style: { color: 'red' }},
    WRONG_KEY: { text: 'Wrong key', style: { color: 'red' }},
    SUCCESS: { text: 'Success', style: { color: 'green' }}
}
