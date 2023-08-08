import React from "react";

interface Props {
  message: string;
}

const Notification: React.FC<Props> = ({ message }) => {
  return (
    <div className="fixed top-6 items-center bg-red-500 text-white px-4 py-2 rounded shadow">
      {message}
    </div>
  );
};

export default Notification;
