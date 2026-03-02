import { useEffect } from 'react';

const FAQSchema = ({ faqs }) => {
  useEffect(() => {
    if (!faqs || faqs.length === 0) return;

    // Remove existing FAQ schema
    const existingFAQScript = document.querySelector('script[data-schema-type="faq"]');
    if (existingFAQScript) {
      existingFAQScript.remove();
    }

    // Create FAQ structured data
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };

    // Add the script to the document
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema-type', 'faq');
    script.text = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector('script[data-schema-type="faq"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [faqs]);

  return null;
};

export default FAQSchema;
