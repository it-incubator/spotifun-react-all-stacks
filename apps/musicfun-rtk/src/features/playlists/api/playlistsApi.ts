import { baseApi } from '@/app/api/base-api.ts'
import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  Playlist,
  PlaylistsResponse,
  UpdatePlaylistArgs,
} from './playlistsApi.types.ts'
import type { Images, ReactionResponse } from '@/common/types'
import type { Nullable } from '@/common/types/common.types'
import { buildQueryString } from '@/common/utils'

export const playlistsAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
      query: (params) => {
        const { tagsIds, ...rest } = params
        const query = buildQueryString({ ...rest, tagsIds })
        return { url: `playlists/?${query}` }
      },
      providesTags: ['Playlist'],
    }),
    fetchMyPlaylists: build.query<Omit<PlaylistsResponse, 'meta'>, void>({
      query: () => ({ url: 'playlists/my' }),
      providesTags: ['Playlist'],
    }),
    fetchPlaylistById: build.query<{ data: Playlist }, string>({
      query: (playlistId) => ({ url: `playlists/${playlistId}` }),
      providesTags: (_result, _error, playlistId) => [{ type: 'Playlist', id: playlistId }],
    }),
    createPlaylist: build.mutation<{ data: Playlist }, CreatePlaylistArgs>({
      query: (body) => ({
        url: 'playlists',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Playlist'],
    }),
    updatePlaylist: build.mutation<void, { playlistId: string; payload: UpdatePlaylistArgs }>({
      query: ({ playlistId, payload }) => ({
        url: `playlists/${playlistId}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { playlistId }) => [{ type: 'Playlist', id: playlistId }, 'Playlist'],
    }),
    removePlaylist: build.mutation<void, string>({
      query: (playlistId) => ({
        url: `playlists/${playlistId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, playlistId) => [{ type: 'Playlist', id: playlistId }, 'Playlist'],
    }),
    uploadPlaylistCover: build.mutation<Images, { playlistId: string; file: File }>({
      query: ({ playlistId, file }) => {
        const formData = new FormData()
        formData.append('file', file)
        return {
          url: `playlists/${playlistId}/images/main`,
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: (_result, _error, { playlistId }) => [{ type: 'Playlist', id: playlistId }, 'Playlist'],
    }),
    deletePlaylistCover: build.mutation<void, { playlistId: string }>({
      query: ({ playlistId }) => ({ url: `playlists/${playlistId}/images/main`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, { playlistId }) => [{ type: 'Playlist', id: playlistId }, 'Playlist'],
    }),
    reorderPlaylist: build.mutation<void, { playlistId: string; putAfterItemId: Nullable<string> }>({
      query: ({ playlistId, putAfterItemId }) => ({
        url: `playlists/${playlistId}/reorder`,
        method: 'PUT',
        body: { putAfterItemId },
      }),
      invalidatesTags: (_result, _error, { playlistId }) => [{ type: 'Playlist', id: playlistId }, 'Playlist'],
    }),
    likePlaylist: build.mutation<ReactionResponse, { id: string }>({
      query: ({ id }) => ({
        url: `playlists/${id}/like`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Playlist', id }, 'Playlist'],
    }),
    dislikePlaylist: build.mutation<ReactionResponse, { id: string }>({
      query: ({ id }) => ({
        url: `playlists/${id}/dislike`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Playlist', id }, 'Playlist'],
    }),
    unReactionPlaylist: build.mutation<ReactionResponse, { id: string }>({
      query: ({ id }) => ({
        url: `playlists/${id}/reaction`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Playlist', id }, 'Playlist'],
    }),
  }),
})

export const {
  useFetchPlaylistsQuery,
  useFetchMyPlaylistsQuery,
  useFetchPlaylistByIdQuery,
  useCreatePlaylistMutation,
  useUpdatePlaylistMutation,
  useRemovePlaylistMutation,
  useUploadPlaylistCoverMutation,
  useDeletePlaylistCoverMutation,
  useReorderPlaylistMutation,
  useLikePlaylistMutation,
  useDislikePlaylistMutation,
  useUnReactionPlaylistMutation,
} = playlistsAPI
