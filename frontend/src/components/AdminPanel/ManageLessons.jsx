import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../BasicSiteView/Header/Header';
import Footer from '../BasicSiteView/Footer/Footer';
import '../../css/styles.css';

const ManageLessons = () => {
  const [languages, setLanguages] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [exercises, setExercises] = useState([]);

  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [newExercise, setNewExercise] = useState({ question: '', options: {}, answer: '' });
  const [addingNew, setAddingNew] = useState(false);

  const token = localStorage.getItem('token'); // JWT token admina

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch('http://localhost:5001/api/languages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setLanguages(data);
      else setError(data.error || "Unexpected response");
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async (languageId) => {
    setLoading(true);
    setModules([]); setLessons([]); setExercises([]);
    setSelectedLanguage(languageId);
    setError("");
    try {
      const res = await fetch(`http://localhost:5001/api/modules/${languageId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setModules(data);
      else setError(data.error || "Unexpected response");
    } catch (err) {
      setError("Network error");
    } finally { setLoading(false); }
  };

  const fetchLessons = async (moduleId) => {
    setLoading(true);
    setLessons([]); setExercises([]);
    setSelectedModule(moduleId);
    setError("");
    try {
      const res = await fetch(`http://localhost:5001/api/lessons/${moduleId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setLessons(data);
      else setError(data.error || "Unexpected response");
    } catch (err) {
      setError("Network error");
    } finally { setLoading(false); }
  };

  const fetchExercises = async (lessonId) => {
    setLoading(true);
    setExercises([]);
    setSelectedLesson(lessonId);
    setError("");
    try {
      const res = await fetch(`http://localhost:5001/api/exercises/${lessonId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setExercises(data.map(e => ({ ...e, editMode: false })));
      } else setError(data.error || "Unexpected response");
    } catch (err) {
      setError("Network error");
    } finally { setLoading(false); }
  };

  const handleBack = () => {
    if (selectedLesson) { setSelectedLesson(null); setExercises([]); }
    else if (selectedModule) { setSelectedModule(null); setLessons([]); }
    else if (selectedLanguage) { setSelectedLanguage(null); setModules([]); }
    else navigate(-1);
  };

  const toggleEdit = (id) => {
    setExercises(exercises.map(e => e.id === id ? { ...e, editMode: !e.editMode } : e));
  };

  const handleExerciseChange = (id, field, value) => {
    setExercises(exercises.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const saveExercise = async (exercise) => {
    try {
      const res = await fetch(`http://localhost:5001/api/exercises/${exercise.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          question: exercise.question,
          options: exercise.options,
          answer: exercise.answer
        }),
      });
      if (!res.ok) alert("Error saving exercise");
      else { alert("Exercise saved"); toggleEdit(exercise.id); }
    } catch (err) { alert("Network error"); }
  };

  const deleteExercise = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exercise?")) return;
    try {
      const res = await fetch(`http://localhost:5001/api/exercises/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) alert("Error deleting exercise");
      else setExercises(exercises.filter(e => e.id !== id));
    } catch (err) { alert("Network error"); }
  };

  const addExercise = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/exercises`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...newExercise, lesson_id: selectedLesson })
      });
      const data = await res.json();
      if (!res.ok) alert(data.error || "Error adding exercise");
      else {
        setExercises([...exercises, { ...data, editMode: false }]);
        setNewExercise({ question: '', options: {}, answer: '' });
        setAddingNew(false);
      }
    } catch (err) { alert("Network error"); }
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
      <Header />
      <main style={{ flex: 1, padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2>Manage Lessons</h2>
          <button onClick={handleBack} style={{ padding: '0.6rem 1.2rem' }}>← Back</button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && (
          <>
            {!selectedLanguage && languages.map(lang => (
              <button key={lang.id} style={buttonStyle}
                onMouseOver={e => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                onMouseOut={e => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
                onClick={() => fetchModules(lang.id)}>
                🧠 {lang.name}
              </button>
            ))}

            {selectedLanguage && !selectedModule && modules.map(m => (
              <button key={m.id} style={buttonStyle}
                onMouseOver={e => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                onMouseOut={e => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
                onClick={() => fetchLessons(m.id)}>
                📘 {m.title}
              </button>
            ))}

            {selectedModule && !selectedLesson && lessons.map(l => (
              <button key={l.id} style={buttonStyle}
                onMouseOver={e => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                onMouseOut={e => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
                onClick={() => fetchExercises(l.id)}>
                🧩 {l.title} ({l.lesson_type})
              </button>
            ))}

            {selectedLesson && (
              <>
                <button onClick={() => setAddingNew(!addingNew)} style={{ ...buttonStyle, fontWeight: 'bold', marginBottom: '1rem' }}>
                  ➕ Add New Exercise
                </button>

                {addingNew && (
                  <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '6px' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label>Question:</label>
                      <input type="text" value={newExercise.question}
                        onChange={e => setNewExercise({ ...newExercise, question: e.target.value })}
                        style={{ width: '100%', marginTop: '0.2rem', padding: '0.3rem' }} />
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label>Options (JSON):</label>
                      <textarea value={JSON.stringify(newExercise.options)}
                        onChange={e => { try { setNewExercise({ ...newExercise, options: JSON.parse(e.target.value) }); } catch {} }}
                        style={{ width: '100%', marginTop: '0.2rem', padding: '0.3rem' }} />
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label>Answer:</label>
                      <input type="text" value={newExercise.answer}
                        onChange={e => setNewExercise({ ...newExercise, answer: e.target.value })}
                        style={{ width: '100%', marginTop: '0.2rem', padding: '0.3rem' }} />
                    </div>
                    <button onClick={addExercise} style={{ marginRight: '0.5rem' }}>Save</button>
                    <button onClick={() => setAddingNew(false)}>Cancel</button>
                  </div>
                )}

                {exercises.map(e => (
                  <div key={e.id} style={{ ...buttonStyle, backgroundColor: '#fff' }}>
                    {e.editMode ? (
                      <div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <label>Question:</label>
                          <input type="text" value={e.question}
                            onChange={ev => handleExerciseChange(e.id, 'question', ev.target.value)}
                            style={{ width: '100%', marginTop: '0.2rem', padding: '0.3rem' }} />
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <label>Options (JSON):</label>
                          <textarea value={JSON.stringify(e.options)}
                            onChange={ev => { try { handleExerciseChange(e.id, 'options', JSON.parse(ev.target.value)); } catch {} }}
                            style={{ width: '100%', marginTop: '0.2rem', padding: '0.3rem' }} />
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <label>Answer:</label>
                          <input type="text" value={e.answer}
                            onChange={ev => handleExerciseChange(e.id, 'answer', ev.target.value)}
                            style={{ width: '100%', marginTop: '0.2rem', padding: '0.3rem' }} />
                        </div>
                        <button onClick={() => saveExercise(e)} style={{ marginRight: '0.5rem' }}>Save</button>
                        <button onClick={() => toggleEdit(e.id)} style={{ marginRight: '0.5rem' }}>Cancel</button>
                        <button onClick={() => deleteExercise(e.id)} style={{ color: 'red' }}>Delete</button>
                      </div>
                    ) : (
                      <div onClick={() => toggleEdit(e.id)} style={{ cursor: 'pointer' }}>
                        📝 {e.question} (Answer: {e.answer})
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

export default ManageLessons;
