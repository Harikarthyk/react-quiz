import React from 'react'

function Question({ serialNumber, question }) {
    console.log('Rendering Question Component.')
    return (
        <div className='quizQuestionText'>
            {serialNumber}){'  '}
            {question} 
            = ?
        </div>
    )
}

const areEqual = (preProps, newProps) => {
    if(preProps.serialNumber !== newProps.serialNumber || preProps.question !== newProps.question){
        return false;
    }
    return true;
}

export default React.memo(Question, areEqual);
