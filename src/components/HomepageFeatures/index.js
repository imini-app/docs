import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

const FeatureList = [
  {
    title: 'All Tutorials',
    description: 'Step-by-step guides for building single and multiplayer online games with JavaScript, Python, Phaser, Colyseus, and Matter.js.',
    link: '/docs/intro',
  },
  {
    title: 'Flight Price Trend',
    description: 'Find the best time to fly and book for long internationalflighs.',
    link: 'https://flight-price-trend.imini.app',
  },
  {
    title: 'Scratch Games',
    description: 'Free, mobile-friendly mini games and audiobooks for kids. Learn math, reading, and logic through interactive 1-minute games and playlists.',
    link: 'https://scratch.imini.app',
  },
  {
    title: 'Swim Ontario News',
    description: 'Competitive swimming coverage across Ontario and Canada — meet results, swimmer profiles, and event updates including the Bell Trials and Ontario Championships.',
    link: 'https://swim-ontario-news.imini.app',
  },
  {
    title: 'JavaScript Games',
    description: 'Phaser.io example games including a timer app, scrolling platformer, and more interactive browser-based demos.',
    link: 'https://phaser-examples.imini.app',
  },
  {
    title: 'Blog',
    description: 'Tutorials, project updates, and misc posts about game development, programming, and everything we build.',
    link: '/blog',
  },
  {
    title: 'Multiplayer Game Source',
    description: 'Open-source collection of multiplayer games built with Colyseus, Matter.js, and Phaser.io. TypeScript, 8 stars, MIT license.',
    link: 'https://github.com/imini-app/multiple-player-colyseus-matter-phaser',
  },
  {
    title: 'Webp to PNG Converter',
    description: 'Free online tool that converts WebP images to PNG format — no uploads, runs entirely in your browser.',
    link: '/webp-to-png',
  },
];

function Feature({title, description, link}) {
  const external = link.startsWith('http');
  return (
    <div className={clsx('col col--4', styles.featureCol)}>
      <Link to={link} className={styles.featureCard}>
        <h3>{title}</h3>
        <p>{description}</p>
        {external && <span className={styles.externalIcon}>↗</span>}
      </Link>
    </div>
  );
}

export default function HomepageFeatures({ searchQuery }) {
  const filtered = searchQuery
    ? FeatureList.filter(f =>
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : FeatureList;

  return (
    <section className={styles.features}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Explore</h2>
        <div className="row">
          {filtered.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className={styles.noResults}>No tools found matching "{searchQuery}"</p>
        )}
      </div>
    </section>
  );
}
