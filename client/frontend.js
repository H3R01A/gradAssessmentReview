//Create Event Listener to know when the document is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("Gotta Catch em All!");
  //declare and assign a variable to store the element with todo id
  const container = document.querySelector("#todo");

  //create a function to handle the creation of the todo list
  todo(container);

  //TODO: Potentially try and fetch data from backend and then pass the array of values here
    //then loop through them
  


});

//! The todo function
function todo(container) {
  //create an element to act as the header with the number of done items
  const done = document.createElement("h2");

  //add to the inner text of the header
  done.innerText = "Items Completed";

  //create an input element to take a new task
  const input = document.createElement("input");

  //create a button element to send values to backend. Also make the inner text of the button Add
  const button = document.createElement("button");
  button.innerText = "Add";

  //create a form to act as the container to send values
  const form = document.createElement("form");

  //create an itemList
  const itemList = document.createElement("ul");

  //!READ FUNCTIONALITY
  //TODO: create fetch funcionality to read values from database

  //overall strategy: fetch data, iterate through data and its values, create elements
  //? perhaps use the add function created below

  //append the number of items done
  container.appendChild(done);
  //append to the todo container the form
  container.appendChild(form);

  //within the form append the following children: item container
  form.appendChild(itemList);

  //input value
  form.appendChild(input);

  //button to add new items
  form.appendChild(button);

  //TODO: refactor add the event listener to be on the form

  form.addEventListener("submit", (e) => {
    //to prevent the form from auto submitting
    e.preventDefault();


    //! Add function being invoked. This is when the form is submitted

    add(input.value);

    //!CREATE FUNCTIONALITY. After adding submitting a form, we are going to add a value to the backend
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskName: input.value,
      }),
    };

    fetch("http://localhost:3000/add", options)
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        //append the most recent item to bottom of the form items
      });

    //reset the form after we are done
    form.reset();
  });

  /**
   *
   * !ADD FUNCTION - to actually put a new element on the screen
   */
  function add(input) {
    console.log(input);
    //create an li element to be a "todo" item
    const item = document.createElement("li");

    //create an input element to be used when we need to update a task
    const itemInput = document.createElement("input");

    //set the value of the input field to be the value of the item added
    itemInput.setAttribute("value", input);

    //create checkbox to append to item as well
    const itemCheckbox = document.createElement("input");
    itemCheckbox.setAttribute("type", "checkbox");

    //add class to checkbox
    itemCheckbox.classList.add("checkbox-todo");


    const deleteButton = document.createElement('button');


    //append to the item the input field and the checkbox

    item.appendChild(itemInput);
    item.appendChild(itemCheckbox);
    item.appendChild(deleteButton);
    item.setAttribute("id", "todoItem");

    //text-decoration: line-through;

    //! UPDATE FUNCTIONALITY - checkbox to say status is done
    itemCheckbox.addEventListener("change", (e) => {
      console.log("wohoo checkbox clicked!");

      console.log(`this is the value of the checkbox ${e.target.checked}`);
      //TODO: update below code to send value of checkmark to backend

      //TODO: fix this part
      const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskStatus: e.target.checked,
        }),
      };

      fetch("http://localhost:3000/update", options)
        .then((data) => data.json())
        .then((data) => {
          console.log(data);
          //append the most recent item to bottom of the form items
        });
    });

    //! UPDATE FUNCTIONALITY - change the name of the item
    itemInput.addEventListener("keypress", (e) => {
      //preventing from submitting the form and creating a new task
      e.preventDefault();

      //condition to look for enter key
      if ((e.key = "enter")) {
        console.log("you edited the input value");
        //TODO: update functionality to send updated value to backend

        const options = {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nameUpdate: itemInput.value,
          }),
        };

        fetch("http://localhost:3000/update", options)
          .then((data) => data.json())
          .then((data) => {
            console.log(data);
            //append the most recent item to bottom of the form items
          });
      }
    });


    deleteButton.addEventListener("click", (e) => {

      e.preventDefault();


      console.log('you are about to delete a task completely');

      //TODO: fix this part
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doneTaskName: e.target.value,
        }),
      };

      fetch("http://localhost:3000/update", options)
        .then((data) => data.json())
        .then((data) => {
          console.log(data);
          //append the most recent item to bottom of the form items
        });


    });


  
    //append the item to underneath the <ul> element
    //https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement

    itemList.insertAdjacentElement("afterbegin", item);

    /**
     * ALTERNATIVE METHOD TO APPEND CHILD ELEMENT
     * 
    // itemList.appendChild(item);

     */

    

  }
}
