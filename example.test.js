import { it, expect } from 'vitest'
import { create } from 'mutative'

it('updates through getters', () => {
  const comments = []
  const user = {
    get comments() {
      return comments
    },
  }

  expect(Object.getOwnPropertyDescriptor(user, 'comments')).toEqual({
    configurable: true,
    enumerable: true,
    get: expect.any(Function),
    set: undefined,
  })

  const [nextUser, patches] = create(
    user,
    (draft) => {
      draft.comments.push(1)
    },
    { enablePatches: true },
  )

  expect.soft(nextUser, 'Returns the updated user').toEqual([1])
  expect
    .soft(
      Object.getOwnPropertyDescriptor(nextUser, 'comments'),
      'Preserves the getter',
    )
    .toEqual({
      configurable: true,
      enumerable: true,
      get: expect.any(Function),
      set: undefined,
    })
  expect
    .soft(patches, 'Returns correct patches')
    .toEqual([{ op: 'add', path: ['comments', 0], value: 1 }])
  expect.soft(comments, 'Updates the referenced array').toEqual([1])
})
