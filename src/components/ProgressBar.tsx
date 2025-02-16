interface ProgressBarProps {
  progress: number;
}

const ProgressBar = (props: ProgressBarProps) => {
  const clampedProgress = Math.min(Math.max(props.progress, 0), 100); // Garante que progress fique entre 0 e 100

  return (
    <div
      className="progressbard d-flex align-items-center p-1"
      style={{
        backgroundColor: "#a5f3fb",
        borderRadius: 20,
        width: "100%",
        height: 20,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          backgroundColor: "#03b6d4",
          width: `${clampedProgress}%`,
          height: "100%",
          borderRadius: 20,
          position: "absolute",
          left: 0,
          top: 0,
          transition: "width 0.3s ease-in-out",
        }}
      ></div>
      <span
        className="fw-bold"
        style={{
          fontSize: 13,
          position: "relative",
          zIndex: 1,
          width: "100%",
          textAlign: "center",
        }}
      >
        {clampedProgress}%
      </span>
    </div>
  );
};

export default ProgressBar;

// #03b6d4 First
// #a5f3fb Second
