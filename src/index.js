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

toyForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = event.target.name.value;
  const image = event.target.image.value;

  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name: name,
      image: image,
      likes: 0,
    }),
  })
  .then(response => response.json())
  .then(newToy => {
    const card = createToyCard(newToy);
    toyCollection.appendChild(card);
    toyForm.reset();
    toyFormContainer.style.display = 'none';
    addToy = false;
  })
  .catch(error => console.error('Error adding toy:', error));
});

// Fetch existing toys on page load
fetchToys();

function fetchToys() {
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        const card = createToyCard(toy);
        toyCollection.appendChild(card);
      });
    })
    .catch(error => console.error('Error fetching toys:', error));
}

function createToyCard(toy) {
  const card = document.createElement('div');
  card.className = 'card';

  const h2 = document.createElement('h2');
  h2.textContent = toy.name;

  const img = document.createElement('img');
  img.src = toy.image;
  img.className = 'toy-avatar';

  const p = document.createElement('p');
  p.textContent = `${toy.likes} Likes`;

  const button = document.createElement('button');
  button.className = 'like-btn';
  button.setAttribute('id', toy.id);
  button.textContent = 'Like ❤️';
  button.addEventListener('click', () => {
    likeToy(toy.id);
  });

  card.appendChild(h2);
  card.appendChild(img);
  card.appendChild(p);
  card.appendChild(button);

  return card;
}

function likeToy(toyId) {
  const toy = document.getElementById(toyId);
  const likes = parseInt(toy.previousElementSibling.textContent.split(' ')[0]) + 1;
  
  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      likes: likes
    })
  })
  .then(response => response.json())
  .then(updatedToy => {
    toy.previousElementSibling.textContent = `${updatedToy.likes} Likes`;
  })
  .catch(error => console.error('Error updating likes:', error));
}
