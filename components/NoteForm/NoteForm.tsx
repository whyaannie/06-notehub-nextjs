"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import { createNote } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NoteTag } from "../../types/note";

const schema = Yup.object({
  title: Yup.string()
    .min(3)
    .max(50)
    .required("Required"),

  content: Yup.string().max(500),

  tag: Yup.string()
    .oneOf([
      "Todo",
      "Work",
      "Personal",
      "Meeting",
      "Shopping",
    ])
    .required("Required"),
});

interface NoteFormProps {
  onClose: () => void;
}

export default function NoteForm({
  onClose,
}: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      onClose();
    },
  });

      interface FormValues {
  title: string;
  content: string;
  tag: NoteTag;
}
      const initialValues: FormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

  return (
  <Formik
  initialValues={initialValues}
  validationSchema={schema}
  onSubmit={(values) => mutation.mutate(values)}
    >

      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>

          <Field
            id="title"
            name="title"
            className={css.input}
          />

          <ErrorMessage
            name="title"
            component="span"
            className={css.error}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>

          <Field
            as="textarea"
            rows={8}
            id="content"
            name="content"
            className={css.textarea}
          />

          <ErrorMessage
            name="content"
            component="span"
            className={css.error}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>

          <Field
            as="select"
            id="tag"
            name="tag"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>

          <ErrorMessage
            name="tag"
            component="span"
            className={css.error}
          />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={css.submitButton}
            disabled={mutation.isPending}
          >
            Create note
          </button>
        </div>
      </Form>
      </Formik>
  );
}