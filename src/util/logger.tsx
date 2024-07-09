

const error = async (error: string) => {
  const event = {
    name: 'Error',
    domain: 'bookmarksextension.com',
    url: 'extension',
    props: {
      Error: error,
      title: 'Error',
      user_agent: navigator.userAgent,
      time: new Date().toISOString()
    }
  };
  await fetch('https://plausible.io/api/event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  })
}

export default {
  error
}