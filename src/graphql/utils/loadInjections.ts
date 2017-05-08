/**
 * A utility function for requiring all files in a provided directory
 * Returns an array of double dimensions, as expected by mutationEntries
 */

import {  GraphQLFieldConfig } from 'graphql'
var requireGlob = require('require-glob')

export default function loadInjections(dirToInject: string, extensions: Array<any>, type: string): Array<[string, GraphQLFieldConfig<never, mixed>]> {
  if (extensions && extensions.length > 0 ) {
    let injections = [] as Array<[string, GraphQLFieldConfig<never, mixed>]>
    for (var index = 0; index < extensions.length; index++) {
      var element = extensions[index] as any;
      if (element.type === type) {
        injections.push([element.name, element.schema])
      }
    }
    return injections
  } else {
    if (dirToInject === '' ) return []
    const injections = requireGlob.sync(dirToInject, {
      cwd: process.cwd(),
      reducer: function (_options: any, tree: Array<[string, GraphQLFieldConfig<never, mixed>]>, file: any) {
          if (!Array.isArray(tree)) tree = []
          if (file.exports.type === type) tree.push([file.exports.name, file.exports.schema])
          return tree
        },
      })
    return injections
  }
}
