import React from 'react'

function AnswerBox({ answer, changeAnswer, answerRef }) {
    console.log('Rendering Answer Box')
    return (
        <div>
            <input
                className='quizAnswerInput'
                placeholder={'Enter the Answer'}
                value={answer}
                onChange={e => {
                    e.preventDefault();
                    changeAnswer(e.target.value);
                    answerRef.current = e.target.value;
                }}
            />
        </div>
    )
}

const areEqual = (preProps, newProps) => {
    if(preProps.answer !== newProps.answer){
        return false;
    }
    return true;
}

export default React.memo(AnswerBox, areEqual);
