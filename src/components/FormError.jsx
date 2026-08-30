// One line of danger-coloured text above the submit button. No icons, no boxes.
export default function FormError({ message }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-body text-danger">
      {message}
    </p>
  );
}
