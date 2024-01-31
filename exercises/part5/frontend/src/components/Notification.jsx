import PropTypes from 'prop-types'

const Notification = (props) => {
  const { messageObject } = props

  if (!messageObject) {
    return null
  }

  if (messageObject.type === 'success'){
    return (
      <div className='success'>{messageObject.message}</div>
    )
  } else if (messageObject.type === 'error') {
    return (
      <div className='error'>{messageObject.message}</div>
    )
  }
}

Notification.propTypes = {
  messageObject: PropTypes.object
}

export default Notification