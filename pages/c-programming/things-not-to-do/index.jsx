import React from 'react';
import Head from 'next/head';
import LinkTextGroup from '@/app/components/link-group/LinkTextGroup';
import styles from '../../../app/components/link-group/LinkGroup.module.css';
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';

const SITE_URL = 'https://www.webdevdata.net';

const keyWords = [
  'c pitfalls', 'c common mistakes', 'unsafe c code', 'c programming', 'c language',
];

const seoData = {
  title:       'Things Not To Do in C: Common Pitfalls | WebDevData',
  description: 'Common C mistakes and unsafe practices across arrays, pointers, characters, files, integers, linked lists, stacks, queues, hash tables and binary trees.',
  name:        'Things We Never Do in C',
  url:         '/c-programming/things-not-to-do',
  keywords:    keyWords.join(', '),
};

export default function ThingsNotToDo() {
  const things = [
    { link: 'arrays', text: 'Learn about avoiding common pitfalls with arrays in C programming.' },
    { link: 'binary_trees', text: 'Understand common mistakes with binary trees.' },
    { link: 'characters', text: 'Discover best practices for handling characters.' },
    { link: 'files', text: 'Learn about proper file handling techniques.' },
    { link: 'hash_tables', text: 'Avoid common errors with hash tables.' },
    { link: 'integers', text: 'Master integer operations and avoid pitfalls.' },
    { link: 'linked_lists', text: 'Understand linked lists and common mistakes.' },
    { link: 'pointers', text: 'Learn about pointer management and errors.' },
    { link: 'queues', text: 'Understand how to handle queues efficiently.' },
    { link: 'stacks', text: 'Learn about stack management and common pitfalls.' },
  ];

  return (
    <>
    <Head>
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords} />
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={`${SITE_URL}${seoData.url}`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      <link rel="canonical" href={`${SITE_URL}${seoData.url}`} />
    </Head>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <div className={styles.container}>
        
      <h1 className={styles.title}>Things Not To Do in C Programming</h1>
      <br></br>
      <LinkTextGroup items={things} />
      <p className={styles.description}>
        In this section, we cover common pitfalls and mistakes that programmers often encounter when working with C.
        Each topic above  delves into specific issues and provides insights on how to avoid them, helping you write
        more efficient and error-free code.
      </p>

      
    </div>
    <ScrollUpButton></ScrollUpButton>
    </>
  );
}
