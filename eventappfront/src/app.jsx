import React, { useState } from 'react';
import { Register, Login } from './AuthComponents';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {!user ? (
        <>
          <Login onLogin={setUser} />
          <Register />
        </>
      ) : (
        <div>Bienvenue, {user.firstname} {user.lastname} !</div>
      )}
    </div>
  );
}

export default App;
