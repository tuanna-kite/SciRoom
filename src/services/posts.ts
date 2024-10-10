import * as ImagePicker from 'expo-image-picker'
import { uploadFile } from './images'
import { supabase } from '@/lib/supabase'
import { UserProfile } from './users'
type ImagePickerAsset = ImagePicker.ImagePickerAsset

export type Post = {
  id: string
  body?: string
  file?: string
  userId: string
  user?: UserProfile
  created_at: string
  likes?: PostLike[]
  comments?: Comment[]
  nComments?: { count: number }[]
}

export type Comment = {
  id: string
  postId: string
  userId: string
  text: string
  user?: UserProfile
  created_at: string
}
export type PostData = {
  id?: string
  userId: string
  body: string
  file: ImagePickerAsset | null | string
}

export const createOrUpdatePost = async (post: PostData) => {
  try {
    // upload file
    if (post.file && typeof post.file === 'object') {
      const file = post.file as ImagePickerAsset
      const isImage = file.type === 'image'
      const folderName = isImage ? 'images' : 'videos'
      const fileResult = await uploadFile(folderName, file.uri, isImage)
      if (!fileResult.success) return { success: false, message: fileResult.message }
      post.file = fileResult.data as string
    }
    const { data, error } = await supabase.from('posts').upsert(post)

    if (error) {
      console.log(error)
      return { success: false, message: error.message }
    }
    return { success: true, data }
  } catch (error: any) {
    console.log(error)
    return { success: false, message: error.message }
  }
}

export const fetchPosts = async (limit = 1) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select<string, Post>(
        `
        *,
        user: users (id, name, image),
        likes: postLikes (*),
        nComments: comments(count)
      `,
      )
      .neq('deleted', 1)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.log(error)
      return { success: false, message: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.log(error)
    return { success: false, message: error.message }
  }
}

export const fetchPostsByUser = async (userId: string, limit = 1) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select<string, Post>(
        `
        *,
        user: users (id, name, image),
        likes: postLikes (*),
        nComments: comments(count)
      `,
      )
      .eq('userId', userId)
      .neq('deleted', 1)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.log(error)
      return { success: false, message: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.log(error)
    return { success: false, message: error.message }
  }
}

export const fetchNumberOfPosts = async () => {
  try {
    const { data, error } = await supabase.from('posts').select('count').single<{ count: number }>()

    if (error) {
      console.log(error)
      return { success: false, message: 'Could not fetch number of posts' }
    }
    return { success: true, data }
  } catch (error: any) {
    console.log(error)
    return { success: false, message: 'Could not fetch number of posts' }
  }
}

export type PostLike = {
  postId: string
  userId: string
}
export const createPostLike = async (postLike: PostLike) => {
  try {
    const { postId, userId } = postLike
    const { data, error } = await supabase
      .from('postLikes')
      .insert({ postId, userId })
      .select()
      .single<PostLike>()
    console.log(data, error)

    if (error) {
      console.log('createPostLike', error)
      return { success: false, message: 'Could not like the post' }
    }
    return { success: true, data }
  } catch (error: any) {
    console.log(error)
    return { success: false, message: 'Could not like the post' }
  }
}

export const removePostLike = async (postLike: PostLike) => {
  try {
    const { postId, userId } = postLike
    const { data, error } = await supabase
      .from('postLikes')
      .delete()
      .eq('postId', postId)
      .eq('userId', userId)

    if (error) {
      console.log(error)
      return { success: false, message: 'Could not remove like from the post' }
    }
    return { success: true, data }
  } catch (error: any) {
    console.log(error)
    return { success: false, message: 'Could not remove like from the post' }
  }
}

export const fetchPostDetail = async (postId: string) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select<string, Post>(
        `
        *,
        user: users (id, name, image),
        likes: postLikes (*),
        comments: comments (*, user: users(*))
      `,
      )
      .eq('id', postId)
      .neq('deleted', 1)
      .single<Post>()

    if (error) {
      console.log(error)
      return { success: false, message: 'Get post failed' }
    }

    return { success: true, data }
  } catch (error) {
    console.log(error)
    return { success: false, message: 'Get post failed' }
  }
}

export const deletePost = async (postId: string) => {
  try {
    const { data, error } = await supabase.from('posts').update({ deleted: 1 }).eq('id', postId)
    if (error) {
      console.log(error)
      return { success: false, message: 'Could not delete the post' }
    }
    return { success: true, data }
  } catch (error: any) {
    console.log(error)
    return { success: false, message: 'Could not delete the post' }
  }
}

export type CommentData = {
  postId: string
  userId: string
  text: string
}

export const createComment = async (comment: CommentData) => {
  try {
    const { data, error } = await supabase.from('comments').insert(comment).select().single()
    if (error) {
      console.log(error)
      return { success: false, message: 'Could not add comment' }
    }
    return { success: true, data }
  } catch (error: any) {
    console.log(error)
    return { success: false, message: 'Could not add comment' }
  }
}

export const fetchFavoritePosts = async (userId: string, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('postLikes')
      .select<string, Post>(
        `
        *,
        post: posts(*, user: users(id, name, image), likes: postLikes(*), nComments: comments(count))
      `,
      )
      .eq('userId', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.log(error)
      return { success: false, message: 'Could not fetch favorite posts' }
    }
    return { success: true, data }
  } catch (error: any) {
    console.log(error)
    return { success: false, message: 'Could not fetch favorite posts' }
  }
}
