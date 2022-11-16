import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestList, setGuestList] = useState([]);
  const baseUrl =
    'https://express-guest-list-api-memory-data-store.julxy26.repl.co';

  async function getAllGuests() {
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();
    setGuestList(allGuests);
    return allGuests;
  }

  useEffect(() => {
    getAllGuests().catch((error) => {
      console.log(error);
    });
  }, [guestList]);

  async function createGuest() {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'Post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
    });
    const data = await response.json();
    guestList.unshift(data);
    setFirstName('');
    setLastName('');
    console.log(`${data.firstName} has been added!`);
  }

  async function removeGuest(id) {
    await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    }).then((result) => {
      result
        .json()
        .then(() => {
          getAllGuests().catch(() => {});
          console.log(`guest removed`);
        })
        .catch(() => {});
    });
  }

  const changeToAttend = async function (id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: true }),
    });
    const data = await response.json();
    console.log(`🎉 ${data.firstName} is attending!`);
  };

  const changeBackToNotAttend = async function (id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: false }),
    });
    const data = await response.json();
    console.log(`😭 ${data.firstName} is not attending!`);
  };

  return (
    <div>
      <div className="divStyles">
        <h1>Guest List</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="firstName" className="inputTextStyles">
            First name
            <input
              className="nameInputStyles"
              name="firstName"
              value={firstName}
              required
              autoComplete="off"
              onChange={(e) => {
                setFirstName(
                  e.currentTarget.value.charAt(0).toUpperCase() +
                    e.currentTarget.value.slice(1),
                );
              }}
            />
          </label>

          <label htmlFor="lastName" className="inputTextStyles">
            Last name
            <input
              className="nameInputStyles"
              name="lastName"
              value={lastName}
              required
              autoComplete="off"
              onChange={(e) => {
                setLastName(
                  e.currentTarget.value.charAt(0).toUpperCase() +
                    e.currentTarget.value.slice(1),
                );
              }}
            />
          </label>
          <div className="addButtonDivStyles">
            <button className="addButtonStyles" onClick={createGuest}>
              Add guest
            </button>
          </div>
        </form>
        {guestList.length < 1 && (
          <div className="loadingStyles">Loading...</div>
        )}
      </div>

      {guestList.map((guest) => {
        return (
          <div
            className="guestDivStyles"
            key={`guest-${guest.id}`}
            data-test-id="guest"
          >
            <span className="guestNameStyles">
              {guest.firstName} {guest.lastName}
            </span>

            <div className="buttonsOnRightStyles">
              <input
                className="checkboxStyles"
                type="checkbox"
                aria-label={`${guest.firstName} ${guest.lastName} attending status`}
                checked={guest.attending}
                onChange={async () => {
                  if (guest.attending === false) {
                    await changeToAttend(guest.id);
                  } else if (guest.attending === true) {
                    await changeBackToNotAttend(guest.id);
                  }
                }}
              />
              <span className="attendingStyles">attending</span>
              <button
                className="removeButtonStyles"
                aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
                onClick={() => removeGuest(guest.id)}
              >
                Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
