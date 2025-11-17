import { useState, useEffect } from 'react';
import { clsx } from "clsx"
import Confetti from 'react-confetti'

import Header from './components/Header'
import Status from './components/Status'
import LanguageList from './components/LanguagesList'
import Chars from './components/Chars'
import Keyboard from './components/Keyboard';

import languages from './languages'
import words from './words'

function App() {
  const [randomWord,setRandomWord] = useState(()=>getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);

  
  
  const [windowSize, setWindowSize] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    
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


  
  const wrongGuessCount = guessedLetters.filter((char) => !randomWord.includes(char)).length
  const numGuessesLeft = languages.length - 1 - wrongGuessCount

  const isGameLost = wrongGuessCount >= (languages.length -1)
  const isGameWon = randomWord.split("").every(asd => guessedLetters.includes(asd))
  const isGameOver = isGameLost || isGameWon

  const lastLetter= guessedLetters[guessedLetters.length-1]
  const isInccorectLastLetter = lastLetter && !randomWord.includes(lastLetter)
  
  let byeMsg="";

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

  // keyboard alphabet element map 
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

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
        aria-label={`letter ${char}`}
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


  return (
    <>
      {isGameWon && <Confetti recycle={false} numberOfPieces={1000} width={windowSize.width} height={windowSize.height} />}
      <div className='main-wrapper'>
        <Header />
        <Status 
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
                {randomWord.includes(lastLetter) ?
                  `Correct! The letter ${lastLetter} is in the word.` : 
                  `Sorry, the letter ${lastLetter} is not in the word.`
                }
                You have {numGuessesLeft} attempts left.
              </p>
              <p>Current word: {randomWord.split("").map(letter => 
              guessedLetters.includes(letter) ? letter + "." : "blank.")
              .join(" ")}</p>
            </section>
        {/* Combined visually-hidden aria-live region for status updates */}

        <Keyboard array = {alphabetElements} />
        {isGameOver && <button className='new-game-bttn' onClick={resetGame}>New Game</button>}
      </div>
    </>
  )
}


export default App


function getFarewellText(language) {
    const options = [
        `Farewell, ${language}`,
        `Adios, ${language}`,
        `R.I.P., ${language}`,
        `We'll miss you, ${language}`,
        `Oh no, not ${language}!`,
        `${language} bites the dust`,
        `Gone but not forgotten, ${language}`,
        `The end of ${language} as we know it`,
        `Off into the sunset, ${language}`,
        `${language}, it's been real`,
        `${language}, your watch has ended`,
        `${language} has left the building`
    ];

    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
}