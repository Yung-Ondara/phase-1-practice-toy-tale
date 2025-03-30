let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const addToyBtn = document.getElementById("new-toy-btn");
  const toyFormContainer = document.getElementById("toy-form-container");
  let addToy = false; // Toggle state

  addToyBtn.addEventListener("click", () => {
      addToy = !addToy;
      toyFormContainer.style.display = addToy ? "block" : "none";
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const toyUrl = "http://localhost:3000/toys";
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  // Fetch and display all toys
  function fetchToys() {
      fetch(toyUrl)
          .then(response => response.json())
          .then(toys => {
              toyCollection.innerHTML = ""; // Clear previous toys
              toys.forEach(toy => renderToyCard(toy));
          })
          .catch(error => console.error("Error fetching toys:", error));
  }

  // Create and append a toy card to the DOM
  function renderToyCard(toy) {
      const toyCard = document.createElement("div");
      toyCard.className = "card";

      toyCard.innerHTML = `
          <h2>${toy.name}</h2>
          <img src="${toy.image}" class="toy-avatar" />
          <p>${toy.likes} Likes</p>
          <button class="like-btn" id="${toy.id}">Like ❤️</button>
      `;

      // Add event listener for the like button
      const likeButton = toyCard.querySelector(".like-btn");
      likeButton.addEventListener("click", () => increaseLikes(toy));

      toyCollection.appendChild(toyCard);
  }

  // Add a new toy (POST request)
  toyForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent form reload

      const newToy = {
          name: event.target.name.value,
          image: event.target.image.value,
          likes: 0
      };

      fetch(toyUrl, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
          },
          body: JSON.stringify(newToy)
      })
      .then(response => response.json())
      .then(toy => {
          renderToyCard(toy); // Add new toy to the DOM
          toyForm.reset(); // Clear form
      })
      .catch(error => console.error("Error adding toy:", error));
  });

  // Increase toy likes (PATCH request)
  function increaseLikes(toy) {
      const updatedLikes = toy.likes + 1;

      fetch(`${toyUrl}/${toy.id}`, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
          },
          body: JSON.stringify({ likes: updatedLikes })
      })
      .then(response => response.json())
      .then(updatedToy => {
          // Find the toy's <p> tag and update likes count
          const toyCard = document.getElementById(updatedToy.id).closest(".card");
          toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => console.error("Error updating likes:", error));
  }

  // Load all toys when the page loads
  fetchToys();
});
