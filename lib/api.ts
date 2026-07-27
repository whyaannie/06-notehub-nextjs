import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  search: string;
  perPage?: number;
}

export async function fetchNotes({
  page,
  search,
  perPage = 12,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      search,
    },
  });

  return data;
}

export const fetchNoteById = async (
  id: string
): Promise<Note> => {
  const response = await axios.get<Note>(
    `/notes/${id}`
  );

  return response.data;
};

interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

export async function createNote(
  note: CreateNoteData
): Promise<Note> {
  const { data } = await api.post<Note>("/notes", note);

  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);

  return data;
}