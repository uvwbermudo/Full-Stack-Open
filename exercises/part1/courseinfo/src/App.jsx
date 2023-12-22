const Header = (props) => {
  return (
    <>
      <h1>{props.course}</h1>
    </>
  )
}

const Content = (props) => {
  const contents = props.contents
  return (
    <>
      <Part part={contents[0].name} exercises={contents[0].exercises}></Part>
      <Part part={contents[1].name} exercises={contents[1].exercises}></Part>
      <Part part={contents[2].name} exercises={contents[2].exercises}></Part>
    </>
  )
}

const Total = (props) => {
  return (
    <>
      <p>Number of exercises is {props.total}</p>
    </>
  )
}

const Part = (props) => {
  return (
    <>
      <p>{props.part} {props.exercises}</p>
    </>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14
  const parts = [
    {name:part1, exercises:exercises1},
    {name:part2, exercises:exercises2},
    {name:part3, exercises:exercises3},
  ]
  return (
    <div>
      <Header course={course}></Header>
      <Content contents={parts}></Content>
      <Total total={exercises1 + exercises2 + exercises3}></Total>
    </div>
  )
}

export default App