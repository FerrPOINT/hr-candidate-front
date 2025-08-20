import React from 'react';
import { useParams } from 'react-router-dom';
import SimpleQAInterview from '../components/SimpleQAInterview';

const InterviewSession: React.FC = () => {
  const { id: interviewId } = useParams<{ id: string }>();
  if (!interviewId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-6">ID интервью не указан</div>
      </div>
    );
  }
  return (
    <SimpleQAInterview interviewId={parseInt(interviewId)} />
  );
};

export default InterviewSession;