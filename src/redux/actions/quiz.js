const NEW_QUIZ = 'NEW_QUIZ';
const UPDATE_QUIZ = 'UPDATE_QUIZ';

export const newQuiz = (payload) => {
    return {
        type: NEW_QUIZ,
        payload
    }
};

export const updateQuiz = (payload) => {
    return {
        type: UPDATE_QUIZ,
        payload
    }
}