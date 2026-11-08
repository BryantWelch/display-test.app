import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Page, H1, Lead, ButtonLink, Card, Grid } from '../components/ui';
import { tests, infoPath } from '../registry';

const Wrap = styled(Page)`
  text-align: center;
  padding-top: 4rem;

  ${Lead} {
    margin: 0 auto 2rem;
  }
`;

const Suggestions = styled(Grid)`
  margin-top: 3rem;
  text-align: left;

  a {
    display: block;
    height: 100%;
  }

  h2 {
    font-size: 1.05rem;
    margin-bottom: 0.35rem;
  }

  p {
    color: var(--text-muted);
    font-size: 0.92rem;
  }

  a:hover ${Card} {
    border-color: var(--accent);
  }
`;

const NotFound = () => {
  const popular = tests.filter((t) => t.badges?.includes('Popular')).slice(0, 6);
  return (
    <Wrap>
      <H1>Page not found</H1>
      <Lead>That page doesn't exist or has moved. These are the tests most people come here for.</Lead>
      <ButtonLink to="/">Browse all tests</ButtonLink>
      <Suggestions $min="240px">
        {popular.map((t) => (
          <Link key={t.slug} to={infoPath(t)}>
            <Card>
              <h2>{t.name}</h2>
              <p>{t.summary}</p>
            </Card>
          </Link>
        ))}
      </Suggestions>
    </Wrap>
  );
};

export default NotFound;
