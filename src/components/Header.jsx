export default function Hedaer(props)
{
    return(
        <header className="header">
            {
                props.isBulgarianOn 
                ? (<>
                    <h1>Асемблер: финал</h1>
                    <h3>Познай думата под {props.numGuessesLeft} опита, за да предпазиш света на програмирането на Асемблер!</h3>
                  </>)                
                : (<>
                    <h1>Assembly: Endgame</h1>
                    <h3>Guess the word in under {props.numGuessesLeft} attempts to keep the programming world safe from Assembly!</h3>
                  </>)
            }
        </header>
    )
}