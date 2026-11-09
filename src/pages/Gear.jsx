import styled from 'styled-components';
import Breadcrumbs from '../components/Breadcrumbs';
import AdSlot from '../components/AdSlot';
import AffiliateProducts from '../components/AffiliateProducts';
import { Page, Eyebrow, H1, Lead, Card, ExternalIcon } from '../components/ui';
import { gearSections, software } from '../data/affiliateProducts';
import { getRouteMeta } from '../registry/routeMeta';

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 2.5rem;
  align-items: start;
  margin-top: 2rem;

  /* The sidebar exists only for the ad. Drop the column when that unit is empty. */
  &:has([data-slot='sidebar'][data-ad-state='empty']) {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  position: sticky;
  top: calc(var(--nav-height) + 1rem);
  min-width: 0;

  @media (max-width: 1000px) {
    position: static;
  }
`;

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
  <Page>
    <Breadcrumbs items={getRouteMeta('/gear').breadcrumbs} />
    <Eyebrow>Gear</Eyebrow>
    <H1>Calibration gear that's actually worth it</H1>
    <Lead>
      Browser tests find problems; hardware measures them. Here's what to reach for when you need numbers, when a
      cable is the real bottleneck, or when it's time for a new panel.
    </Lead>

    <Layout>
      <div>
        <AdSlot slot="banner" margin="0" />

        {gearSections.map((section, i) => (
          <div key={section.id}>
            <AffiliateProducts title={section.title} intro={section.intro} products={section.products} />
            {i === 1 ? <AdSlot slot="belowContent" margin="1.5rem 0" /> : null}
          </div>
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
      </div>
      <Sidebar>
        <AdSlot slot="sidebar" margin="0" />
      </Sidebar>
    </Layout>
  </Page>
);

export default Gear;
