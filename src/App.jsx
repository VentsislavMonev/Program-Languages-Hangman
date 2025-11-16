import { useState } from 'react';
import { clsx } from "clsx"
import Header from './components/Header'
import Status from './components/Status'
import LanguageList from './components/LanguagesList'
import Chars from './components/Chars'
import Keyboard from './components/Keyboard';

import languages from './languages'

function App() {
  const [randomWord,setRandomWord] = useState("react");
  const [guessedLetters, setGuessedLetters] = useState([]);

  console.log(guessedLetters);
  console.log(randomWord)


  const wrongGuessCount = guessedLetters.filter((char) => !randomWord.includes(char)).length
  console.log(wrongGuessCount);
  

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
    
    const className = clsx({
      guessed: randomWord.includes(char) && guessedLetters.includes(char),
      wrong:!randomWord.includes(char) && guessedLetters.includes(char),
      key: true
    })

    return (
    <button key={index} onClick={() => addGuessedLetter(char)} className={className} > 
      {char.toUpperCase()} 
    </button>
    )
  })
  
  // random word chars part
  const charElements = Array.from(randomWord).map( (char,index) => (
    <span className='char-span' key={index}>
      {guessedLetters.includes(char) ? char.toUpperCase() : ''}
    </span>
  ));




  return (
    <>
      <div className='main-wrapper'>
        <Header />
        <Status />
        <LanguageList list ={languageElements}/>
        <Chars array = {charElements} />
        <Keyboard array = {alphabetElements} />
        <button className='new-game-bttn'>New Game</button>
      </div>
    </>
  )
}


export default App
