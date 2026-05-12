import { useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await fetch("http://localhost:4000/users/1/details");

      const data = await response.json();
      console.log("data", data);
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>JSON-RPC Demo</h1>

      <button onClick={fetchUser}>Get User</button>

      {user && (
        <div style={{ marginTop: "20px" }}>
          <h2>User Info</h2>

          <p>ID: {user.user.id}</p>
          <p>Name: {user.user.name}</p>

          {user.orders &&
            user.orders.map(order => {
              return (
                <div key={order.id}>
                  <p>{order.item}</p>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default App;
