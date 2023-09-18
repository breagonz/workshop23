const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');
// *** DONE**        Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2302-acc-pt-web-pt-e';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;
/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${APIURL}/players`);
        if (!response.ok) {
            throw new Error('Unable to fetch players.');
        }
        const result = await response.json();
        return result.data.players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};
const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/players/${playerId}`);
        if (!response.ok) {
            throw new Error(`Unable to fetch player #${playerId}.`);
        }
        const result = await response.json();
        return result.data.player;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};
const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(`${APIURL}/players`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerObj),
        });
        if (!response.ok) {
            throw new Error('Unable to add player.');
        }
        const result = await response.json();
        return result.data.player;
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};
const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/players/${playerId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Unable to remove player #${playerId} from the roster.`);
        }
        const result = await response.json();
        return result.data.player;
    } catch (err) {
        console.error(`Whoops, trouble removing player #${playerId} from the roster!`, err);
    }
};
/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players.
 *
 * Then it takes that larger string of HTML and adds it to the DOM.
 *
 * It also adds event listeners to the buttons in each player card.
 *
 * The event listeners are for the "See details" and "Remove from roster" buttons.
 *
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player.
 *
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster.
 *
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    try {
        let playerContainerHTML = '';
        playerList.forEach((player) => {
            const playerHTML = `
                <div class="player-card">
                    <img src="${player.image}" alt="${player.name}" class="player-image">
                    <h3 class="player-name">${player.name}</h3>
                    <p class="player-breed">${player.breed}</p>
                    <div class="button-container">
                        <button class="details-button" data-player-id="${player.id}">See Details</button>
                        <button class="remove-button" data-player-id="${player.id}">Remove from Roster</button>
                    </div>
                </div>
            `;
            playerContainerHTML += playerHTML;
        });
        playerContainer.innerHTML = playerContainerHTML;
        // Add event listeners to buttons
        const detailsButtons = document.querySelectorAll('.details-button');
        detailsButtons.forEach((button) => {
            button.addEventListener('click', async (event) => {
                const playerId = event.target.dataset.playerId;
                const player = await fetchSinglePlayer(playerId);
                console.log('single', player);
                // Do something with the player details
            });
        });
        const removeButtons = document.querySelectorAll('.remove-button');
        removeButtons.forEach((button) => {
            button.addEventListener('click', async (event) => {
                const playerId = event.target.dataset.playerId;
                const removedPlayer = await removePlayer(playerId);
                console.log(`Removed player: ${removedPlayer}`);
                // Update the DOM or perform any other necessary actions
            });
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};
/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        const formHTML = `
            <form id="add-player-form">
                <h2>Add New Player</h2>
                <div>
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div>
                    <label for="breed">Breed:</label>
                    <input type="text" id="breed" name="breed" required>
                </div>
                <div>
                    <label for="image">Image URL:</label>
                    <input type="url" id="image" name="image" required>
                </div>
                <button type="submit">Add Player</button>
            </form>
        `;
        newPlayerFormContainer.innerHTML = formHTML;
        const addPlayerForm = document.getElementById('add-player-form');
        addPlayerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const nameInput = document.getElementById('name');
            const breedInput = document.getElementById('breed');
            const imageInput = document.getElementById('image');
            const newPlayer = {
                name: nameInput.value,
                breed: breedInput.value,
                image: imageInput.value,
            };
            const addedPlayer = await addNewPlayer(newPlayer);
            console.log(`Added player: ${addedPlayer}`);
            // Update the DOM or perform any other necessary actions
            // Clear the form
            nameInput.value = '';
            breedInput.value = '';
            imageInput.value = '';
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
};
const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
    renderNewPlayerForm();
};
init();

