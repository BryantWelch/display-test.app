import { Suspense } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import Head from './components/Head';
import InfoPage from './components/InfoPage';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Gear from './pages/Gear';
import GuidesIndex from './pages/GuidesIndex';
import GuidePage from './pages/GuidePage';
import Checkup from './pages/Checkup';
import NotFound from './pages/NotFound';
import { getTest, getGuide, getLazyTest, hasFullscreen, infoPath } from './registry';

const InfoRoute = () => {
  const { slug } = useParams();
  const test = getTest(slug);
  return test ? <InfoPage test={test} /> : <NotFound />;
};

const TestRoute = () => {
  const { slug } = useParams();
  const test = getTest(slug);
  if (!test || !hasFullscreen(test)) return <NotFound />;
  const Test = getLazyTest(test);
  return (
    <ErrorBoundary label="test" resetKey={slug} backHref={infoPath(test)}>
      <Suspense
        fallback={
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: '#000',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              font: '600 1.25rem/1.4 Inter, system-ui, sans-serif',
            }}
            aria-busy="true"
          >
            {test.name}
          </div>
        }
      >
        <Test />
      </Suspense>
    </ErrorBoundary>
  );
};

const GuideRoute = () => {
  const { slug } = useParams();
  const guide = getGuide(slug);
  return guide ? <GuidePage guide={guide} /> : <NotFound />;
};

const App = () => (
  <>
    <Head />
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/gear" element={<Gear />} />
        <Route path="/guides" element={<GuidesIndex />} />
        <Route path="/guides/:slug" element={<GuideRoute />} />
        <Route path="/checkup" element={<Checkup />} />
        <Route path="/test/:slug" element={<TestRoute />} />
        <Route path="/:slug" element={<InfoRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  </>
);

export default App;
