export const fetchPolls = async () => {
  const response = await fetch("/api/polls");
  return response.json();
};

export const submitVote = async (pollId: number, candidateName: string) => {
  await fetch(`/api/polls/${pollId}/vote`, {
    method: "POST",
    body: JSON.stringify({ candidateName }),
    headers: { "Content-Type": "application/json" },
  });
};
