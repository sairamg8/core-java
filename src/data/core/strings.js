import immutability from './strings/immutability'
import stringPool from './strings/stringPool'
import builders from './strings/builders'
import methods from './strings/methods'

export default {
  id: 'strings',
  title: 'Strings & String Handling',
  subtitle: 'Deep dive into String immutability, String Pool, StringBuilder vs StringBuffer, and critical String methods.',
  sections: [immutability, stringPool, builders, methods],
}
