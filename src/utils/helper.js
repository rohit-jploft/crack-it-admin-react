export const getTimeFromTimestamps = (timeStamp) => {
  const date = new Date(timeStamp);

  const options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, // Set to false for 24-hour format
  };

  const formattedTime = date.toLocaleTimeString('en-US', options);
  return formattedTime;
};

export const getDateFromTimeStamps = (timeStamp) => {
  const date = new Date(timeStamp);

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const formattedDate = date.toLocaleDateString('en-US', options);

  return formattedDate;
};
export function formatEarnings(earnings) {
  if (typeof earnings !== 'number') {
    return 'Invalid input';
  }
  const k = 'k';
  if (earnings >= 1000) {
    return (earnings / 1000).toFixed(1) + k;
  }

  return earnings.toFixed(2); // Display earnings with 2 decimal places
}
export function scrollToBottom(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}
