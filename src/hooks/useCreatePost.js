import React from 'react'
import axios from 'axios'
import { queryCache, useMutation } from 'react-query'

export default function useCreatePost() {
  return useMutation(
    (values) => axios.post('/api/posts', values).then((res) => res.data),
    {
      onMutate: (newPost) => {
        const oldPosts = queryCache.getQueryData('posts')
        if (queryCache.getQueryData('posts')) {
          queryCache.setQueryData('posts', (old) => [...old, newPost])
        }
        return () => queryCache.setQueryData('posts', oldPosts)
      },
      onSuccess: () => {
        queryCache.invalidateQueries('posts')
      },
      onError: (error, variables, rollbackValue) => {
        console.error(error)
        if (rollback) rollback()
      },
      onSettled: () => {
        queryCache.invalidateQueries('posts')
      },
    }
  )
}
