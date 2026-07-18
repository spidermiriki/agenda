import { useEffect, useState } from 'react';
import { formatDateKey } from '../dateUtils';
import { addEvent, deleteEvent, subscribeToDay, updateEvent } from '../storage';
import { ASSIGNEES, assigneeLabel } from '../assignees';

function formatSchedule(schedule) {
  if (!schedule || schedule.type === 'indefini') return 'Horaire indéfini';
  if (schedule.mode === 'range') return `${schedule.start || '?'} - ${schedule.end || '?'}`;
  return `vers ${schedule.start || '?'}`;
}

function DayDetail({ date, onBack }) {
  const dateKey = formatDateKey(date);
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState(ASSIGNEES[0].id);
  const [scheduleType, setScheduleType] = useState('indefini');
  const [scheduleMode, setScheduleMode] = useState('range');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [singleTime, setSingleTime] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToDay(dateKey, setEvents);
    return unsubscribe;
  }, [dateKey]);

  function resetForm() {
    setEditingId(null);
    setTitle('');
    setAssignedTo(ASSIGNEES[0].id);
    setScheduleType('indefini');
    setScheduleMode('range');
    setStartTime('');
    setEndTime('');
    setSingleTime('');
  }

  function startEdit(event) {
    setEditingId(event.id);
    setTitle(event.title);
    setAssignedTo(event.assignedTo);
    const schedule = event.schedule || { type: 'indefini' };
    setScheduleType(schedule.type);
    if (schedule.type === 'defini') {
      setScheduleMode(schedule.mode);
      setStartTime(schedule.mode === 'range' ? schedule.start || '' : '');
      setEndTime(schedule.mode === 'range' ? schedule.end || '' : '');
      setSingleTime(schedule.mode === 'single' ? schedule.start || '' : '');
    } else {
      setScheduleMode('range');
      setStartTime('');
      setEndTime('');
      setSingleTime('');
    }
  }

  async function saveEvent() {
    const text = title.trim();
    if (!text) return;

    let schedule = { type: 'indefini' };
    if (scheduleType === 'defini') {
      schedule = scheduleMode === 'range'
        ? { type: 'defini', mode: 'range', start: startTime, end: endTime }
        : { type: 'defini', mode: 'single', start: singleTime };
    }

    if (editingId) {
      await updateEvent(editingId, { title: text, assignedTo, schedule });
    } else {
      await addEvent(dateKey, { title: text, assignedTo, schedule });
    }

    resetForm();
  }

  async function removeEvent(id) {
    await deleteEvent(id);
    if (editingId === id) resetForm();
  }

  return (
    <div className="page day-page">
      <button className="btn btn-back" onClick={onBack}>{'< Retour au mois'}</button>
      <h2 className="page-title">{date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h2>

      <ul className="events-list">
        {events.map((event) => (
          <li key={event.id} className="event-item" data-assignee={event.assignedTo}>
            <div className="event-text">
              <strong>{event.title}</strong>
              <span className="event-meta">{assigneeLabel(event.assignedTo)} — {formatSchedule(event.schedule)}</span>
            </div>
            <div className="event-actions">
              <button className="btn btn-edit" onClick={() => startEdit(event)}>Modifier</button>
              <button className="btn btn-remove" onClick={() => removeEvent(event.id)}>Supprimer</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="event-form">
        {editingId && <span className="field-label">Modification de l'événement</span>}

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ce que je fais"
        />

        <div className="field-group">
          <span className="field-label">Assigné à :</span>
          {ASSIGNEES.map((a) => (
            <label key={a.id} className="radio-label">
              <input
                type="radio"
                name="assignedTo"
                checked={assignedTo === a.id}
                onChange={() => setAssignedTo(a.id)}
              />
              {a.label}
            </label>
          ))}
        </div>

        <div className="field-group">
          <label className="radio-label">
            <input
              type="radio"
              name="scheduleType"
              checked={scheduleType === 'indefini'}
              onChange={() => setScheduleType('indefini')}
            />
            Horaire indéfini
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="scheduleType"
              checked={scheduleType === 'defini'}
              onChange={() => setScheduleType('defini')}
            />
            Horaire défini
          </label>
        </div>

        {scheduleType === 'defini' && (
          <div className="field-group">
            <label className="radio-label">
              <input
                type="radio"
                name="scheduleMode"
                checked={scheduleMode === 'range'}
                onChange={() => setScheduleMode('range')}
              />
              Plage horaire (début - fin)
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="scheduleMode"
                checked={scheduleMode === 'single'}
                onChange={() => setScheduleMode('single')}
              />
              Heure unique approximative
            </label>

            {scheduleMode === 'range' ? (
              <div className="time-inputs">
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            ) : (
              <div className="time-inputs">
                <input type="time" value={singleTime} onChange={(e) => setSingleTime(e.target.value)} />
              </div>
            )}
          </div>
        )}

        <div className="field-group">
          <button className="btn btn-add" onClick={saveEvent}>
            {editingId ? 'Enregistrer les modifications' : "Ajouter l'événement"}
          </button>
          {editingId && (
            <button className="btn btn-nav" onClick={resetForm}>Annuler</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DayDetail;
