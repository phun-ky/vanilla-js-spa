export const ErrorPage = ({ params }) => {
  const { error } = params;

  return `<div>
      <h1>Something went wrong</h1>
      <p>${error}</p>
      <pre>
        <code>${error.stack}</code>
      </pre>
    </div>`;
};
