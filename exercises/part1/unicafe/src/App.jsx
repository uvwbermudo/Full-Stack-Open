import { useState } from 'react'


const Button = (props) => {
  const {text, handleClick} = props

  return (
    <>
      <button onClick={handleClick}>{text}</button>
    </>
  )
}

const Statline = (props) => {
  const {value, text, type} = props
  if (type == 'percent'){
    return (
      <>
      <tr>
        <td>{text}</td>
        <td>{value}%</td>
      </tr>
      </>
    )
  }
  return (
    <>
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
    </>
  )
}

const Statistics = (props) => {
  const {statGood, statBad, statNeutral, statTotal, statAverage, statPositive} = props
  if (statTotal === 0){
    return (
      <>
        <h2>Statistics</h2>
        <div>No feedback given yet.</div>
      </>
    )
  } else {
    return (
      <>
      <h2>Statistics</h2>
      <table>
        <tbody>
          <Statline text='Good' value={statGood} type='number'></Statline>
          <Statline text='Neutral' value={statNeutral} type='number'></Statline>
          <Statline text='Bad' value={statBad} type='number'></Statline>
          <Statline text='Total' value={statTotal} type='number'></Statline>
          <Statline text='Average' value={statAverage} type='number'></Statline>
          <Statline text='Positive' value={statPositive} type='percent'></Statline>
        </tbody>
      </table>
      </>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const computeStatistics = (good, bad, neutral) => {
    let badCount = bad * -1
    let newTotal = good + bad + neutral
    let newAverage = (good + badCount)/newTotal
    let positiveRatio = good/newTotal * 100
    setPositive(positiveRatio)
    setAverage(newAverage)
  }

  const handleGood = () => {
    let newGood = good + 1
    setGood(newGood)
    setTotal(total + 1)
    computeStatistics(newGood, bad, neutral)
  }
  const handleNeutral = () => {
    let newNeutral = neutral + 1
    setNeutral(newNeutral)
    setTotal(total + 1)
    computeStatistics(good, bad, newNeutral)
  } 
  const handleBad = () => {
    let newBad = bad + 1
    setBad(newBad)
    setTotal(total + 1)
    computeStatistics(good, newBad, neutral)
  }

  return (
    <div>
      <h1>Give Feedback!</h1>
      <Button text='Good' handleClick={() => handleGood()}></Button>
      <Button text='Neutral' handleClick={() => handleNeutral()}></Button>
      <Button text='Bad' handleClick={() => handleBad()}></Button>
      <Statistics
       statGood={good} 
       statBad={bad} 
       statNeutral={neutral} 
       statAverage={average} 
       statTotal={total}
       statPositive={positive}>
      </Statistics>
    </div>
  )
}

export default App