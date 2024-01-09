const Course = ({course}) => {
  return (
    <>
      <Header course={course.name}></Header>
      <Content parts={course.parts}></Content>
      <Total parts={course.parts}></Total>
    </>
  )
}

const Header = (props) => {
  return <h1>{props.course}</h1>
}

const Content = ({parts}) => {
  return parts.map(part => <Part part={part.name} exercises={part.exercises} key={part.id}></Part>)
}

const Total = ({parts}) => {
  return <p>Number of exercises is {parts.reduce((total, part) => total + part.exercises ,0)}</p>
}

const Part = (props) => {
  return <p>{props.part} {props.exercises}</p>
}

export default Course