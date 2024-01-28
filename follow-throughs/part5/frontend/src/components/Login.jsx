import loginService from '../services/login'
import noteService from '../services/notes'
import {useState} from 'react'

export const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const {setUser} = props
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(user))
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      console.log('Logged in', user)
    } catch(exception){
      console.log(exception)
      notifyError('Wrong Credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        username: 
        <input 
          type="text" 
          value={username} 
          name="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input 
          type="password" 
          value={password} 
          name="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm 