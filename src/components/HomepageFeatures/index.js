import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

const FeatureList = [
  {
    title: 'More Tutorials',
    image: 'tutorial.png',
    description: (
      <>
        We reguarly publish useful tutorials about how you can develop online games,
        using different programing languages lik javascript, python. Hope you will find
        some or all of them help you in your journey of developing exciting games.
      </>
    ),
    link: '/docs/intro',
  },
  {
    title: 'Follow Our Blog',
    image: 'blog.png',
    description: (
      <>
        We will blog our tutorials, misc stuffs. If you follow our blog, you will never miss
        a single thing about game development.
      </>
    ),
    link: '/docs/intro',
  },
];

function Feature({image, title, description, link}) {
  return (
    <div className={clsx('col col--6')}>
      <div className="text--center">
        <Link to={link}><img className={styles.featureSvg} alt={title} src={`/img/${image}`} /></Link>
      </div>
      <div className="text--center padding-horiz--md">
        <h3><Link to={link}>{title}</Link></h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
