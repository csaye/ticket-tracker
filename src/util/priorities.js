import prioritiesJson from './PriorityData.json';

export const priorities = prioritiesJson.priorities.map(p => [
  p.name,
  p.className
]);
