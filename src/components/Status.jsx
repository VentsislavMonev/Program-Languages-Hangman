import { clsx } from "clsx"

export default function Status(props)
{
    
    const className = clsx({
      won: props.gameWon,
      lost: props.gameLost,
      farewell: props.byeMsg && !props.gameLost,
      status: true,
    })


    function renderGameStatus() {
        if (!props.gameOver) {
            return (
            <>
                <h4>
                    {props.byeMsg}
                </h4>
            </>)
        }

        if (props.gameWon) {
            return (
                props.isBulgarianOn
                ? (<>
                    <h4>Ти печелиш!</h4>
                    <p>Браво! 🎉</p>
                </>)
                : (<>
                    <h4>You win!</h4>
                    <p>Well done! 🎉</p>
                </>)
            )
        } else {
            return (
                props.isBulgarianOn 
                ? (<>
                    <h4>Край на играта!</h4>
                    <p>Ти загуби! По-добре започни да учиш Асемблер 😭</p>
                </>)
                : (<>
                    <h4>Game over!</h4>
                    <p>You lose! Better start learning Assembly 😭</p>
                </>)
            )
        }
    }

    return(
        <section 
            className={className}
            aria-live="polite"
            role="status"
        >

        {renderGameStatus()}

        </section>
    )
}