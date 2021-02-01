import Head from 'next/head'
import styles from '../styles/Home.module.css'
import store from '../lib/store';

export default function Home({ pull_requests }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <ul>
          {pull_requests.map(({ externalId, merged_at, merged_by, title }) => (
            <li key={externalId}>[{new Date(merged_at).toLocaleString()}] - [{merged_by}] - {title}</li>
          ))}
        </ul>
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  const pull_requests = await store.getPullRequests();
  return {
    props: { pull_requests }
  }
}