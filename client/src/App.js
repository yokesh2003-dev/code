import { useEffect, useState } from "react";

function App() {
  const [msg, setMsg] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("/api/test")
      .then((res) => res.json())
      .then((data) => setMsg(data.message))
      .catch((err) => console.error(err));
  }, []);

  const generateTasks = async () => {
    const res = await fetch("/api/tasks/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: "Build login page" }),
    });

    const data = await res.json();
    setTasks(data.tasks);
  };

  return (
    <div>
      <h1>AI Work Intelligence</h1>

      <p>{msg}</p>

      <button onClick={generateTasks}>Generate Tasks</button>

      <ul>
        {tasks.map((task, i) => (
          <li key={i}>{task}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
