import { useState } from 'react';
import Header from './components/Header'
import Status from './components/Status'
import LanguageList from './components/LanguagesList'
import Chars from './components/Chars'
import Keyboard from './components/Keyboard';

import languages from './languages'

/**
 * Goal: Build out the main parts of our app
 * 
 * Challenge: 
 * Display the keyboard ⌨️. Use <button>s for each letter
 * since it'll need to be clickable and tab-accessible.
 */


function App() {
  const[randomWord,setRandomWord] = useState("react");
  const alphabet = "abcdefghijklmnopqrstuvwxyz"
  const alphabetElements = Array.from(alphabet.toUpperCase()).map (char => (
    <li className='key'>
      <button className='key-button'> {char}</button>
    </li>
  ))

  console.log(alphabetElements);
  

  const charElements = Array.from(randomWord.toUpperCase()).map( (char) => (
    // key={}
    <span className='char-span' >
      {char}
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

const languageElements = languages.map( (lang) =>
(
  <li
      className='language-li'
      key={lang.name}
      style=  {{backgroundColor: lang.backgroundColor,
              color: lang.color,}}>
      <p>{lang.name}</p>
  </li>
))
  


export default App
