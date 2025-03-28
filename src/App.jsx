import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [cards, setCards] = useState([]); // State to store the shuffled cards
  const [score, setScore] = useState(0); // State to track the current score
  const [bestScore, setBestScore] = useState(0); // State for the best score
  const [clickedCards, setClickedCards] = useState([]); // Track clicked cards

  useEffect(() => {
    fetchCards();
  }, []);

  // Function to fetch cards from PokéAPI
  const fetchCards = async () => {
    const getRandomIds = (num, max) => {
      const ids = new Set();
      while (ids.size < num) {
        ids.add(Math.floor(Math.random() * max) + 1); // Genera números entre 1 y `max`
      }
      return Array.from(ids);
    };
    const randomPokemonIds = getRandomIds(12, 898); // random ids (x(number of ids), max)
    const cardPromises = randomPokemonIds.map((id) =>
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((response) => response.json())
        .then((data) => ({
          id: data.id,
          name: data.name.charAt(0).toUpperCase() + data.name.slice(1).toLowerCase(),
          image: data.sprites.front_default,
        }))
    );
    const newCards = await Promise.all(cardPromises);
    setCards(shuffleArray(newCards)); // Shuffle the cards when fetched
  };

  // Function to shuffle cards
  const shuffleArray = (array) => {
    // Loop starts from the last element of the array and goes backwards.
    for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index (j) between 0 and i (inclusive)
      const j = Math.floor(Math.random() * (i + 1));
      // Swap elements at positions i and j
      swapImagePosition(array, i, j);
    }

    // Return the shuffled array
    console.log(array);
    return array;
  };

  function swapImagePosition(array, i, j) {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  // Handle card click (shuffle cards and check if the image was clicked before)
  const handleCardClick = (cardId) => {
    if (clickedCards.includes(cardId)) {
      alert('You already clicked this card! Game over.');
      // reset the game and score.
      setScore(0);
      setClickedCards([]);
      return setCards(shuffleArray([...cards]));
    }

    // Add cardId to clicked cards and shuffle the remaining cards
    setClickedCards([...clickedCards, cardId]);
    setScore(score + 1);
    //setCards(shuffleArray([...cards])); // Shuffle the cards after each click

    // Update the best score
    if (score + 1 > bestScore) {
      setBestScore(score + 1);
    }

    // Check if user won the game(only if he has clicked all cards)
    if (clickedCards.length + 1 === cards.length) {
      alert('You won the game! All cards clicked.');
      setClickedCards([]);
      fetchCards([]);
    }
  };

  return (
    <div>
      <h1>Memory Game</h1>
      <div>
        <h2>Score: {score}</h2>
        <h2>Best Score: {bestScore}</h2>
      </div>
      <div className="cards">
        {cards.map((card) => (
          <div
            key={card.id}
            className="card"
            onClick={() => handleCardClick(card.id)} // Shuffle on card click
          >
            <img src={card.image} alt={card.name} />
            <p>{card.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;