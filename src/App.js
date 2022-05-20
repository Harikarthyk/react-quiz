import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Quiz from './components/Quiz/Quiz.js';
import { newQuiz } from './redux/actions/quiz';


const App = () => {

  const dispatch = useDispatch();
  const quiz = useSelector(state => state.quiz);

  useEffect(() => {
    // dispatch(newQuiz({
    //   title: 'Arithmetic Quiz - 1',
    //   totalQuestionLength: 10,
    //   currentActiveQuestion: 1,
    //   id: 1,
    //   status: 'NOT_STARTED'
    // }));
  }, []);

  return (
    <div className='wrapper'>
      {
        quiz.quizzes.map(item => {
          return (
            <Quiz
              key={item.title}
              totalQuestionLength={item.totalQuestionLength}
              id={item.id}
              title={item.title}
            />
          )
        })
      }
    </div>
  );
}

export default App;
