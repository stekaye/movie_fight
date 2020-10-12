//We will call the autocomplete function with a configuration object, that will contain all the custom functions that specify how the autocomplete should work inside of the specific application.

const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {

  //Use JS to add in HTML on page load. This will reduce coupling between two files and reduce risk of errors.

  root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input" />
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
      </div>
    </div>
  `;

  const dropdown = root.querySelector('.dropdown');
  const resultsWrapper = root.querySelector('.results');

  //Select input element on page.
  const input = root.querySelector('input');

  //onInput is the function we will pass into the debounce shield function. It takes the value produced by the input and passes it as an argument to the fetchData function.

  //Need to mark onInput as async and place await keyword before as otherwise we will just return a promise.

  const onInput = async (event) => {
    const items = await fetchData(event.target.value);
    
    //If no results, remove Dropdown and quit function...
    if(!items.length) {
      dropdown.classList.remove('is-active');
      return;
    }
    
    //Clear out existing items before we add more in!
    resultsWrapper.innerHTML = '';

    dropdown.classList.add('is-active');
    
    for (let item of items) {
      const option = document.createElement('a');
    
      option.classList.add('dropdown-item')

      option.innerHTML = renderOption(item);

      //Add event listener to each option so that when a user clicks on it, the text is updated in the search bar and the dropdown is closed.
      option.addEventListener('click', (event) => {
        dropdown.classList.remove('is-active')
        
        input.value = inputValue(item);
      
        onOptionSelect(item);
      })

      resultsWrapper.appendChild(option);
    }

  };

  //Debounce function defined in utilities.js.

  //Our event listener, which will only trigger after a delay of half a second.
  input.addEventListener('input', debounce(onInput, 500))

  //How we can allow the user to close the dropdown when clicking outside of it.

  //Add event listener to entire document. We are looking to see if what the user clicked on is contained inside our root element. If so, we want to keep the dropdown open. If not, we want to close it.

  document.addEventListener('click', event => {

  // If our root element does not contain the element that was clicked on...
    if (!root.contains(event.target)) {
      //...remove is-active class. Note that this is a native class for Bulma.
      dropdown.classList.remove('is-active')
    }
  })


}