import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateQuiz } from '../../redux/actions/quiz';
import AnswerBox from './AnswerBox';
import NextButton from './NextButton';
import Question from './Question';
import './Quiz.css';


const TIMER = 10;
const OPERATORS = ['+', '-', '*', '/'];

const randomQuestion = () => {

    const operatorIndex = Math.floor((Math.random() * 3) + 1);
    let num1 = Math.floor((Math.random() * 9) + 1);
    let num2 = Math.floor((Math.random() * 9) + 1);
    if(operatorIndex === 3){
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

const Quiz = ({ title = 'Arithmetic Quiz - 1', totalQuestionLength = 10, id }) => {
    console.log('Rendering Quiz Item');
    let questions = useRef([]);
    const [answers, setAnswers] = useState([]);
    const [countDown, setCountDown] = useState(TIMER);
    const [answer, setAnswer] = useState('');
    const [totalScore, setTotalScore] = useState(0);
    let answerRef = useRef('');
    const currQuiz = useSelector(state => state.quiz.quizzes.filter(item => item.id === id ))
    console.log(currQuiz, 'ee')
    const dispatch = useDispatch();
    // const [quizStatus, setQuizStatus] = useState('NOT_STARTED');

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
        let question = randomQuestion();
        questions.current.push(question);
        if(currQuiz[0].status === 'STARTED')
            dispatch(updateQuiz({
                title: title,
                totalQuestionLength: totalQuestionLength,
                currentActiveQuestion: answers.length,
                id: id,
                status: 'STARTED',
                answers: answers,
                questions: questions.current
            }));
    }

    const nextQuestionHandler = () => {
        let totalAnswers = answers.length;
        if (totalAnswers >= totalQuestionLength) {
            return;
        }

        setCountDown(TIMER);
        let arr = answers;
        arr.push(answerRef.current);
        answerRef.current = '';
        setAnswers([...arr]);
        dispatch(updateQuiz({
            title: title,
            totalQuestionLength: totalQuestionLength,
            currentActiveQuestion: totalAnswers + 1,
            id: id,
            status: 'STARTED',
            answers: arr,
            questions: questions.current
        }));
        if (totalAnswers + 1 >= totalQuestionLength) {
            // setQuizStatus('END');
            clearInterval(interval);
            calculateScore();
            return;
        }
        newQuestion();
        setAnswer('');
    }

    if (countDown === -1 && answers.length < totalQuestionLength) {
        nextQuestionHandler();
    }


    useEffect(() => {
        newQuestion();
        if(currQuiz[0].status === 'STARTED')
        startQuizHandler();
        return () => clearInterval(interval);
    }, [totalQuestionLength]);

    const startQuizHandler = () => {


        // setQuizStatus('STARTED');
        
        interval = setInterval(() => {
            if (answers.length < totalQuestionLength) {
                setCountDown(pre => pre - 1);
            }
        }, 1000);
        if(currQuiz[0].status !== 'STARTED')
            dispatch(updateQuiz({
                title: title,
                totalQuestionLength: totalQuestionLength,
                currentActiveQuestion: 1,
                id: id,
                status: 'STARTED'
            }));
    }


    if (currQuiz[0].status === 'END') {
        return (  
            <div className='quizWrapper'>
                <div className='quizHeaderWrapper'>
                    <div className='quizHeaderText'>
                        {title}
                    </div>
                    <div>
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

                                            {Number(answers[index])}

                                            {'  '}Correct Answer is {' '}
                                            {Number(question.correctAnswer)}
                                            
                                        </>
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    if (currQuiz[0].status === 'NOT_STARTED') {
        return (
            <div className='quizWrapper'>
                <div className='quizHeaderWrapper'>
                    <div className='quizHeaderText'>
                        {title}
                    </div>
                    <div>
                        Total Questions {totalQuestionLength}
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
                <div>
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