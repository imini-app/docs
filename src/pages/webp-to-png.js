import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import { loadfile, decode } from '../utils/webp';

function Header() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">Convert webp to png in one click</h1>
      </div>
    </header>
  );
}

export default function WebpToPng() {
  const { siteConfig } = useDocusaurusContext();
  const handleCapture = ({ target }) => {

    // loadfile('https://raw.githubusercontent.com/webmproject/libwebp-demo/gh-pages/webp_js/test1.webp', 'output_canvas')

    const selectedFile = target.files[0];
    const reader = new FileReader();
    reader.onload = function () {
      const arrayBuffer = reader.result
      var webp_data = new Uint8Array(arrayBuffer);
      decode(webp_data, 'output_canvas', selectedFile.name + '.png');
    };

    reader.readAsArrayBuffer(selectedFile);
  }
  return (
    <Layout
      title={'webp to png conversion in one click'}
      description="Upload a webp image file and automatically convert to a png file in one click - imini.app">
      <Header />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              <div className={clsx('col col--12')}>
                <div className="text--center padding-horiz--md">
                  <h3 style={{ padding: '3rem 0' }}>
                    <label htmlFor="file" className="button button--primary button--lg">Upload a Webp file</label>
                    <input type="file" id="file" accept=".webp" onChange={handleCapture} style={{ display: 'none' }}></input>
                  </h3>
                  <canvas id="output_canvas">Your browser does not support canvas</canvas>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
