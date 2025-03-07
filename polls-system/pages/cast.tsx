import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectPolls, voteCandidate } from "@/redux/slices/pollSlice";
import Button from "@/components/common/Button";
import Link from "next/link";

const Poll = () => {
  const dispatch = useDispatch();
  const polls = useSelector(selectPolls); // Get polls from Redux

  const [selectedPoll, setSelectedPoll] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  const handleVote = () => {
    if (!selectedCandidate || !selectedPoll) return;

    dispatch(
      voteCandidate({
        pollId: selectedPoll.id,
        candidateName: selectedCandidate,
      })
    );

    setVoteSubmitted(true);
    setSelectedPoll(null);
    setSelectedCandidate(null);
  };

  return (
    <section className="p-6 bg-white rounded-lg">
      {!selectedPoll ? (
        <>
          <h2 className="text-2xl font-bold text-primary mb-4">Vote Now</h2>
          <p className="text-secondary-text mt-2">
            Cast your vote for ongoing elections.
          </p>

          <div className="mt-4">
            <h2 className="text-lg font-semibold text-secondary">
              Available Polls
            </h2>
            <ul className="mt-2 space-y-4">
              {polls
                .filter((poll) => poll.status === "Ongoing")
                .map((poll) => (
                  <li
                    key={poll.id}
                    className="p-4 border border-border rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => setSelectedPoll(poll)}
                  >
                    {poll.title}
                  </li>
                ))}
            </ul>
          </div>
        </>
      ) : !voteSubmitted ? (
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-primary">
            {selectedPoll.title}
          </h2>
          <p className="text-gray-600">Select a candidate:</p>
          <ul className="mt-2 space-y-2">
            {selectedPoll.candidates.map((candidate, index) => (
              <li
                key={index}
                className={`p-2 border border-border rounded cursor-pointer ${
                  selectedCandidate === candidate.name
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedCandidate(candidate.name)}
              >
                {candidate.name}
              </li>
            ))}
          </ul>
          <Button
            text="Submit Vote"
            className="mt-4 w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-hover"
            onClick={handleVote}
            disabled={!selectedCandidate}
          />
        </div>
      ) : (
        <div className="text-center mt-4">
          <h3 className="text-xl font-semibold text-green-600">
            Vote Submitted!
          </h3>
          <p className="text-secondary-text mt-6 text-lg">
            Thank you for participating in the election.
          </p>
          <div className="mt-6">
            <h3 className="text-xl font-bold text-primary text-left mt-6">
              Recent Results
            </h3>
            <Link href="">
              <Button
                text="View Full Results"
                className="mt-4 bg-secondary text-white  py-4"
              />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default Poll;
