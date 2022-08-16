import React from 'react'
import axios from 'axios'
import { queryCache, useMutation } from 'react-query'

export default function useSavePost() {
  return useMutation(
    (newPost) =>
      axios.patch(`/api/posts/${newPost.id}`, newPost).then((res) => res.data),
    {
      onMutate: (newPost) =>
        //update the data
        queryCache.setQueryData(['posts', newPost.id], newPost),
      onSuccess: (newPost) => {
        queryCache.setQueryData(['posts', newPost.id], newPost)
        if (queryCache.getQueryData('posts')) {
          queryCache.setQueryData('posts', (old) => {
            return old.map((d, key) => {
              if (d.id === newPost.id) {
                return newPost
              }
              return d
            })
          })
        }
        // queryCache.invalidateQueries(['posts', data.id])
      },
    }
  )
}
