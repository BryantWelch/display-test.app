/** Structured data rendered into the page body so it ships in the prerendered HTML. */
const JsonLd = ({ data }) => {
  if (!data) return null;
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
};

export default JsonLd;
