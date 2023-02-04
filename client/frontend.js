//Create Event Listener to know when the document is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("Gotta Catch em All!");

  //declare and assign a variable to store the div with todo id -- see index.html
  const container = document.querySelector("#todo");

  //create a function to handle the creation of the todo list
  todo(container);

  //then loop through them
  //!READ FUNCTIONALITY

  fetch("http://localhost:3000/api/getItems")
    .then((data) => data.json())
    .then((data) => {
      console.log("loaded data", data);

      data.forEach((task) => {
        add(task.name, task.status, task._id);
      });
    })
    .catch((err) => {
      console.log("this is err", err);
      alert("being redirected to login page because of an error");
      // window.location.replace("http://localhost:3000/");
    });
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
  //set attribute so you can query for it later in add function
  itemList.setAttribute("id", "itemList");

  //append the number of items done
  container.appendChild(done);

  //!within the div container append the item list container because appending it to the form when selecting enter in the input fields, that will cause the delete click event listener to trigger

  //https://stackoverflow.com/questions/67893233/why-does-hitting-enter-in-a-textbox-trigger-a-click-event-in-another-button
  container.appendChild(itemList);

  //append to the todo container the form
  container.appendChild(form);

  const logoutButton = document.createElement("button");
  logoutButton.innerText = "Logout";
  container.appendChild(document.createElement("br"));
  container.appendChild(logoutButton);

  //input value
  form.appendChild(input);

  //button to add new items
  form.appendChild(button);

  //!Add event listner to be on the form to be when you a person submits, they submit a form to the backend
  form.addEventListener("submit", (e) => {
    //to prevent the form from auto submitting
    e.preventDefault();

    //!CREATE FUNCTIONALITY. After adding submitting a form, we are going to add a value to the backend
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        taskName: input.value,
      }),
    };

    fetch("http://localhost:3000/api/add", options)
      .then((data) => data.json())
      .then((data) => {
        console.log("added following task to the database", data);

        //! Add function being invoked. This is when the form is submitted. Going to create an item and add it to the DOM
        //pass in the name, status and id of newly added task

        add(
          data[data.length - 1].name,
          data[data.length - 1].status,
          data[data.length - 1]._id
        );
      })
      .catch((err) => {
        console.log("this is err", err);
        alert("being redirected to login page because of an error");
        window.location.replace("http://localhost:3000/");
      });

    //add(input.value);
    //reset the form after we are done
    //form.reset();
    input.value = "";
  });
}

/**
 *
 * !ADD FUNCTION - to actually put a new task to the screen
 */
function add(input, status, taskId) {
  console.log(input);
  //create an li element to be a "todo" item
  const item = document.createElement("li");

  //create an input element to be used when we need to update a task
  const itemInput = document.createElement("input");

  //set the value of the input field to be the value of the item added
  itemInput.setAttribute("value", input);
  itemInput.setAttribute("id", taskId);

  //create checkbox to append to item as well
  const itemCheckbox = document.createElement("input");
  itemCheckbox.setAttribute("type", "checkbox");
  itemCheckbox.checked = status ? true : false;

  //add class to checkbox
  itemCheckbox.classList.add("checkbox-todo");

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("id", "btn-delete");
  deleteButton.innerText = "Delete";

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
  
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskName: itemInput.value,
        taskStatus: e.target.checked,
      }),
    };

    fetch("http://localhost:3000/api/update", options)
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        //append the most recent item to bottom of the form items
      });
  });

  deleteButton.addEventListener("click", (e) => {
    console.log("you just hit the button");
   
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskName: itemInput.value,
      }),
    };

    fetch("http://localhost:3000/api/delete", options)
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        
        item.remove();
      });

   
  });

  //! UPDATE FUNCTIONALITY - change the name of the item
  itemInput.addEventListener("change", (e) => {
    console.log("changing the item");
    //condition to look for enter key
    if ((e.key = "Enter")) {
      console.log("you edited the input value");
    
      console.log(itemInput.id);

      const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameUpdate: itemInput.value,
          taskId: itemInput.id,
        }),
      };

      fetch("http://localhost:3000/api/updateName", options)
        .then((data) => data.json())
        .then((data) => {
          console.log(data);
          //append the most recent item to bottom of the form items
        });
    }
  });

  //append the item to underneath the <ul> element
  //https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement

  const itemsContainer = document.getElementById("itemList");
  itemsContainer.insertAdjacentElement("afterbegin", item);

  /**
     * ALTERNATIVE METHOD TO APPEND CHILD ELEMENT
     * 
    // itemList.appendChild(item);

     */
}
