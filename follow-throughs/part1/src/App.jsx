import { useState } from 'react'

const Display = ({counter}) => <div>{counter}</div>

const Button = ({onClick, text}) => <button onClick={onClick}> {text}</button>

const App = () => {
  const [counter, setCounter] = useState(0)

  console.log('rendering...', counter)
  const plusOne = () => setCounter(counter + 1)
  const minusOne = () => setCounter(counter - 1)
  const setToZero = () => setCounter(0)
  return (
    <>
      <Display counter={counter}></Display>
      <Button onClick={plusOne} text='Plus'></Button>
      <Button onClick={setToZero} text='Zero'></Button>
      <Button onClick={minusOne} text='Minus'></Button>

    </>

  )
}

export default App