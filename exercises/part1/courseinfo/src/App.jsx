const Header = (props) => {
  return (
    <>
      <h1>{props.course}</h1>
    </>
  )
}

const Content = (props) => {
  const parts = props.parts
  return (
    <>
      <Part part={parts[0].name} exercises={parts[0].exercises}></Part>
      <Part part={parts[1].name} exercises={parts[1].exercises}></Part>
      <Part part={parts[2].name} exercises={parts[2].exercises}></Part>
    </>
  )
}

const Total = (props) => {
  return (
    <>
      <p>Number of exercises is {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises }</p>
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
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  return (
    <div>
      <Header course={course.name}></Header>
      <Content parts={course.parts}></Content>
      <Total parts={course.parts}></Total>
    </div>
  )
}

export default App