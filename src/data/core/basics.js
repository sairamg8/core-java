import jvm from './basics/jvm'
import dataTypes from './basics/datatypes'
import casting from './basics/casting'
import operators from './basics/operators'
import controlFlow from './basics/controlFlow'
import autoboxing from './basics/autoboxing'

export default {
  id: 'basics',
  title: 'Java Basics & Setup',
  subtitle: 'Understand JVM, JDK, JRE, data types, casting, operators and control flow.',
  sections: [jvm, dataTypes, casting, operators, controlFlow, autoboxing],
}
