import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Breadcrumbs from '../components/Breadcrumbs';
import { Page, Eyebrow, H1, Lead, Grid } from '../components/ui';
import { guides, guidePath } from '../registry';
import { getRouteMeta } from '../registry/routeMeta';

const GuideCard = styled(Link)`
  display: block;
  height: 100%;
  padding: 1.35rem;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--border);

  &:hover {
    border-color: var(--accent);
  }

  h2 {
    font-size: 1.15rem;
    margin-bottom: 0.4rem;
  }

  p {
    color: var(--text-muted);
    font-size: 0.95rem;
  }
`;

const GuidesIndex = () => (
  <Page>
    <Breadcrumbs items={getRouteMeta('/guides').breadcrumbs} />
    <Eyebrow>Guides</Eyebrow>
    <H1>Monitor guides</H1>
    <Lead>
      What the test results mean, what's normal for your panel, and what to do next — from the first hour with a new
      monitor to a warranty claim.
    </Lead>
    <Grid $min="280px" $gap="1rem" style={{ marginTop: '2rem' }}>
      <GuideCard to="/checkup">
        <h2>New monitor checkup</h2>
        <p>A guided, step-by-step test of a new display with a saved pass/fail report.</p>
      </GuideCard>
      {guides.map((g) => (
        <GuideCard key={g.slug} to={guidePath(g)}>
          <h2>{g.name}</h2>
          <p>{g.summary}</p>
        </GuideCard>
      ))}
    </Grid>
  </Page>
);

export default GuidesIndex;
