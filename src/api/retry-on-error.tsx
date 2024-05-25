

const retryOnError = (apiCall: () => Promise<any>, retries: number = 3, attempt: number = 1) => {
  return new Promise((resolve, reject) => {
    apiCall()
     .then(resolve)
     .catch(async (err: any) => {
        if (attempt <= retries) {
          await retryOnError(apiCall, retries - 1, 2)
           .then(resolve)
           .catch(reject)
        } else {
          reject(err)
        }
      })
  })

}