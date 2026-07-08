import React, { useState } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

function HomepageHeader({ onSearch }) {
  const {siteConfig} = useDocusaurusContext();
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search tools, tutorials, games..."
            value={query}
            onChange={handleChange}
            className={styles.searchInput}
          />
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Layout
      title="imini.app — Tools, Tutorials, Games & More"
      description="Your hub for useful online tools, game development tutorials, free kids games, swimming news, flight price tracking, and more from imini.app.">
      <HomepageHeader onSearch={setSearchQuery} />
      <main>
        <HomepageFeatures searchQuery={searchQuery} />
      </main>
    </Layout>
  );
}
