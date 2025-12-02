import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../BasicSiteView/Footer/Footer';
import '../../css/styles.css';

const LANGUAGES = ['javascript', 'python', 'java', 'htmlcss'];

const ManageGames = () => {
  const [games, setGames] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [newTask, setNewTask] = useState({
    task_type: 'memory_code',
    language: 'javascript',
    task_data: '{}',
    order: 0,
    xp_reward: 50
  });
  const [addingNew, setAddingNew] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch('http://localhost:5001/api/admin/games', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to fetch games");
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) setGames(data);
      else setError("Unexpected response");
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (gameId) => {
    setLoading(true);
    setTasks([]);
    setSelectedGame(gameId);
    setError("");
    try {
      const res = await fetch(`http://localhost:5001/api/admin/games/${gameId}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to fetch tasks");
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data.map(t => ({
          ...t,
          editMode: false,
          task_data_text: JSON.stringify(t.task_data, null, 2)
        })));
      } else setError("Unexpected response");
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (selectedGame) {
      setSelectedGame(null);
      setTasks([]);
    } else {
      navigate(-1);
    }
  };

  const toggleEdit = (id) => {
    setTasks(tasks.map(t =>
      t.id === id
        ? { ...t, editMode: !t.editMode, task_data_text: JSON.stringify(t.task_data, null, 2) }
        : { ...t, editMode: false }
    ));
  };

  const handleTaskChange = (id, field, value) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const saveTask = async (task) => {
    let taskData;
    try {
      taskData = JSON.parse(task.task_data_text);
    } catch {
      alert("Task data must be valid JSON");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/admin/games/${selectedGame}/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          task_type: task.task_type,
          language: task.language,
          task_data: taskData,
          order: parseInt(task.order) || 0,
          xp_reward: parseInt(task.xp_reward) || 50
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Error saving task");
      } else {
        alert("Task saved");
        toggleEdit(task.id);
        fetchTasks(selectedGame);
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await fetch(`http://localhost:5001/api/admin/games/${selectedGame}/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Error deleting task");
      } else {
        setTasks(tasks.filter(t => t.id !== id));
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const addTask = async () => {
    let taskData;
    try {
      taskData = JSON.parse(newTask.task_data);
    } catch {
      alert("Task data must be valid JSON");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/admin/games/${selectedGame}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          task_type: newTask.task_type,
          language: newTask.language,
          task_data: taskData,
          order: parseInt(newTask.order) || 0,
          xp_reward: parseInt(newTask.xp_reward) || 50
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Error adding task");
      } else {
        setNewTask({
          task_type: 'memory_code',
          language: 'javascript',
          task_data: '{}',
          order: 0,
          xp_reward: 50
        });
        setAddingNew(false);
        fetchTasks(selectedGame);
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const buttonStyle = {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '0.75rem 1rem',
    marginBottom: '0.5rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    backgroundColor: '#f7f7f7',
    cursor: 'pointer',
    transition: '0.2s',
  };
  const buttonHoverStyle = { backgroundColor: '#e0e0e0' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main style={{ flex: 1, padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2>Manage Games</h2>
          <button onClick={handleBack} style={{ padding: '0.6rem 1.2rem' }}>← Back</button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && (
          <>
            {!selectedGame && games.map(game => (
              <button
                key={game.id}
                style={buttonStyle}
                onMouseOver={e => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                onMouseOut={e => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
                onClick={() => fetchTasks(game.id)}
              >
                🎮 {game.title} ({game.difficulty}) - {game.xp_reward} XP
              </button>
            ))}

            {selectedGame && (
              <>
                <button
                  onClick={() => setAddingNew(!addingNew)}
                  style={{ ...buttonStyle, fontWeight: 'bold', marginBottom: '1rem' }}
                >
                  ➕ Add New Task
                </button>

                {addingNew && (
                  <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '6px' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label>Task Type:</label>
                      <select
                        value={newTask.task_type}
                        onChange={e => setNewTask({ ...newTask, task_type: e.target.value })}
                        style={{ width: '100%', marginTop: '0.2rem', padding: '0.3rem' }}
                      >
                        <option value="memory_code">Memory Code</option>
                        <option value="refactor">Refactor</option>
                        <option value="variable_hunt">Variable Hunt</option>
                        <option value="bug_infection">Bug Infection</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label>Language:</label>
                      <select
                        value={newTask.language}
                        onChange={e => setNewTask({ ...newTask, language: e.target.value })}
                        style={{ width: '100%', marginTop: '0.2rem', padding: '0.3rem' }}
                      >
                        {LANGUAGES.map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label>Task Data (JSON):</label>
                      <textarea
                        value={newTask.task_data}
                        onChange={e => setNewTask({ ...newTask, task_data: e.target.value })}
                        style={{ width: '100%', marginTop: '0.2rem', padding: '0.3rem', minHeight: '150px', fontFamily: 'monospace' }}
                        placeholder='{"code": "function sum(a, b) { return a + b; }"}'
                      />
                    </div>
                    <div style={{ marginBottom: '0.5rem', display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label>Order:</label>
                        <input
                          type="number"
                          value={newTask.order}
                          onChange={e => setNewTask({ ...newTask, order: e.target.value })}
                          style={{ width: '100%', marginTop: '0.2rem', padding: '0.3rem' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label>XP Reward:</label>
                        <input
                          type="number"
                          value={newTask.xp_reward}
                          onChange={e => setNewTask({ ...newTask, xp_reward: e.target.value })}
                          style={{ width: '100%', marginTop: '0.2rem', padding: '0.3rem' }}
                        />
                      </div>
                    </div>
                    <button onClick={addTask} style={{ marginRight: '0.5rem' }}>Save</button>
                    <button onClick={() => setAddingNew(false)}>Cancel</button>
                  </div>
                )}

                {tasks.map(task => (
                  <div key={task.id} style={{ ...buttonStyle, backgroundColor: '#fff' }}>
                    {task.editMode ? (
                      <div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <label>Task Type:</label>
                          <select
                            value={task.task_type}
                            onChange={e => handleTaskChange(task.id, 'task_type', e.target.value)}
                            style={{ width: '100%', marginTop: '0.2rem', padding: '0.3rem' }}
                          >
                            <option value="memory_code">Memory Code</option>
                            <option value="refactor">Refactor</option>
                            <option value="variable_hunt">Variable Hunt</option>
                            <option value="bug_infection">Bug Infection</option>
                          </select>
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <label>Language:</label>
                          <select
                            value={task.language}
                            onChange={e => handleTaskChange(task.id, 'language', e.target.value)}
                            style={{ width: '100%', marginTop: '0.2rem', padding: '0.3rem' }}
                          >
                            {LANGUAGES.map(lang => (
                              <option key={lang} value={lang}>{lang}</option>
                            ))}
                          </select>
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <label>Task Data (JSON):</label>
                          <textarea
                            value={task.task_data_text}
                            onChange={e => handleTaskChange(task.id, 'task_data_text', e.target.value)}
                            style={{ width: '100%', marginTop: '0.2rem', padding: '0.3rem', minHeight: '150px', fontFamily: 'monospace' }}
                          />
                        </div>
                        <div style={{ marginBottom: '0.5rem', display: 'flex', gap: '1rem' }}>
                          <div style={{ flex: 1 }}>
                            <label>Order:</label>
                            <input
                              type="number"
                              value={task.order}
                              onChange={e => handleTaskChange(task.id, 'order', e.target.value)}
                              style={{ width: '100%', marginTop: '0.2rem', padding: '0.3rem' }}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label>XP Reward:</label>
                            <input
                              type="number"
                              value={task.xp_reward}
                              onChange={e => handleTaskChange(task.id, 'xp_reward', e.target.value)}
                              style={{ width: '100%', marginTop: '0.2rem', padding: '0.3rem' }}
                            />
                          </div>
                        </div>
                        <button onClick={() => saveTask(task)} style={{ marginRight: '0.5rem' }}>Save</button>
                        <button onClick={() => toggleEdit(task.id)} style={{ marginRight: '0.5rem' }}>Cancel</button>
                        <button onClick={() => deleteTask(task.id)} style={{ color: 'red' }}>Delete</button>
                      </div>
                    ) : (
                      <div onClick={() => toggleEdit(task.id)} style={{ cursor: 'pointer' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                          📝 {task.task_type} ({task.language})
                        </div>
                        <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '0.25rem' }}>
                          Order: {task.order} | XP: {task.xp_reward}
                        </div>
                        <div style={{ fontSize: '0.85em', color: '#888', fontFamily: 'monospace', maxHeight: '100px', overflow: 'auto' }}>
                          {JSON.stringify(task.task_data).substring(0, 100)}...
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ManageGames;

