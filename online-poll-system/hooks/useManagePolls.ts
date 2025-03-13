import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { AppDispatch, RootState } from "@/redux/store";
import {
  deletePoll,
  fetchActivePolls,
  fetchPollById,
  updatePoll,
  addPollOptions,
  selectActivePolls,
} from "@/redux/slices/pollSlice";
import { Poll } from "@/Interfaces/interface";

// Helper function to format date
const formatDateForInput = (isoString: string | undefined) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toISOString().slice(0, 16);
};

const useManagePoll = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const dispatch = useDispatch<AppDispatch>();

  const [deletingPollId, setDeletingPollId] = useState<string | null>(null);
  const [optionText, setOptionText] = useState("");
  const [newOptions, setNewOptions] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSubmittingOptions, setIsSubmittingOptions] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { activePolls, loading } = useSelector((state: RootState) => ({
    activePolls: selectActivePolls(state) || [],
    loading: state.polls.loading,
  }));

  const poll = useSelector((state: RootState) =>
    state.polls.polls.find((p) => p.id === id)
  );

  const [formData, setFormData] = useState<Partial<Poll>>({
    title: "",
    description: "",
    expires_at: "",
  });

  useEffect(() => {
    dispatch(fetchActivePolls());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchPollById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (poll) {
      setFormData({
        title: poll.title,
        description: poll.description,
        expires_at: formatDateForInput(poll.expires_at || ""),
      });
    }
  }, [poll]);

  useEffect(() => {
    if (!loading && !poll && id) {
      router.push("/manage-poll");
    }
  }, [poll, loading, id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdatePoll = async () => {
    if (!id) return;
    setIsUpdating(true);
    setMessage(null);

    try {
      await dispatch(updatePoll({ id, pollData: formData })).unwrap();
      dispatch(fetchActivePolls());
      setMessage({ type: "success", text: "Poll updated successfully!" });

      setFormData({
        title: "",
        description: "",
        expires_at: "",
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update poll. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (pollId: string) => {
    setDeletingPollId(pollId);
    try {
      await dispatch(deletePoll(pollId)).unwrap();
    } catch (error) {
      console.error("Failed to delete poll:", error);
    } finally {
      setDeletingPollId(null);
    }
  };

  const handleAddOption = () => {
    if (optionText.trim()) {
      setNewOptions([...newOptions, optionText.trim()]);
      setOptionText("");
    }
  };

  const handleSubmitOptions = async () => {
    if (!id || newOptions.length === 0) return;
    setIsSubmittingOptions(true);
    setMessage(null);

    try {
      await dispatch(addPollOptions({ id, optionsData: newOptions })).unwrap();
      dispatch(fetchActivePolls());

      setNewOptions([]);
      setMessage({ type: "success", text: "Options added successfully!" });
    } catch (error) {
      console.error("Error adding poll options:", error);
      setMessage({
        type: "error",
        text: "Failed to add options. Please try again.",
      });
    } finally {
      setIsSubmittingOptions(false);
    }
  };

  return {
    activePolls,
    loading,
    poll,
    formData,
    handleChange,
    handleSubmitOptions,
    handleDelete,
    handleUpdatePoll,
    deletingPollId,
    isUpdating,
    message,
    newOptions,
    optionText,
    setOptionText,
    handleAddOption,
    isSubmittingOptions,
  };
};

export default useManagePoll;
