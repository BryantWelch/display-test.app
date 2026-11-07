import { Link } from 'react-router-dom';
import styled from 'styled-components';
import JsonLd from './JsonLd';
import { SITE } from '../registry/routeMeta';

const Nav = styled.nav`
  font-size: var(--fs-small);
  color: var(--text-subtle);
  margin-bottom: 1.25rem;

  ol {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  li + li::before {
    content: '/';
    margin-right: 0.35rem;
    color: var(--border-strong);
  }

  a:hover {
    color: var(--text);
    text-decoration: underline;
  }
`;

const Breadcrumbs = ({ items }) => {
  if (!items?.length) return null;
  const trail = [{ name: 'Home', path: '/' }, ...items];
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path === '/' ? '' : item.path}`,
    })),
  };

  return (
    <>
      <JsonLd data={data} />
      <Nav aria-label="Breadcrumb">
        <ol>
          {trail.map((item, i) =>
            i === trail.length - 1 ? (
              <li key={item.path} aria-current="page">
                {item.name}
              </li>
            ) : (
              <li key={item.path}>
                <Link to={item.path}>{item.name}</Link>
              </li>
            )
          )}
        </ol>
      </Nav>
    </>
  );
};

export default Breadcrumbs;
