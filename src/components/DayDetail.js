import { useEffect, useState } from 'react';
import { formatDateKey } from '../dateUtils';
import { addEvent, deleteEvent, subscribeToDay, updateEvent, addTag, deleteTag } from '../storage';
import { useTags } from '../TagsContext';

function rgbToHex(r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0'))
      .join('')
  );
}

function formatSchedule(schedule) {
  if (!schedule || schedule.type === 'indefini') return 'Horaire indéfini';
  if (schedule.mode === 'range') return `${schedule.start || '?'} - ${schedule.end || '?'}`;
  return `vers ${schedule.start || '?'}`;
}

function DayDetail({ date, onBack }) {
  const dateKey = formatDateKey(date);
  const tags = useTags();
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Formulaire d'événement
  const [title, setTitle] = useState('');
  const [tagId, setTagId] = useState('');
  const [scheduleType, setScheduleType] = useState('indefini');
  const [scheduleMode, setScheduleMode] = useState('range');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [singleTime, setSingleTime] = useState('');

  // Formulaire de création de tag
  const [showNewTag, setShowNewTag] = useState(false);
  const [newTagLabel, setNewTagLabel] = useState('');
  const [newTagR, setNewTagR] = useState(52);
  const [newTagG, setNewTagG] = useState(152);
  const [newTagB, setNewTagB] = useState(219);

  useEffect(() => {
    const unsubscribe = subscribeToDay(dateKey, setEvents);
    return unsubscribe;
  }, [dateKey]);

  function resetForm() {
    setEditingId(null);
    setTitle('');
    setTagId('');
    setScheduleType('indefini');
    setScheduleMode('range');
    setStartTime('');
    setEndTime('');
    setSingleTime('');
  }

  function startEdit(event) {
    setEditingId(event.id);
    setTitle(event.title);
    setTagId(event.tagId || '');
    const schedule = event.schedule || { type: 'indefini' };
    setScheduleType(schedule.type);
    if (schedule.type === 'defini') {
      setScheduleMode(schedule.mode || 'range');
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
      schedule =
        scheduleMode === 'range'
          ? { type: 'defini', mode: 'range', start: startTime, end: endTime }
          : { type: 'defini', mode: 'single', start: singleTime };
    }

    if (editingId) {
      await updateEvent(editingId, { title: text, tagId, schedule });
    } else {
      await addEvent(dateKey, { title: text, tagId, schedule });
    }

    resetForm();
  }

  async function removeEvent(id) {
    await deleteEvent(id);
    if (editingId === id) resetForm();
  }

  async function createTag() {
    const label = newTagLabel.trim();
    if (!label) return;
    const color = rgbToHex(newTagR, newTagG, newTagB);
    const ref = await addTag({ label, color });
    setTagId(ref.id);
    setNewTagLabel('');
    setNewTagR(52);
    setNewTagG(152);
    setNewTagB(219);
    setShowNewTag(false);
  }

  async function removeTag(id) {
    await deleteTag(id);
    if (tagId === id) {
      setTagId(tags.find((t) => t.id !== id)?.id || '');
    }
  }

  const newTagColor = rgbToHex(newTagR, newTagG, newTagB);

  return (
    <div className="page day-page">
      <button className="btn btn-back" onClick={onBack}>
        {'< Retour au mois'}
      </button>
      <h2 className="page-title">
        {date.toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </h2>

      <ul className="events-list">
        {events.map((event) => {
          const tag = tags.find((t) => t.id === event.tagId);
          const tagColor = tag?.color || 'var(--pencil-soft)';
          const parts = [tag?.label, formatSchedule(event.schedule)].filter(Boolean);
          return (
            <li
              key={event.id}
              className="event-item"
              style={{ borderLeftColor: tagColor }}
            >
              <div className="event-text">
                <strong>{event.title}</strong>
                <span className="event-meta">{parts.join(' — ')}</span>
              </div>
              <div className="event-actions">
                <button className="btn btn-edit" onClick={() => startEdit(event)}>
                  Modifier
                </button>
                <button className="btn btn-remove" onClick={() => removeEvent(event.id)}>
                  Supprimer
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="event-form">
        {editingId && <span className="field-label">Modification de l'événement</span>}

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ce que je fais"
        />

        {/* Sélecteur de tag */}
        <div className="field-group">
          <span className="field-label">Tag :</span>
          <div className="tag-selector">
            <button
              type="button"
              className={`tag-chip${tagId === '' ? ' tag-chip-selected' : ''}`}
              onClick={() => setTagId('')}
            >
              Sans tag
            </button>
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                className={`tag-chip${tagId === tag.id ? ' tag-chip-selected' : ''}`}
                onClick={() => setTagId(tag.id)}
              >
                <span className="tag-dot" style={{ backgroundColor: tag.color }} />
                {tag.label}
              </button>
            ))}
            {!showNewTag && (
              <button
                type="button"
                className="btn-new-tag"
                onClick={() => setShowNewTag(true)}
              >
                + Tag
              </button>
            )}
          </div>
        </div>

        {/* Formulaire de création d'un nouveau tag */}
        {showNewTag && (
          <div className="new-tag-form">
            <input
              type="text"
              value={newTagLabel}
              onChange={(e) => setNewTagLabel(e.target.value)}
              placeholder="Nom du tag (ex : Dreamland)"
            />

            <div className="rgb-picker">
              <div className="color-preview-row">
                <div
                  className="color-preview"
                  style={{ backgroundColor: newTagColor }}
                />
                <span className="color-hex">{newTagColor.toUpperCase()}</span>
              </div>

              {[
                { label: 'R', value: newTagR, set: setNewTagR, accent: '#e74c3c' },
                { label: 'G', value: newTagG, set: setNewTagG, accent: '#27ae60' },
                { label: 'B', value: newTagB, set: setNewTagB, accent: '#2980b9' },
              ].map(({ label, value, set, accent }) => (
                <div key={label} className="rgb-row">
                  <span className="rgb-label" style={{ color: accent }}>
                    {label}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={value}
                    onChange={(e) => set(Number(e.target.value))}
                    className="rgb-slider"
                    style={{ accentColor: accent }}
                  />
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={value}
                    onChange={(e) =>
                      set(Math.max(0, Math.min(255, Number(e.target.value))))
                    }
                    className="rgb-number"
                  />
                </div>
              ))}
            </div>

            <div className="field-group">
              <button className="btn btn-add" onClick={createTag}>
                Créer le tag
              </button>
              <button
                className="btn btn-nav"
                onClick={() => setShowNewTag(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Horaire */}
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
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            ) : (
              <div className="time-inputs">
                <input
                  type="time"
                  value={singleTime}
                  onChange={(e) => setSingleTime(e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        <div className="field-group">
          <button className="btn btn-add" onClick={saveEvent}>
            {editingId ? 'Enregistrer les modifications' : "Ajouter l'événement"}
          </button>
          {editingId && (
            <button className="btn btn-nav" onClick={resetForm}>
              Annuler
            </button>
          )}
        </div>
      </div>

      {/* Gestion des tags existants */}
      {tags.length > 0 && (
        <div className="tag-manager">
          <span className="field-label">Mes tags :</span>
          <div className="tag-manage">
            {tags.map((tag) => (
              <span key={tag.id} className="tag-manage-item">
                <span className="tag-dot" style={{ backgroundColor: tag.color }} />
                {tag.label}
                <button
                  className="btn-delete-tag"
                  onClick={() => removeTag(tag.id)}
                  title={`Supprimer le tag "${tag.label}"`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DayDetail;
