import overview from './collections/overview'
import list from './collections/list'
import setTypes from './collections/setTypes'
import mapTypes from './collections/mapTypes'
import queue from './collections/queue'
import comparisons from './collections/comparisons'

export default {
  id: 'collections',
  title: 'Collections Framework',
  subtitle: 'Master List, Set, Map, Queue — their internal workings, time complexities, and when to use which.',
  sections: [overview, list, setTypes, mapTypes, queue, comparisons],
}
