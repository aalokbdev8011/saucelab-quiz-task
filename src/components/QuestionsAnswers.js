import { useCallback, useRef, useState } from "react";
import sha1 from "js-sha1";
import "./styles.css";

function QuestionsAnswers(props) {
  const inpRef = useRef("");
  const [error, setErr] = useState("hide");
  const verifyAns = useCallback(() => {
    const inputAns = inpRef.current.value;
    if (inputAns.length === 0) {
      setErr("show");
      return null;
    } else {
      setErr("hide");
      return sha1(inputAns.toLowerCase()).localeCompare(props.ansSha) === 0;
    }
  }, [props]);

  const onSubmit = useCallback(() => {
    const isCorrectAnsValue = verifyAns();
    if (isCorrectAnsValue === null) {
      return;
    }
    if (isCorrectAnsValue === true) {
      props.onCorrectAns();
    } else {
      props.onWrongAns();
    }
    inpRef.current.value = "";
  }, [verifyAns, props]);
  return (
    <>
      <div className="ques">{props.question}</div>
      <div className="formContainer">
        <input
          className="input"
          ref={inpRef}
          placeholder="Please add your answer"
        ></input>
        <span className={`err ${error}`}>Please Enter The Answer</span>
        <button className="submit" onClick={onSubmit}>
          Submit
        </button>
      </div>
    </>
  );
}
export default QuestionsAnswers;
