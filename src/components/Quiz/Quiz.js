import React, { useEffect, useRef, useState } from 'react';
import AnswerBox from './AnswerBox';
import NextButton from './NextButton';
import Question from './Question';
import './Quiz.css';


const TIMER = 20;

const randomQuestion = (val = 10, OPERATORS = ['+', '-', '*', '/']) => {
    let min = 0;
    let max = OPERATORS.length ;
    const operatorIndex = Math.floor(Math.random() * (max - min) + min);
    let num1 = Math.floor((Math.random() * val) + 1);
    let num2 = Math.floor((Math.random() * val) + 1);
    if(OPERATORS[operatorIndex] === '/'){
        if(num2 > num1){
            let temp = num2;
            num2 = num1;
            num1 = temp;
        }
    }
    const operator = OPERATORS[operatorIndex];
    const question = num1 + operator + num2;

    return {
        operator,
        num1,
        num2,
        correctAnswer: (Function(`return ${question}`)()).toFixed(1),
        question: question
    }
}


let interval = null;

const Quiz = ({ title , totalQuestionLength }) => {
    console.log('Rendering Quiz Item');
    let questions = useRef([]);
    let answerRef = useRef(undefined);
    let currQuestionNumberRef = useRef(1);
    
    const [answers, setAnswers] = useState([]);
    const [countDown, setCountDown] = useState(TIMER);
    const [answer, setAnswer] = useState('');
    const [totalScore, setTotalScore] = useState(0);
    const [operators, setOperators] = useState(['+', '-', '*']);
    const [maxValue, setMaxValue] = useState(10)
    const [quizStatus, setQuizStatus] = useState('NOT_STARTED');

    const calculateScore = () => {
        let temp = 0;
        for(let i = 0; i < answers.length; i++){
            if(questions.current[i].correctAnswer === (Number(answers[i])).toFixed(1)){
                temp++;
            }
        }
        setTotalScore(temp);
    }

    const changeAnswer = (value) => {
        setAnswer(value)
    }

    const newQuestion = () => {
        if(questions.current.length >= currQuestionNumberRef.current){
            return;
        }
        const question = randomQuestion(maxValue, operators);
        questions.current[currQuestionNumberRef.current - 1] = question;
    }

    const nextQuestionHandler = () => {
        
        const totalAnswers = currQuestionNumberRef.current;
        if (totalAnswers > totalQuestionLength) {
            return;
        }
        let arr = answers;
        arr[currQuestionNumberRef.current - 1] = answerRef.current;
        answerRef.current = undefined;
        setAnswers([...arr]);
        currQuestionNumberRef.current +=1 ;
        if (currQuestionNumberRef.current > totalQuestionLength) {
            setQuizStatus('END');
            clearInterval(interval);
            calculateScore();
            return;
        }
        newQuestion();
        setCountDown(TIMER);
        setAnswer('');
    }

    const restartHandler = () => {
        setQuizStatus('NOT_STARTED');
        setCountDown(TIMER);
        currQuestionNumberRef.current = 1;
        questions.current = [];
        setAnswer('');
        setAnswers([]);
    }
    
    if (countDown === -1 && answers.length < totalQuestionLength) {
        nextQuestionHandler();
    }


    useEffect(() => {
        return () => clearInterval(interval);
    }, [totalQuestionLength]);

    const startQuizHandler = () => {
        if(operators.length === 0){
            alert(`Select one Operator to Start ${title}`);
            return;
        }
        newQuestion();
        setQuizStatus('STARTED');
        interval = setInterval(function() {
            console.log(answers)
            if (questions.current.length < totalQuestionLength) {
                setCountDown(pre => pre - 1);
            }
        }, 1000);

    }

    const operatorHandler = (item) => {
        if(operators.includes(item)){
            let newOperators = operators.filter(op => op !== item);
            setOperators([...newOperators]);
        }else {
            let newOperators = [...operators];
            newOperators.push(item);
            setOperators([...newOperators]);
        }
    }

    if (quizStatus === 'END') {
        return (  
            <div className='quizWrapper'>
                <div className='quizHeaderWrapper'>
                    <div className='quizHeaderText'>
                        {title}
                    </div>
                    <div className='quizTotalQuestionText'> 
                        Total Questions {totalQuestionLength}
                    </div>
                </div>
                <div className='quizOverText'>
                    Quiz Over
                </div>
                <div className='quizScoreWrapper'>
                    <div className='quizScoreTitleText'>
                        Score
                    </div>
                    <div className='quizScoreText'>
                        {totalScore} / {totalQuestionLength}
                    </div>
                </div>
                <div>
                    {questions.current.map((question, index) =>{
                        return(
                            <div className='quizQuestion' key={index}>
                                <div 
                                    className='quizQuestionText' 
                                    style={
                                        question.correctAnswer === (Number(answers[index]).toFixed(1)) ? {
                                            color: 'green'
                                        }: {
                                            color: 'darkred'
                                        }
                                    }
                                >
                                    {index + 1}){'  '}
                                    {question.question}
                                    {' = '}
                                    {
                                        question.correctAnswer === (Number(answers[index]).toFixed(1)) ?
                                            Number(question.correctAnswer)
                                        :
                                        <>
                                            {!answers[index] ? "Invalid / Not Answered" : Number(answers[index])}
                                            <br />
                                            {'  '}Correct Answer is {'  '}
                                            {Number(question.correctAnswer)}
                                            
                                        </>
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>
                <button className='nextButton' onClick={restartHandler}>
                    Restart Quiz
                </button>
            </div>
        )
    }

    if (quizStatus === 'NOT_STARTED') {
        return (
            <div className='quizWrapper'>
                <div className='quizHeaderWrapper'>
                    <div className='quizHeaderText'>
                        {title}
                    </div>
                    <div className='quizTotalQuestionText'>
                        Total Questions {totalQuestionLength}
                    </div>
                </div>
                <div className='quizOptionWrapper'>
                    <div className='quizMaxOperandWrapper'>
                    <label>Max Operand Value</label>
                    <input 
                        min={10} 
                        
                        max={50} 
                        value={maxValue}
                        type='number' 
                        onChange={(e) => setMaxValue(e.target.value)}
                        // onChange={}
                        className='quizMaxValueInput'
                    />
                    </div>
                    <div>
                        <button 
                            onClick={()=>operatorHandler('+')}
                            className={operators.includes('+') ? 'quizOperatorButtonSelected' : 'quizOperatorButton'} 
                        >
                            +
                        </button>
                        <button 
                            onClick={()=>operatorHandler('-')}
                            className={operators.includes('-') ? 'quizOperatorButtonSelected' : 'quizOperatorButton'} 
                        >
                            -
                        </button>
                        <button 
                            onClick={()=>operatorHandler('*')}
                            className={operators.includes('*') ? 'quizOperatorButtonSelected' : 'quizOperatorButton'} 
                        >
                            *
                        </button>
                        <button 
                            onClick={()=>operatorHandler('/')}
                            className={operators.includes('/') ? 'quizOperatorButtonSelected' : 'quizOperatorButton'} 
                        >
                            /
                        </button>
                    </div>
                </div>
                <button className='nextButton' onClick={startQuizHandler}>
                    Start Quiz
                </button>
            </div>
        )
    }


    return (
        <div className='quizWrapper'>
            <div className='quizHeaderWrapper'>
                <div className='quizHeaderText'>
                    {title}
                </div>
                <div className='quizTotalQuestionText'>
                    {answers.length + 1} / {totalQuestionLength}
                </div>
                <div className='quizTimerText'>
                    Time left {countDown}
                </div>
            </div>
            <div className='quizQuestionWrapper'>
                <Question
                    serialNumber={answers.length + 1}
                    question={questions.current[answers.length]?.question}
                />
            </div>
            <div className='quizAnswerWrapper'>
                <AnswerBox
                    answer={answer}
                    changeAnswer={changeAnswer}
                    answerRef={answerRef}
                />
            </div>
            <NextButton
                nextQuestionHandler={nextQuestionHandler}
            />
        </div>
    )
}

export default Quiz;
