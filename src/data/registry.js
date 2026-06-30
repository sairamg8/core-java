import basics from './core/basics'
import oop from './core/oop'
import strings from './core/strings'
import collections from './core/collections'

export const coreTopics = [basics, oop, strings, collections]
export const advancedTopics = []

const allTopics = [...coreTopics, ...advancedTopics]

export function getTopic(section, id) {
  return allTopics.find(t => t.id === id) || null
}
