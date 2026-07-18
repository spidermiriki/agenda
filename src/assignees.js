export const ASSIGNEES = [
  { id: 'controleuse', label: 'Contrôleuse', color: '#8e44ad' },
  { id: 'tram', label: 'Tram', color: '#27ae60' },
];

export function assigneeLabel(id) {
  return ASSIGNEES.find((a) => a.id === id)?.label || id;
}

export function assigneeColor(id) {
  return ASSIGNEES.find((a) => a.id === id)?.color || '#999';
}
