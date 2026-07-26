"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import { fetchNotes } from "@/lib/api";

import css from "./NotesPage.module.css";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
   const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () =>
      fetchNotes({
        page,
        search,
      }),
    placeholderData: (previousData) => previousData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={inputValue}
          onChange={(value) => {
            setInputValue(value);
            debouncedSearch(value);
          }}
        />

        {data && data.totalPages > 1 && (
          <Pagination
    totalPages={data.totalPages}
    currentPage={page}
    onPageChange={setPage}
/>
        )}

        <button
          className={css.button}
          onClick={() => setIsOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}

      {error && <p>There was an error. Please try again.</p>}

      {data && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <NoteForm onClose={() => setIsOpen(false)} />
        </Modal>
      )}
    </div>
  );
}