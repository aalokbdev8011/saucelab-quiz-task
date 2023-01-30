import Loader from "./assets/Loader.svg";
import "./App.css";
import { useState, useEffect, useCallback } from "react";
import QuestionsAnswer from './components/QuestionsAnswers';
import axios from "axios";
import { data as staticData } from "./data";
import GameOver from "./GameOver";

const App = () => {
  const [isGameOver, setGameOver] = useState(false);
  const [loader, setLoader] = useState(true);
  const [score, setScore] = useState(0);
  const [chanceCount, setChanceCount] = useState(3);
  const [isNightMode, setNightMode] = useState(false);
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getData = useCallback(() => {
    axios
      .get('https://eok9ha49itquif.m.pipedream.net/')
      .then((response) => {
        setData((d) => [...d, ...response.data.questions.filter((elem) => !d.some((elem2) => elem2.question === elem.question))]);
        setLoader(false);
      })
      .catch(() => {
        setData(staticData);
        setLoader(false);
      });
  }, [setData]);

  useEffect(() => {
    if (currentIndex + 1 >= data.length) {
      getData();
    }
  }, [currentIndex, data, getData]);

  useEffect(() => {
    if (chanceCount === 0) {
      setGameOver(true);
    }
  }, [chanceCount]);

  const toggleNightMode = useCallback(() => {
    setNightMode((mode) => !mode);
  }, [setNightMode]);

  const incrementCurrentIndex = useCallback(() => {
    setCurrentIndex((index) => index + 1);
  }, [setCurrentIndex]);

  const incrementScore = useCallback(() => {
    setScore((score) => score + 1);
  }, [setScore]);

  const decrementChance = useCallback(() => {
    setChanceCount((chanceCount) => chanceCount - 1);
  }, [setChanceCount]);

  const onCorrectAns = useCallback(() => {
    incrementScore();
    incrementCurrentIndex();
  }, [incrementScore, incrementCurrentIndex]);

  const onWrongAns = useCallback(() => {
    decrementChance();
    incrementCurrentIndex();
  }, [decrementChance, incrementCurrentIndex]);

  const restart = useCallback(() => {
    setScore(0);
    setChanceCount(3);
    setData([]);
    setLoader(true);
    setCurrentIndex(0);
    setGameOver(false);
  }, []);

  return (
    <div className={isNightMode ? "App night" : "App"}>
      <header className="App-header">
        <div className="header-container">
          <span>Score: {score}</span>
          <span>Chances Left: {chanceCount}</span>
          <button className="bolder btn" onClick={toggleNightMode}>
            {isNightMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
        </div>
      </header>
      <main>
        <section className="quesAns">
          {loader && <img src={Loader} alt="loader" height="150" width="150" />}
          {isGameOver && <GameOver score={score} restart={restart}></GameOver>}
          {!loader && !isGameOver && data[currentIndex] && (
            <QuestionsAnswer
              question={data[currentIndex].question}
              ansSha={data[currentIndex].answerSha1}
              onCorrectAns={onCorrectAns}
              onWrongAns={onWrongAns}
            >
            </QuestionsAnswer>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
