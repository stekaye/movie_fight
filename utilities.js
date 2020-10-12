//Debounce function here acts as a shield that only actions the function called ined in after a specified period of inactivity. Here we have set the default to 1s, but below we go with half a second. To create the delay, we...

//1. Declare a timeoutID.

//2. Return an anonymous function. This function checks if there is an existing timeoutId. On the first occasion this will be false and so it will move on and set an ID which is equivalent to the result of the function passed in. This function will be set to return after the set delay time.

//3. If the user calls the function again (in this case by pressing a key), this time there will be a timeoutId and so the timer will be cleared and the process will start again.

const debounce = (func, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args)
    }, delay)
  }
}