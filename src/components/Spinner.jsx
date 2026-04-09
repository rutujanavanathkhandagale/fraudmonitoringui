export default function Spinner({ text = "Loading..." }) {
  return (
    <div className="p-5 text-center">
      <div className="spinner-border text-primary" role="status" />
      <p className="mt-3 text-muted">{text}</p>
    </div>
  );
}
