import styled from 'styled-components';
import Breadcrumbs from '../components/Breadcrumbs';
import AffiliateProducts from '../components/AffiliateProducts';
import { Page, Eyebrow, H1, Lead, Card, ExternalIcon } from '../components/ui';
import { gearSections, software } from '../data/affiliateProducts';
import { getRouteMeta } from '../registry/routeMeta';

const SoftwareList = styled.ul`
  list-style: none;
  display: grid;
  gap: 0.65rem;

  a {
    color: var(--accent);
    font-weight: 600;
    display: inline-flex;
    gap: 0.4rem;
    align-items: center;
  }

  p {
    color: var(--text-muted);
    font-size: 0.93rem;
  }
`;

const Gear = () => (
  <Page $narrow>
    <Breadcrumbs items={getRouteMeta('/gear').breadcrumbs} />
    <Eyebrow>Gear</Eyebrow>
    <H1>Calibration gear that's actually worth it</H1>
    <Lead>
      Browser tests find problems; hardware measures them. Here's what to reach for when you need numbers, when a
      cable is the real bottleneck, or when it's time for a new panel.
    </Lead>

    {gearSections.map((section) => (
      <AffiliateProducts key={section.id} title={section.title} intro={section.intro} products={section.products} />
    ))}

    <Card as="section" style={{ marginTop: '2.5rem' }} aria-labelledby="software-heading">
      <h2 id="software-heading" style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>
        Calibration software
      </h2>
      <SoftwareList>
        {software.map((s) => (
          <li key={s.href}>
            <a href={s.href} target="_blank" rel="noopener noreferrer">
              {s.name} <ExternalIcon />
            </a>
            <p>{s.note}</p>
          </li>
        ))}
      </SoftwareList>
    </Card>
  </Page>
);

export default Gear;
