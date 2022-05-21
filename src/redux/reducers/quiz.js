const initialState = {
    quizzes: [
        {
            title: 'Arithmetic Quiz - 1',
            totalQuestionLength: 20,
            currentActiveQuestion: 1,
            id: 1,
            status: 'NOT_STARTED'
        },
        {
            title: 'Arithmetic Quiz - 2',
            totalQuestionLength: 20,
            currentActiveQuestion: 1,
            id: 2,
            status: 'NOT_STARTED'
        }
    ]
};

const quiz = (state = initialState, action) => {
    switch (action.type) {
        case 'NEW_QUIZ': {
            let newState = [...state.quizzes];
            newState.push(action.payload);
            return {
                quizzes: [...newState]
            }
        }
        case 'UPDATE_QUIZ': {
            const id = action.payload.id;
            let newState = [];
            for (let i = 0; i < state.quizzes.length; i++) {
                let currQuiz = state.quizzes[i];
                if (currQuiz.id === id) {
                    currQuiz = action.payload;
                }
                newState.push(currQuiz);
            }
            return {
                quizzes: [...newState]
            }
        }
        default:
            return state;
    }
}

export default quiz;
