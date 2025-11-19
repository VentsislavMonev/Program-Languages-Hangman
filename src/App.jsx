import { useState, useEffect } from 'react';
import { clsx } from "clsx"
import Confetti from 'react-confetti'

import Header from './components/Header'
import Status from './components/Status'
import LanguageList from './components/LanguagesList'
import Chars from './components/Chars'
import Keyboard from './components/Keyboard';

import languages from './languages'

import {engWords,engAlphabet, getEngFarewellText} from './words'
import {bgWords, bulgarianAlphabet, getBgFarewellText} from './dumi'

function App() {
  // STATES AND CONSTANTS

  // This 4 rows must be here because otherwise getRandomWord is calling words before its initialized 
  const [isBulgarianOn, setIsBulgarianOn] = useState(true);
  const words = isBulgarianOn ? bgWords : engWords
  const alphabet = isBulgarianOn ? bulgarianAlphabet : engAlphabet
  const getFarewellText =  isBulgarianOn ? getBgFarewellText : getEngFarewellText
  //
  

  const [randomWord,setRandomWord] = useState(()=>getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);
  
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  const wrongGuessCount = guessedLetters.filter((char) => !randomWord.includes(char)).length
  const numGuessesLeft = languages.length - 1 - wrongGuessCount

  const isGameLost = wrongGuessCount >= (languages.length -1)
  const isGameWon = randomWord.split("").every(char => guessedLetters.includes(char))
  const isGameOver = isGameLost || isGameWon

  const lastLetter= guessedLetters[guessedLetters.length-1]
  const isInccorectLastLetter = lastLetter && !randomWord.includes(lastLetter)
  
  // language elements
  const languageElements = languages.map( (lang,index) =>
    {
      const className = clsx({
        language_li: true,
        lost: index<wrongGuessCount
      })
      
      return (<li
        key={lang.name}
        style=  {{backgroundColor: lang.backgroundColor,
          color: lang.color,}}
          className={className}>
        <p>{lang.name}</p>
    </li> )
  })

  // keyboard alphabet element map 
  let byeMsg="";

  const alphabetElements = Array.from(alphabet).map ((char,index) => {
    if (!randomWord.includes(char) && guessedLetters.includes(char)) {
      byeMsg = getFarewellText(languages[wrongGuessCount-1].name)   ;  
    }
    else { byeMsg = ""}
    const className = clsx({
      guessed: randomWord.includes(char) && guessedLetters.includes(char),
      wrong:!randomWord.includes(char) && guessedLetters.includes(char),
      key: true
    })
 
    return (
      <button 
        disabled={isGameOver} 
        key={index} 
        onClick={() => addGuessedLetter(char)} 
        className={className} 
        aria-label={isBulgarianOn ? `буква ${char}` : `letter ${char}`}
        aria-disabled={guessedLetters.includes(char)}
      > 
        {char.toUpperCase()} 
      </button>
    )
  })

  // random word chars part
  const charElements = Array.from(randomWord).map( (char,index) => {
    const returnLetter = isGameLost||guessedLetters.includes(char)
    const letterClassName = clsx({
      revealed_char : isGameLost && !guessedLetters.includes(char),
      char_span:true,
    })

    return (
    <span className={letterClassName} key={index}>
      { returnLetter && char.toUpperCase()}
    </span>
  )});
  

  // This checks if the window is resized so the confetti arent bugged
    useEffect(() => {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);


  // FUNCTIONS

  function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }

  function resetGame() {
    setRandomWord(getRandomWord());
    setGuessedLetters([]);
  }

  function addGuessedLetter(letter) {
      //setGuessedLetters(oldGuessedLetters => oldGuessedLetters.includes(char) ? [...oldGuessedLetters] : [...oldGuessedLetters, char])
      setGuessedLetters(oldGuessedLetters => {
        const lettersSet = new Set(oldGuessedLetters)
        lettersSet.add(letter)
        return Array.from(lettersSet)
      })
  }

  // APP ELEMENT

  return (
    <>
      {isGameWon && <Confetti recycle={false} numberOfPieces={1000} width={windowSize.width} height={windowSize.height} />}
      <div className='main-wrapper'>
        <button 
          onClick={() => {
              setIsBulgarianOn(!isBulgarianOn)
              resetGame()}
            }
          className="language-toggle"
          aria-label={isBulgarianOn ? "Switch to English" : "Превключи на български"}
        >
          {isBulgarianOn ? "EN" : "БГ"}
        </button>
        <Header isBulgarianOn={isBulgarianOn} numGuessesLeft={numGuessesLeft} />
        <Status 
          isBulgarianOn ={isBulgarianOn}
          gameWon ={isGameWon} 
          gameLost={isGameLost} 
          gameOver={isGameOver}
          byeMsg={isInccorectLastLetter && getFarewellText(languages[wrongGuessCount-1].name)}/>
        <LanguageList list ={languageElements}/>
        <Chars array = {charElements} />


        {/* Combined visually-hidden aria-live region for status updates */}
        <section 
          className="sr-only" 
          aria-live="polite" 
          role="status"
        >
          <p>
            {
              isBulgarianOn 
              ?
                randomWord.includes(lastLetter) 
                ?`Правилно! Буквата ${lastLetter} е от думата.` 
                :`Съжалявам, но буквата ${lastLetter} не е от думата.`
              :
                randomWord.includes(lastLetter) 
                ? `Correct! The letter ${lastLetter} is in the word.` 
                : `Sorry, the letter ${lastLetter} is not in the word.`
            }
            {
              isBulgarianOn 
              ? `Остават ти ${numGuessesLeft} опита.`
              : `You have ${numGuessesLeft} attempts left.`
            }
          </p>
          <p>{isBulgarianOn ? "Сегашната дума:" : "Current word:"} {randomWord.split("").map(letter => 
          guessedLetters.includes(letter) ? letter + "." : isBulgarianOn ? "празно." : "blank.")
          .join(" ")}</p>
        </section>
        {/* Combined visually-hidden aria-live region for status updates */}

        <Keyboard array = {alphabetElements} />
        {isGameOver && 
          <button className='new-game-bttn' onClick={resetGame}>
            {isBulgarianOn ? "Нова игра" : "New Game"}
          </button>
        }
      </div>
    </>
  )
}


export default App