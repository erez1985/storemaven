import { useState, useEffect, useMemo, useCallback } from "react";

import useWindowSize from "../hooks/useWindowSize";
import Shape from '../components/shape/Shape';
import Answer from '../components/answer/Answer'
import { ANSWER, GAME_PHASES, KEYS } from '../consts';

let getStarted = false;
let timeoutRef = null; 

const getWaitingTime = () => {    
    const randomFactor = Math.random()* 3 + 1 // remove 1 sec for the hide phase, to match the assignment requirement ( 2 - 5 sec )
    return 1000 * randomFactor
}

const GamePage = ({ onAnswer }) => {
    const [phase, setPhase] = useState(null);
    const [answer, setAnswer] = useState(ANSWER.NONE);
    const [position, setPosition] = useState(null);

    const windowSize = useWindowSize();
    const windowMiddle = useMemo(() => windowSize.width / 2, [windowSize]);
    
    const getRandomScreenPosition = useCallback(() => {
        return {
            top: Math.round(Math.max(60, Math.random() * (windowSize.height - 60)) ), // TODO use consts for numers 
            left: Math.round( Math.max(60, Math.random() * (windowSize.width - 60)) ),
        }
    }, [windowSize]);

    const setShowPhase = () => {
        clearTimeout(timeoutRef)
        
        setPosition(getRandomScreenPosition())
        setPhase(GAME_PHASES.SHOW_SHAPE);
        timeoutRef = setTimeout(() => {
            setHidePhase()    
            
        }, 1000);
    }

    const setHidePhase = () => {
        clearTimeout(timeoutRef)

        setPhase(GAME_PHASES.HIDE_SHAPE);
        timeoutRef = setTimeout(() => {
            setWaitingPhase();
        }, 1000)
    }

    const setWaitingPhase = () => {
        clearTimeout(timeoutRef)

        setPhase(GAME_PHASES.WAITING);
        setAnswer(ANSWER.NONE);
        timeoutRef = setTimeout(() => {
            setShowPhase()
        }, getWaitingTime())
    }

    const setAnswerPhase = (answer) => {
        clearTimeout(timeoutRef)
        
        setPhase(GAME_PHASES.SHOW_ANSWER);
        setAnswer(answer);
        setPosition(null);
        timeoutRef = setTimeout(() => {
            setWaitingPhase();
        }, 1000)
    }

    const keyDownHandler = useCallback(({ key }) => {
        let answer;
        // assume if shape in the middle exactly, each answer is correct
        if (phase === GAME_PHASES.SHOW_ANSWER) {
            return;
        } else if(phase === GAME_PHASES.HIDE_SHAPE) {
            setAnswerPhase(ANSWER.TOO_LATE)
        } else if(phase === GAME_PHASES.WAITING) {
            setAnswerPhase(ANSWER.TOO_SOON)
        } else if((position?.left <= windowMiddle && key === KEYS.LEFT_KEY) || (position?.left >= windowMiddle && key === KEYS.RIGHT_KEY)) {
            setAnswerPhase(ANSWER.SUCCESS);   
            answer = true;
        } else {
            setAnswerPhase(ANSWER.WRONG_KEY);
            answer = false;
        }
        
        if(typeof answer !== 'undefined') {
            onAnswer(answer);
        }
     // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [position, windowMiddle, phase]);

    useEffect(() => {
        if(!getStarted) {
            console.log('game started');
            getStarted = true;
            setWaitingPhase();
            console.log(keyDownHandler);      
        }

        window.addEventListener("keydown", keyDownHandler);
        
        return () => {
            window.removeEventListener("keydown", keyDownHandler);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyDownHandler])

    return <>
        <div>
            <Shape position={position} show={phase === GAME_PHASES.SHOW_SHAPE} />
            <Answer answer={answer} />
        </div>
    </>
}

export default GamePage;