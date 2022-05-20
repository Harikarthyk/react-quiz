import React from 'react'

function NextButton({ nextQuestionHandler }) {

    console.log('Rendering Next Button');

    return (
        <button className='nextButton' onClick={nextQuestionHandler}>
            Submit & Next Question
        </button>
    )
}

const areEqual = (preProps, newProps) => {
    return true;
}

export default React.memo(NextButton, areEqual);
